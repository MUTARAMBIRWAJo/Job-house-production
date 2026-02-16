const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testNews() {
  try {
    console.log('Testing news fetch...');
    
    const { data: news, error } = await supabase
      .from('news')
      .select('*')
      .order('published_date', { ascending: false })
      .limit(3);

    if (error) {
      console.error('Error fetching news:', error);
      return;
    }

    console.log('News fetched successfully:', news?.length || 0);
    
    if (news && news.length > 0) {
      console.log('First news article:', {
        id: news[0].id,
        title: news[0].title,
        excerpt: news[0].excerpt,
        category: news[0].category,
        published_date: news[0].published_date
      });
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testNews();
