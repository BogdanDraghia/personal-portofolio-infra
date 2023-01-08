const AWS = require('aws-sdk');
const ecs = new AWS.ECS({ region: "eu-west-3" });
const ec2 = new AWS.EC2({ region: "eu-west-3" });
exports.handler = async (event, context) => {
  const query = event.queryStringParameters
  const path = event.requestContext.http.path
  let result
  const params = {
    clusters: ["BackendInfraStrack-ClusterEB0386A7-Za5dwwmV8Avo"]
  };
  try {
    switch (path) {
      case '/ecs':
        if (query.desiredRunning === "run" || query.desiredRunning === "stop") {
          result = await startStopServiceTask(query.desiredRunning)
        } else {
          throw new Error(`Invalid value for desiredRunning, accepted only run/stop: ${query.desiredRunning}`)
        }
        break;
      default:
        throw new Error(`Unrecognized path: ${path}`)
    }
    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (err) {
    console.log(err, err.stack);
    return {
      statusCode: err.statusCode || 500,
      body: JSON.stringify({
        error: err.message,
      }),
    }
  };

  async function startStopServiceTask(desiredTaskStatus) {
    let desiredRunning = desiredTaskStatus === "run" ? true : false;
    try {
      let paramsService = {
        cluster: "BackendInfraStrack-ClusterEB0386A7-Za5dwwmV8Avo",
        service: "BackendInfraStrack-FargateServiceAC2B3B85-67P4fwdGkwNZ",
        desiredCount: desiredRunning ? 1 : 0
      };

      await ecs.updateService(paramsService).promise()
      let resPublicIp = await waitUntilDesiredStatusResolve(desiredRunning)

      return {
        message: `ECS request handled successfully`,
        publicIp:resPublicIp,
        desiredTaskStatus:desiredTaskStatus,
      };
    } catch (err) {
      throw Error(err)
    }
  }
}


async function waitUntilDesiredStatusResolve(desiredRunning) {
  let listParams = {
    cluster: "BackendInfraStrack-ClusterEB0386A7-Za5dwwmV8Avo",
    serviceName: "BackendInfraStrack-FargateServiceAC2B3B85-67P4fwdGkwNZ",
  }
  let startTime = Date.now()
  let timeout = 90000 
  let taskState = undefined
  let publicIp = undefined
  while (desiredRunning !== taskState) {
    if (Date.now() - startTime > timeout) {
      throw new Error(`Timed out after ${timeout} milliseconds`);
    }
    let listTasks = await ecs.listTasks(listParams).promise()
    if (listTasks.taskArns.length === 0) {
      taskState = false
    } else {
      let describeTask = await ecs.describeTasks({
        cluster: "BackendInfraStrack-ClusterEB0386A7-Za5dwwmV8Avo",
        tasks: [listTasks.taskArns[0]]
      }).promise()
      console.log(describeTask.tasks[0].lastStatus )
      if(
          describeTask.tasks[0].lastStatus === "RUNNING"
      ){
        taskState = true
        let EniValue = describeTask.tasks[0].attachments[0].details[1].value
        publicIp = await ec2.describeNetworkInterfaces({
          NetworkInterfaceIds: [
            EniValue
          ]
        }).promise()
      }else{
        taskState = false
      }
    }
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
  return publicIp === undefined  ? undefined : publicIp.NetworkInterfaces[0].Association.PublicIp
}
