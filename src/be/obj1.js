
// https://docs.microsoft.com/en-us/azure/service-bus-messaging/service-bus-nodejs-how-to-use-topics-subscriptions-new-package#receive-messages-from-a-subscription

const { ServiceBusClient, ReceiveMode } = require("@azure/service-bus");

let connectionString = "Endpoint=sb://licenseplatepublisher.servicebus.windows.net/;SharedAccessKeyName=ConsumeReads;SharedAccessKey=VNcJZVQAVMazTAfrssP6Irzlg/pKwbwfnOqMXqROtCQ="
let topicName = "licenseplateread";
let subscriptionName = "eG4y7VYFse8NvW53";

async function main() {
  // Create  Connection to Service Bus instance
  var sbClient = ServiceBusClient.createFromConnectionString(connectionString);
  const subscriptionClient = sbClient.createSubscriptionClient(topicName, subscriptionName);
  const receiver = subscriptionClient.createReceiver(ReceiveMode.peekLock);

  try {
    const messages = await receiver.receiveMessages(10);
    console.log("Received messages:");
    console.log(messages.map(message => message.body));

    await subscriptionClient.close();
  } finally {
    await sbClient.close();
  }

}

main().catch((err) => {
  console.log("Error occurred: ", err);
});
