
// https://docs.microsoft.com/en-us/azure/service-bus-messaging/service-bus-nodejs-how-to-use-topics-subscriptions-new-package#receive-messages-from-a-subscription

const { ServiceBusClient, ReceiveMode } = require("@azure/service-bus");

let csReceive = "Endpoint=sb://licenseplatepublisher.servicebus.windows.net/;SharedAccessKeyName=ConsumeReads;SharedAccessKey=VNcJZVQAVMazTAfrssP6Irzlg/pKwbwfnOqMXqROtCQ="
let tnReceive = "licenseplateread";
let snReceive = "eG4y7VYFse8NvW53";

let csSend = "Endpoint=sb://licenseplatepublisher.servicebus.windows.net/;SharedAccessKeyName=listeneronly;SharedAccessKey=w+ifeMSBq1AQkedLCpMa8ut5c6bJzJxqHuX9Jx2XGOk=";
let tnSend = "wantedplatelistupdate";
let snSend = "XERKr4N38YbXNQFu";

let wantedList = ["003VLH", "005AFA", "006ZCC", "024PFV", "026VDX", "027SSD", "027WMW", "033ASK", "034XMW", "041PSJ", "047PGM", "048MQJ746", "060BJQ", "065AJP", "065TZN", "072WGT", "075VJN", "088ASJ", "092PYB", "099PGW", "103EEN", "106WER", "106XBJ", "137XDD", "145LRR", "150HZN", "152WXQ", "160VGM", "170YYT", "186HMJ", "199SVC305", "204PYE", "209RHW", "214SSS", "217VMT", "218ZLZ", "218ZVN97", "220WNZ", "221HWM", "241SXX", "244WFB", "245HWN", "246ADW", "250TMW", "251HLL", "251KLK", "251WLL", "262LTC", "276XYK", "294TVT48", "327WST", "333LBJ", "380RHW", "488MTK", "490RVQ", "498YRH", "529YHG", "698VLK", "850WPS", "Q33AS"];

async function main() {
  // Get
  var sbClientReceive = ServiceBusClient.createFromConnectionString(csReceive);
  const subscriptionClient = sbClientReceive.createSubscriptionClient(tnReceive, snReceive);
  const receiver = subscriptionClient.createReceiver(ReceiveMode.peekLock);

  let bodyReceived;
  try {
    const messages = await receiver.receiveMessages(50);
    bodyReceived = messages.map(message => message.body)
    console.log("Received messages:");
    // console.log(bodyReceived[0].LicensePlate);

    await subscriptionClient.close();
  } finally {
    await sbClientReceive.close();
  }

  // Convert body
  let foundWanted = [];
  for (var i = 0; i < bodyReceived.length; i++) {
    console.log(bodyReceived[i].LicensePlate);
    if (wantedList.includes(bodyReceived[i].LicensePlate))
      foundWanted.push({
        "LicensePlateCatureTime": bodyReceived[i].LicensePlateCaptureTime,
        "LicensePlate": bodyReceived[i].LicensePlate,
        "Latitude": bodyReceived[i].Latitude,
        "Longitude": bodyReceived[i].Longitude
      });
  }

  console.log(foundWanted);
  if(foundWanted.length) {

    fetch(csSend, {
      method: "POST",
      body: JSON.stringify(message.body)
    }).then(res => {
      console.log("Request complete! response:", res);
    });

    // Send
    // var sbClientSend = ServiceBusClient.createFromConnectionString(csSend);
    // // const subscriptionClientSend = sbClientReceive.createSubscriptionClient(tnSend, snSend);
    // const topicClient = sbClientSend.createTopicClient(tnSend);
    // const sender = topicClient.createSender();
  
    // try {
    //   const message = {
    //     body: foundWanted
    //   };
    //   console.log(`Sending message:` + JSON.stringify(message.body));
    //   await receiver.send(JSON.stringify(message.body));
  
    //   await topicClient.close();
    // } finally {
    //   await sbClientSend.close();
    // }
  }

}

main().catch((err) => {
  console.log("Error occurred: ", err);
});
