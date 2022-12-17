const AWS = require('aws-sdk');
const ecs = new AWS.ECS();
const ec2 = new AWS.EC2();
exports.handler = async (event, context) => {
  const query= event.queryStringParameters
  const path = event.requestContext.http.path
  let result
  const params = {
    clusters: ["BackendInfraStrack-ClusterEB0386A7-Za5dwwmV8Avo"]
  };
  try {
    switch(path){
      case '/ecs':
        if(query.run=== "true" || query.run==="false"){
          result = await startStopServiceTask(query.run)
        }else{
          throw new Error(`Invalid value for run, accepted only true/false: ${path}`)
        }
        break;
      case '/getip':
        result = await getIpTask()
        break;
      default:
        throw new Error(`Unrecognized path: ${path}`)
    }
    // const data = await ecs.describeClusters(params).promise();
    // const cluster = data.clusters[0];
    // console.log(`Cluster ARN: ${cluster.clusterArn}`);
    // console.log(`Cluster Status: ${cluster.status}`);
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


async function getIpTask () {
  // Return the public ip from fargate task

  let params = {
    cluster:"BackendInfraStrack-ClusterEB0386A7-Za5dwwmV8Avo",
    serviceName: "BackendInfraStrack-FargateServiceAC2B3B85-67P4fwdGkwNZ",
  }
  let listTasks = await ecs.listTasks(params).promise()
  let arnRunningTask = listTasks.taskArns[0]
  let describeTask = await ecs.describeTasks({
    cluster:"BackendInfraStrack-ClusterEB0386A7-Za5dwwmV8Avo",
    tasks:[arnRunningTask]
  }).promise()
  let EniValue = describeTask.tasks[0].attachments[0].details[1].value
  let publicIp = await ec2.describeNetworkInterfaces({  NetworkInterfaceIds: [
    EniValue
 ]}).promise()

  return publicIp.NetworkInterfaces[0].Association.PublicIp
}

async function startStopServiceTask (state){
  // Fargate Service stop or start
  let params = {
    cluster:"BackendInfraStrack-ClusterEB0386A7-Za5dwwmV8Avo",
    service: "BackendInfraStrack-FargateServiceAC2B3B85-67P4fwdGkwNZ",
    desiredCount: (state == "true")? 1 : 0
  };
  await ecs.updateService(params).promise()
  //
  return {
    message: `ECS request handled successfully,${params.desiredCount}`,
  };
}
}