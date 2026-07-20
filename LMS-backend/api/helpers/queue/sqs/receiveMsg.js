const { SQS, EVENT_TYPES } = require('../../../../config/constants');
const { asyncForEach } = require('../../../utils/asynsForEach');
const { processMailMsgs } = require('../../mail/processMailMessages');

const receiveMsg = async function () {
  try {
    // Define SQS options params
    const params = {
      QueueUrl: process.env.AWS_NOTIFICATION_QUEUE_URL,
      MaxNumberOfMessages: 10,
      VisibilityTimeout: 5,
      WaitTimeSeconds: 0,
      MessageAttributeNames: ['Type'],
    };

    // Receive msgs from SQS
    SQS.receiveMessage(params, async (err, data) => {
      if (err) {
        // if there are error in receiving the messages, then return
        return;
      } else if (!data.Messages) {
        // if there are no messages in the queue then return
        return;
      }
      // Loop through the messages received and process them based on their type
      await asyncForEach(data.Messages, async (element) => {
        let msgType = await element.MessageAttributes.Type.StringValue;
        let msgData = await JSON.parse(element.Body);
        var paramsData = {
          QueueUrl: params.QueueUrl,
          ReceiptHandle: element.ReceiptHandle,
          VisibilityTimeout: 0,
        };

        switch (msgType) {
          case EVENT_TYPES.MAIL:
            //call process message helper
            await processMailMsgs(msgData, element.ReceiptHandle).catch(
              async (err) => {
                console.log(err);
              }
            );
            break;

          default:
            SQS.changeMessageVisibility(paramsData, (err, data) => {
              if (err) {
                console.log(err);
              }
            });
            break;
        }
      });
    });
  } catch (error) {
    console.log('error in receive msg helper', error);
    return;
  }
};

module.exports = receiveMsg;
