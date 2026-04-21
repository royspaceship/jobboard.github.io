const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

async function cleanupOldJobs() {
  console.log('Cleaning up old jobs...');

  // Delete jobs older than 7 days
  var cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 7);

  const { data, error } = await supabase
    .from('jobs')
    .delete()
    .lt('posted_at', cutoff.toISOString());

  if (error) {
    console.error('Cleanup error:', error.message);
  } else {
    console.log('Old jobs cleaned up successfully!');
  }
}

cleanupOldJobs();
