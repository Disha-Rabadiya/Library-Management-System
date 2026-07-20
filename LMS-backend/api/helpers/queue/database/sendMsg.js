const { UUID, STATUS } = require('../../../../config/constants');

const sendMsg = async function ({ type, subtype, data }) {
  try {
    //create sqs message in sqs table
    let createMessage = await Sqs.create({
      id: UUID(),
      type,
      status: STATUS.SQS.PENDING,
      subtype,
      payload: JSON.stringify(data),
    });
    return { isError: false, data: createMessage };
  } catch (error) {
    console.log('error in send msg helper', error);
    return { isError: true, data: error.message };
  }
};

module.exports = sendMsg;
