const { execSync } = require('child_process');
const fs = require('fs');

async function main() {
  // 1. Delete Hello World post ID 1 if it exists
  fs.writeFileSync('temp-exec-code.json', JSON.stringify({
    code: `
      $p = get_post(1);
      if ($p && $p->post_name === 'hello-world') {
        return wp_delete_post(1, true);
      }
      return 'Post 1 does not exist or is not hello-world';
    `
  }));
  const delRes = execSync('novamira --yes --site cms.ayurrakshaonline.com run novamira/execute-php --input "@temp-exec-code.json" --json', { encoding: 'utf8' });
  console.log('Delete Hello World result:', JSON.parse(delRes).data?.return_value);

  // 2. Fetch imported post via public REST API
  const res = await fetch('https://cms.ayurrakshaonline.com/wp-json/wp/v2/posts/27778?_embed=true');
  const post = await res.json();
  console.log('REST verification of imported post 27778:');
  console.log('Title:', post.title?.rendered);
  console.log('Slug:', post.slug);
  console.log('Link:', post.link);
  console.log('Featured Image URL:', post._embedded?.['wp:featuredmedia']?.[0]?.source_url);
}

main().catch(console.error);
