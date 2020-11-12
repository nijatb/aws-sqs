// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');

/**
 * Don't hard-code your credentials!
 * Create an IAM role for your EC2 instance instead.
 */

// Set your region
AWS.config.region = 'us-east-1';

var sqs = new AWS.SQS();

//Create an SQS Queue
var queueUrl;
var params = {
  QueueName: 'backspace-lab', /* required */
  Attributes: {
    ReceiveMessageWaitTimeSeconds: '20',
    VisibilityTimeout: '60'
  }
};
sqs.createQueue(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else {
    console.log('Successfully created SQS queue URL '+ data.QueueUrl);     // successful response
  }
});