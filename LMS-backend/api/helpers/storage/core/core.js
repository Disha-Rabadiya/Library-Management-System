const storageCore = async function (action, payload) {
  try {
    // Dynamically require the correct helper based on driver and action
    const helper = require(`../${process.env.STORAGE_DRIVER}/${action}`);

    // Call the default export of the helper module
    const result = await helper(payload);

    if (result.isError) {
      return { isError: true, data: result.data };
    }
    return { isError: false, data: result.data };
  } catch (error) {
    console.log('error in storage core helper', error);
    return { isError: true, data: error.message };
  }
};

module.exports = { storageCore };
