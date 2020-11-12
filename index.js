var AWS = require('aws-sdk');

AWS.config.region = 'us-east-1';

var sqs = new AWS.SQS();

var queueUrl;
var params = {
  QueueName: 'test-queue',
  Attributes: {
    ReceiveMessageWaitTimeSeconds: '20',
    VisibilityTimeout: '60'
  }
};
sqs.createQueue(params, function(err, data) {
  if (err) console.log(err, err.stack); 
  else {
    console.log('Successfully created SQS queue URL '+ data.QueueUrl); 
  }
});