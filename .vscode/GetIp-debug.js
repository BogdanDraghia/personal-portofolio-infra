(async function () {
    let event = {
        queryStringParameters:{run:"true"},
        requestContext:{http:{path:"/getip"}}
    }
    const { handler } = require("../src/lambda/index.js");
    const response = await handler(event);
    console.log(response);
  })();

  