const deleteMsg = async function ({ id }) {
  try {
    //delete sqs message from database
    await Sqs.destroy({
      where: {
        id,
      },
    });

    return { isError: false, data: true };
  } catch (error) {
    console.log('error in delete msg helper', error);
    return { isError: true, data: error.message };
  }
};

module.exports = deleteMsg;
