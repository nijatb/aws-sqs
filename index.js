var AWS = require('aws-sdk');

AWS.config.region = 'us-east-1';

var sqs = new AWS.SQS();

var params = {
  QueueName: 'test-queue',
  Attributes: {
    ReceiveMessageWaitTimeSeconds: '20',
    VisibilityTimeout: '60'
  }
};

var queueUrl;
sqs.createQueue(params, function(err, data) {
  if (err) console.log(err, err.stack);
  else {
    console.log('Successfully created SQS queue URL ' + data.QueueUrl);
    queueUrl = data.QueueUrl;
    sendMessagesToSQS(data.QueueUrl);
    //createMessagesUsingSNS()
  }
});

// Send 50 messages to SQS
async function sendMessagesToSQS(queueUrl) {
  var messages = [];
  for (var i = 0; i < 5; i++) {
    messages[i] = [];
    for (var j = 0; j < 10; j++) {
      messages[i][j] = 'Message number ' + (i * 10 + j) + '.';
    }
  }

  // Asynchronously deliver messages in a batch of 10 x 5 times to SQS queue  
  for (const message of messages) {
    console.log('Sending message: ' + message)
    params = {
      Entries: [],
      QueueUrl: queueUrl /* required */
    };
    for (var i = 0; i < 10; i++) {
      params.Entries.push({
        MessageBody: message[i],
        Id: 'Message' + (messages.indexOf(message) * 10 + i)
      });
    }
    await sqs.sendMessageBatch(params, function(err, data) {
      if (err) console.log(err, err.stack);
      else console.log(data);
    });
  }
}

// Create an SNS messages var sns = new AWS.SNS(); 
function createMessagesUsingSNS(){ 
  var sns = new AWS.SNS();

  var message = 'This is a message from Amazon SNS'; 
  console.log('Sending messages: '+ message); 
  sns.publish({ 
    Message: message, 
    TargetArn: 'TOPIC_ARN' 
    
  }, function(err, data) { 
    if (err) console.log(err.stack); 
    else console.log('Message sent by SNS: '+ data. MessageId);
  });
}

var waitingSQS = false;
var queueCounter = 0;

setInterval(function() {
  if (!waitingSQS) { // Still busy with previous request
    if (queueCounter <= 0) {
      receiveMessages();
    }
    else --queueCounter; // Reduce queue counter
  }
}, 1000);

// Receive messages from queue
function receiveMessages() {
  var params = {
    QueueUrl: queueUrl, // required
    MaxNumberOfMessages: 10,
    VisibilityTimeout: 60,
    WaitTimeSeconds: 20 
  };
  waitingSQS = true;
  sqs.receiveMessage(params, function(err, data) {
    if (err) {
      waitingSQS = false;
      console.log(err, err.stack);
    }
    else {
      waitingSQS = false;
      if ((typeof data.Messages !== 'undefined') && (data.Messages.length !== 0)) {
        console.log('Received '+data.Messages.length+' messages from SQS queue.');
        processMessages(data.Messages);
      }
      else {
        queueCounter = 60;
        console.log('SQS queue empty, waiting for ' + queueCounter + 's.');
      }
    }
  });
}

async function processMessages(messagesSQS) {
  for (const item of messagesSQS) {
    await console.log('Processing message: ' + item.Body); 
    var params = {
      QueueUrl: queueUrl,
      ReceiptHandle: item.ReceiptHandle
    }
    await sqs.deleteMessage(params, function(err, data) {
      if (err) console.log(err, err.stack);
      else {
        console.log('Deleted message RequestId: ' +
          JSON.stringify(data.ResponseMetadata.RequestId));
      }
    })
  }
}