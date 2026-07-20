const { SQS } = require('../../../../config/constants');

const deleteMsg = async function ({ id }) {
  try {
    // params required for deleting the msg from the queue
    let deleteParams = {
      QueueUrl: process.env.AWS_NOTIFICATION_QUEUE_URL,
      ReceiptHandle: id,
    };

    // Deletes the msg from the queue
    SQS.deleteMessage(deleteParams, (err, data) => {
      if (err) {
        return { isError: true, data: err?.message || err };
      }
      return { isError: false, data };
    });
  } catch (error) {
    console.log('error in delete msg helper', error);
    return { isError: true, data: error.message };
  }
};

module.exports = deleteMsg;
