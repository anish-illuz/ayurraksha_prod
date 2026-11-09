async function probeNovamira() {
  const sites = ['https://ayurrakshaonline.com', 'https://cms.ayurrakshaonline.com'];
  for (const s of sites) {
    try {
      const res = await fetch(`${s}/wp-json/novamira/v1`);
      console.log(`${s}/wp-json/novamira/v1 -> Status: ${res.status}`);
      if (res.ok) {
        const data = await res.json();
        console.log(`Routes:`, Object.keys(data.routes || {}));
      }
    } catch (e) {
      console.log(`Error ${s}: ${e.message}`);
    }
  }
}
probeNovamira();
