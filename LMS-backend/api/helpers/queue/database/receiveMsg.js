const { EVENT_TYPES, STATUS } = require('../../../../config/constants');
const { asyncForEach } = require('../../../utils/asynsForEach');
const { processMailMsgs } = require('../../mail/processMailMessages');

const receiveMsg = async function ({ sourceFilePath }) {
  try {
    // find pending messages in sqs table
    let messages = await Sqs.findAll({
      where: { status: STATUS.SQS.PENDING },
    });

    if (messages.length > 0) {
      let ids = [];

      //filters all message ids into ids array
      messages.filter((item) => {
        ids.push(item.id);
      });

      //updates status to in progess for that messages
      await Sqs.update(
        {
          status: STATUS.SQS.IN_PROGRESS,
        },
        {
          where: { id: ids },
        }
      );

      //process messages
      await asyncForEach(messages, async (element) => {
        //gets type, subtype, payload and id from message element
        let { type, subtype, payload, id } = element;

        //construct object to be used in further processing
        let msgData = { type, subtype, payload: JSON.parse(payload) };

        switch (type) {
          case EVENT_TYPES.MAIL:
            //call process message helper
            await processMailMsgs(msgData, id).catch(async (err) => {
              console.log(err);

              //updates status to error for current message
              await Sqs.update(
                {
                  status: STATUS.SQS.ERROR,
                  error: err.toString(),
                },
                {
                  where: { id },
                }
              );
            });
            break;

          default:
            break;
        }
      });
    }
  } catch (error) {
    console.log('error in receive msg helper', error);

    //return error
    return;
  }
};

module.exports = receiveMsg;
