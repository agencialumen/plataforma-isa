exports.handler = async (event) => {
  console.log("Webhook recebido!");
  return {
    statusCode: 200,
    body: "OK",
  };
};