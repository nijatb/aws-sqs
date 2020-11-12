
Sample code to test AWS SQS and SNS

SQS Accedd Policy used:

{ 
  "Statement": 
  [
    { 
      "Effect":"Allow", 
      "Principal": { "Service": "sns.amazonaws.com" },
      "Action":"sqs:SendMessage", "Resource":"YOUR_SQS_QUEUE_ARN",
      "Condition":{ 
        "ArnEquals":{ 
          "aws:SourceArn":"SNS_TOPIC_ARN" 
        } 
      } 
    }
  ]
  }