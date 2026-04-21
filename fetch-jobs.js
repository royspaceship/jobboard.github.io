const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Different job categories — each run fetches a different one
const QUERIES = [
  'software engineer',
  'product designer',
  'marketing manager',
  'data analyst',
  'devops engineer',
  'frontend developer',
  'backend developer',
  'mobile developer',
  'project manager',
  'UX researcher',
  'content writer',
  'sales manager',
  'HR manager',
  'finance analyst',
  'remote jobs'
];

async function fetchAndSaveJobs() {
  console.log('Starting job fetch...');
  console.log('SUPABASE_URL set:', !!process.env.SUPABASE_URL);
  console.log('SUPABASE_KEY set:', !!process.env.SUPABASE_KEY);
  console.log('RAPIDAPI_KEY set:', !!process.env.RAPIDAPI_KEY);

  // Pick a different query based on current hour
  var query = QUERIES[new Date().getHours() % QUERIES.length];
  console.log('Searching for:', query);

  var totalSaved = 0;

  try {
    // Fetch 5 pages = 50 jobs in one request
    const response = await fetch(
      'https://jsearch.p.rapidapi.com/search?query='
        + encodeURIComponent(query)
        + '&num_pages=5&page=1&date_posted=today',
      {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
        }
      }
    );

    console.log('API status:', response.status);
    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      console.log('No jobs returned. Full response:', JSON.stringify(data).slice(0, 300));
      return;
    }

    console.log('Jobs fetched:', data.data.length);

    const jobs = data.data.map(job => ({
      title: job.job_title || 'Untitled',
      company: job.employer_name || 'Unknown',
      location: job.job_is_remote
        ? 'Remote'
        : [job.job_city, job.job_state, job.job_country]
            .filter(Boolean).join(', ') || 'Remote',
      type: job.job_employment_type
        ? job.job_employment_type.charAt(0).toUpperCase()
          + job.job_employment_type.slice(1).toLowerCase()
        : 'Full-time',
      salary: job.job_min_salary && job.job_max_salary
        ? '$' + Number(job.job_min_salary).toLocaleString()
          + ' - $' + Number(job.job_max_salary).toLocaleString()
        : 'Competitive',
      description: job.job_description
        ? job.job_description.slice(0, 300) + '...'
        : 'No description available.',
      tags: job.job_required_skills
        ? job.job_required_skills.slice(0, 5)
        : [],
      apply_url: job.job_apply_link || '',
      posted_at: new Date().toISOString()
    }));

    // Save to Supabase in batches of 10
    for (var i = 0; i < jobs.length; i += 10) {
      var batch = jobs.slice(i, i + 10);
      const { error } = await supabase.from('jobs').insert(batch);
      if (error) {
        console.error('Batch error:', error.message);
      } else {
        totalSaved += batch.length;
        console.log('Saved batch:', i/10 + 1, '— total so far:', totalSaved);
      }
    }

    console.log('Done! Total jobs saved:', totalSaved);

  } catch (err) {
    console.error('Script crashed:', err.message);
    console.error(err.stack);
  }
}

fetchAndSaveJobs();
