const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

async function fetchAndSaveJobs() {
  console.log('Fetching jobs...');

  const response = await fetch(
    'https://jsearch.p.rapidapi.com/search?query=jobs&num_pages=1&page=1',
    {
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
      }
    }
  );

  const data = await response.json();

  if (!data.data || data.data.length === 0) {
    console.log('No jobs found.');
    return;
  }

  const jobs = data.data.map(job => ({
    title: job.job_title || 'Untitled',
    company: job.employer_name || 'Unknown Company',
    location: job.job_is_remote
      ? 'Remote'
      : `${job.job_city || ''}${job.job_city && job.job_country ? ', ' : ''}${job.job_country || ''}`.trim() || 'Remote',
    type: job.job_employment_type
      ? job.job_employment_type.charAt(0).toUpperCase() + job.job_employment_type.slice(1).toLowerCase()
      : 'Full-time',
    salary: job.job_min_salary && job.job_max_salary
      ? `$${Number(job.job_min_salary).toLocaleString()} – $${Number(job.job_max_salary).toLocaleString()}`
      : 'Competitive',
    description: job.job_description
      ? job.job_description.slice(0, 300) + '...'
      : 'No description provided.',
    tags: job.job_required_skills
      ? job.job_required_skills.slice(0, 5)
      : [],
    apply_url: job.job_apply_link || '',
    posted_at: new Date().toISOString()
  }));

  console.log(`Found ${jobs.length} jobs. Saving to Supabase...`);

  const { error } = await supabase.from('jobs').insert(jobs);

  if (error) {
    console.error('Error saving jobs:', error.message);
  } else {
    console.log(`Successfully saved ${jobs.length} jobs!`);
  }
}

fetchAndSaveJobs();
