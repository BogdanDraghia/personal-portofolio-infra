(async function () {
    let event = {
        queryStringParameters:{desiredRunning:"stop"},
        requestContext:{http:{path:"/ecs"}}
    }
    const { handler } = require("../src/lambda/index.js");
    const response = await handler(event);
    console.log(response);
  })();

  