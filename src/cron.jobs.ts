import cron from 'node-cron';

/**
 * [TODO] Run cron jobs every two months at 1:00 AM
 */
export default function start_cron_jobs() {
  cron.schedule('* * * * *', () => {
    console.log('running a task every minute');
  });
}


