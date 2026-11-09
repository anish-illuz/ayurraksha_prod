async function analyzeSource() {
  const sourceUrl = 'https://ayurrakshaonline.com';

  // 1. Get all categories
  const catRes = await fetch(`${sourceUrl}/wp-json/wp/v2/categories?per_page=100`);
  const categories = await catRes.json();
  console.log(`Source Categories (${categories.length}):`);
  for (const c of categories) {
    console.log(` - ID ${c.id}: "${c.name}" (slug: ${c.slug}, count: ${c.count})`);
  }

  // 2. Get all tags
  const tagRes = await fetch(`${sourceUrl}/wp-json/wp/v2/tags?per_page=100`);
  const tags = await tagRes.json();
  console.log(`\nSource Tags (${tags.length}):`);
  for (const t of tags) {
    console.log(` - ID ${t.id}: "${t.name}" (slug: ${t.slug}, count: ${t.count})`);
  }

  // 3. Check post total and pagination
  const headRes = await fetch(`${sourceUrl}/wp-json/wp/v2/posts?per_page=1`);
  const totalPosts = parseInt(headRes.headers.get('x-wp-total') || '0', 10);
  const totalPages = parseInt(headRes.headers.get('x-wp-totalpages') || '0', 10);
  console.log(`\nTotal Published Posts: ${totalPosts} across ${totalPages} pages.`);

  // 4. Sample 5 posts across different pages to see structure & featured media
  const sampleRes = await fetch(`${sourceUrl}/wp-json/wp/v2/posts?per_page=5&_embed=true`);
  const samplePosts = await sampleRes.json();
  console.log(`\nSample Posts Analysis:`);
  let hasFeaturedMediaCount = 0;
  for (const p of samplePosts) {
    const fm = p._embedded && p._embedded['wp:featuredmedia'] ? p._embedded['wp:featuredmedia'][0] : null;
    if (fm && fm.source_url) hasFeaturedMediaCount++;
    console.log(`\n--- Post ID ${p.id} ---`);
    console.log(`Title: ${p.title?.rendered}`);
    console.log(`Slug: ${p.slug}`);
    console.log(`Date: ${p.date} (GMT: ${p.date_gmt})`);
    console.log(`Status: ${p.status}`);
    console.log(`Categories: ${p.categories}`);
    console.log(`Tags: ${p.tags}`);
    console.log(`Featured Media: ${fm ? fm.source_url : 'None'}`);
    console.log(`Content length: ${p.content?.rendered?.length || 0} characters`);
  }
}

analyzeSource().catch(console.error);
