async function verify() {
  const res = await fetch('https://cms.ayurrakshaonline.com/wp-json/wp/v2/posts/27778?_embed=true');
  console.log('Status:', res.status);
  const data = await res.json();
  console.log('Title:', data.title?.rendered);
  console.log('Slug:', data.slug);
  console.log('Link:', data.link);
  console.log('Categories:', data._embedded?.['wp:term']?.[0]?.map(c => c.name));
  console.log('Featured Image:', data._embedded?.['wp:featuredmedia']?.[0]?.source_url);
}
verify().catch(console.error);
