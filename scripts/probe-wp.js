async function probe() {
  const sites = ['https://ayurrakshaonline.com', 'https://cms.ayurrakshaonline.com'];
  for (const s of sites) {
    console.log(`\n========================================`);
    console.log(`PROBING: ${s}`);
    console.log(`========================================`);
    try {
      const indexRes = await fetch(`${s}/wp-json/`);
      console.log(`/wp-json/ Status: ${indexRes.status} ${indexRes.statusText}`);
      if (indexRes.ok) {
        const indexData = await indexRes.json();
        console.log(`Site Name: ${indexData.name}`);
        console.log(`Site Description: ${indexData.description}`);
        console.log(`Namespaces: ${JSON.stringify(indexData.namespaces || [])}`);
        console.log(`Authentication: ${JSON.stringify(indexData.authentication || {})}`);
      }
    } catch (e) {
      console.log(`Index fetch error: ${e.message}`);
    }

    try {
      const postsRes = await fetch(`${s}/wp-json/wp/v2/posts?per_page=5`);
      console.log(`/wp-json/wp/v2/posts Status: ${postsRes.status} ${postsRes.statusText}`);
      console.log(`x-wp-total: ${postsRes.headers.get('x-wp-total')}`);
      console.log(`x-wp-totalpages: ${postsRes.headers.get('x-wp-totalpages')}`);
      if (postsRes.ok) {
        const posts = await postsRes.json();
        console.log(`Returned posts count: ${posts.length}`);
        for (const p of posts) {
          console.log(` - [${p.id}] "${p.title?.rendered}" (slug: ${p.slug}, date: ${p.date}, status: ${p.status})`);
        }
      } else {
        const body = await postsRes.text();
        console.log(`Posts error body: ${body.slice(0, 300)}`);
      }
    } catch (e) {
      console.log(`Posts fetch error: ${e.message}`);
    }
  }
}
probe();
