const { SQS } = require('../../../../config/constants');

const sendMsg = async function ({ type, subtype, data, queueType }) {
  try {
    let params = {
      MessageBody: JSON.stringify({ type, subtype, payload: data }),
      QueueUrl: queueType,
      MessageAttributes: {
        Type: {
          DataType: 'String',
          StringValue: type,
        },
      },
    };

    //send message
    SQS.sendMessage(params, (err, data) => {
      if (err) {
        return { isError: true, data: err?.message || err };
      } else {
        return { isError: false, data };
      }
    });
  } catch (error) {
    console.log('error in send msg helper', error);
    return { isError: true, data: error.message };
  }
};

module.exports = sendMsg;
