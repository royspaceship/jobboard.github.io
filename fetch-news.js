const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

async function fetchAndSaveNews() {
  console.log('Fetching hiring news...');

  try {
    const response = await fetch(
      'https://newsapi.org/v2/everything'
      + '?q=hiring+jobs+recruitment+careers'
      + '&language=en'
      + '&sortBy=publishedAt'
      + '&pageSize=20'
      + '&apiKey=' + process.env.NEWS_API_KEY
    );

    console.log('News API status:', response.status);
    const data = await response.json();

    if (!data.articles || data.articles.length === 0) {
      console.log('No articles returned:', JSON.stringify(data).slice(0, 200));
      return;
    }

    console.log('Articles fetched:', data.articles.length);

    const articles = data.articles
      .filter(function(a) {
        return a.title && a.url && a.title !== '[Removed]';
      })
      .map(function(a) {
        return {
          title: a.title.slice(0, 120),
          url: a.url,
          source: a.source.name || 'News',
          published_at: a.publishedAt || new Date().toISOString()
        };
      });

    // Delete old news first
    await supabase
      .from('news')
      .delete()
      .lt('published_at', new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString());

    // Insert new articles
    const { error } = await supabase.from('news').insert(articles);

    if (error) {
      console.error('Error saving news:', error.message);
    } else {
      console.log('Saved', articles.length, 'news articles!');
    }

  } catch (err) {
    console.error('News fetch error:', err.message);
  }
}

fetchAndSaveNews();
