// cronJobs.js // (example filename, could be part of your startup scripts)

const cron = require('node-cron');
const cronConfig = require('../../config/cron');

/**
 * Initializes and schedules cron jobs based on the configuration.
 * Provides clear logging messages for success and disabled jobs.
 */
const initializeCronJobs = () => {
  for (const jobName in cronConfig.jobs) {
    const job = cronConfig.jobs[jobName];

    if (job.start) {
      try {
        // Attempt to schedule the job
        cron.schedule(job.schedule, job.onTick);

        // Enhanced Logging
        console.log(`Cron job '${jobName}' scheduled successfully.`);
        // console.log(`   - Next Execution: ${task.nextDates(1)}`); // Helpful for debugging
      } catch (error) {
        console.error(`Error scheduling cron job '${jobName}':`, error);
      }
    } else {
      // Use a more informative log level (like debug or info)
      console.info(
        `Cron job '${jobName}' is disabled (Likely due to 'start' being false).`
      );
    }
  }
};

// You could export and call the function like so:
// in your app.js
// initializeCronJobs();

module.exports = { initializeCronJobs };
