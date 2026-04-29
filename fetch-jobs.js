const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Queries covering India + worldwide locations
const QUERY_SETS = [
  // India specific
  { query: 'jobs in Bangalore India',        country: 'in' },
  { query: 'jobs in Mumbai India',           country: 'in' },
  { query: 'jobs in Delhi India',            country: 'in' },
  { query: 'jobs in Hyderabad India',        country: 'in' },
  { query: 'jobs in Chennai India',          country: 'in' },
  { query: 'jobs in Pune India',             country: 'in' },
  { query: 'software engineer India',        country: 'in' },
  { query: 'IT jobs India',                  country: 'in' },
  { query: 'fresher jobs India',             country: 'in' },
  { query: 'remote jobs India',              country: 'in' },
  { query: 'work from home India',           country: 'in' },
  { query: 'data analyst India',             country: 'in' },
  { query: 'product manager India',          country: 'in' },
  { query: 'digital marketing India',        country: 'in' },
  { query: 'finance jobs India',             country: 'in' },
  // USA
  { query: 'software engineer New York',     country: 'us' },
  { query: 'remote jobs United States',      country: 'us' },
  { query: 'data scientist San Francisco',   country: 'us' },
  { query: 'product designer USA',           country: 'us' },
  { query: 'devops engineer USA',            country: 'us' },
  // UK
  { query: 'software engineer London',       country: 'gb' },
  { query: 'remote jobs United Kingdom',     country: 'gb' },
  { query: 'data analyst London',            country: 'gb' },
  // UAE & Middle East
  { query: 'jobs in Dubai',                  country: 'ae' },
  { query: 'software engineer Dubai',        country: 'ae' },
  { query: 'IT jobs UAE',                    country: 'ae' },
  // Canada
  { query: 'software engineer Toronto',      country: 'ca' },
  { query: 'remote jobs Canada',             country: 'ca' },
  // Australia
  { query: 'software engineer Sydney',       country: 'au' },
  { query: 'remote jobs Australia',          country: 'au' },
  // Singapore
  { query: 'software engineer Singapore',    country: 'sg' },
  { query: 'IT jobs Singapore',              country: 'sg' },
  // Germany
  { query: 'software engineer Berlin',       country: 'de' },
  { query: 'remote jobs Germany',            country: 'de' },
  // Global Remote
  { query: 'remote software engineer',       country: 'us' },
  { query: 'remote product designer',        country: 'us' },
  { query: 'remote data scientist',          country: 'us' },
  { query: 'remote marketing manager',       country: 'us' },
  { query: 'remote devops engineer',         country: 'us' },
];

async function fetchAndSaveJobs() {
  console.log('Starting job fetch...');
  console.log('Time:', new Date().toISOString());

  // Pick query based on current hour and minute
  // This rotates through different queries each run
  var index = (new Date().getHours() * 3 + Math.floor(new Date().getMinutes() / 20))
    % QUERY_SETS.length;
  var querySet = QUERY_SETS[index];

  console.log('Query:', querySet.query);
  console.log('Country:', querySet.country);

  try {
    var url = 'https://jsearch.p.rapidapi.com/search'
      + '?query=' + encodeURIComponent(querySet.query)
      + '&num_pages=5'
      + '&page=1'
      + '&date_posted=3days'
      + '&country=' + querySet.country;

    console.log('Fetching from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
      }
    });

    console.log('API status:', response.status);
    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      console.log('No jobs returned for this query.');
      console.log('Response:', JSON.stringify(data).slice(0, 200));
      return;
    }

    console.log('Jobs fetched:', data.data.length);

    const jobs = data.data.map(function(job) {
      // Build location string
      var locationParts = [];
      if (job.job_city) locationParts.push(job.job_city);
      if (job.job_state) locationParts.push(job.job_state);
      if (job.job_country) locationParts.push(job.job_country);
      var location = job.job_is_remote
        ? 'Remote'
        : locationParts.join(', ') || 'Worldwide';

      // Build salary string
      var salary = 'Competitive';
      if (job.job_min_salary && job.job_max_salary) {
        // Check if salary is in INR range (India jobs)
        if (job.job_salary_currency === 'INR' || querySet.country === 'in') {
          salary = job.job_min_salary && job.job_max_salary
            ? '₹' + Number(job.job_min_salary).toLocaleString('en-IN')
              + ' - ₹' + Number(job.job_max_salary).toLocaleString('en-IN')
            : 'Competitive';
        } else {
          salary = '$' + Number(job.job_min_salary).toLocaleString()
            + ' - $' + Number(job.job_max_salary).toLocaleString();
        }
      }

      return {
        title: job.job_title || 'Untitled',
        company: job.employer_name || 'Unknown Company',
        location: location,
        type: job.job_employment_type
          ? job.job_employment_type.charAt(0).toUpperCase()
            + job.job_employment_type.slice(1).toLowerCase()
          : 'Full-time',
        salary: salary,
        description: job.job_description
          ? job.job_description.slice(0, 400) + '...'
          : 'No description available.',
        tags: job.job_required_skills
          ? job.job_required_skills.slice(0, 6)
          : [],
        apply_url: job.job_apply_link || '',
        posted_at: new Date().toISOString()
      };
    });

    console.log('Saving', jobs.length, 'jobs to Supabase...');

    // Save in batches of 10
    var totalSaved = 0;
    for (var i = 0; i < jobs.length; i += 10) {
      var batch = jobs.slice(i, i + 10);
      const { error } = await supabase
        .from('jobs')
        .insert(batch);

      if (error) {
        console.error('Batch', Math.floor(i/10)+1, 'error:', error.message);
      } else {
        totalSaved += batch.length;
        console.log('Batch', Math.floor(i/10)+1, 'saved. Total:', totalSaved);
      }
    }

    console.log('DONE! Total jobs saved:', totalSaved);

  } catch (err) {
    console.error('Script error:', err.message);
    console.error(err.stack);
  }
}

fetchAndSaveJobs();
