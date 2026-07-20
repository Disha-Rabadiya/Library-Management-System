const { deleteMedia } = require('../api/utils/deleteMedia');

module.exports = {
  jobs: {
    //cron for deleting unnecessary media from db and storage
    myFirstJob: {
      schedule: '00 00 00 * * *',
      start: process.env.ENABLE_CRON === 'Y', // Controlled by env variable
      onTick: async () => {
        // console.log('Running myFirstJob - every day!');
        try {
          // ... your asynchronous task logic here ...
          await deleteMedia();
        } catch (error) {
          console.error('Error in myFirstJob:', error);
        }
      },
    },
    // ... other cron jobs
  },
};
