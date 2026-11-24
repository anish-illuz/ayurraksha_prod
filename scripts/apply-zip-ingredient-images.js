/* Update the per-product ingredient photos under public/images/ingredients/products/<slug>/
 * from the per-product zips the client provided in <repo>/Ing/ (extracted to
 * C:/Users/anish/AppData/Local/Temp/ing-inspect by unzip, one nested dir per product).
 *
 * - Normalizes file extensions to the real container format (the client's
 *   .webp files are actually JPEG bytes; a few sources are JXL, which this
 *   sharp build cannot decode - those are skipped and reported; the shared
 *   botanical library still covers those ingredients).
 * - Down-scales/quality-caps large sources so the product folders match the
 *   size profile of the images they already contain.
 * - Prints a ready-to-paste PRODUCT_OVERRIDES snippet (from the `keys` in
 *   each spec, which mirror the live CMS ingredient names for that product).
 *
 * Run:  node scripts/apply-zip-ingredient-images.js            (dry run, logs)
 *       node scripts/apply-zip-ingredient-images.js --write     (apply)
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '..');
const BASE = 'C:/Users/anish/AppData/Local/Temp/ing-inspect';
const PUB = path.join(ROOT, 'public', 'images', 'ingredients', 'products');
const WRITE = process.argv.includes('--write');

/**
 * spec:
 *  slug      -> PRODUCT_OVERRIDES key + public/images/ingredients/products/<slug>
 *  files:     [outerZipDir, exactSourceFile, keys[], optional outName]
 *  remove:    old files in the target folder that this update supersedes
 */
const SPECS = [
  {
    slug: 'ayur-raksha-alg',
    files: [
      ['AyurRaksha ALG', 'Maruthamaram.jpeg', ['marudha maram', 'maruthamaram', 'terminalia arjuna', 'arjuna']],
      ['AyurRaksha ALG', 'Krambu.jpg', ['krambu', 'clove', 'syzygium aromaticum', 'lavangam']],
      ['AyurRaksha ALG', 'Turmeric.jpg', ['manjal', 'turmeric', 'curcuma longa']],
      ['AyurRaksha ALG', 'Papaya leaf.jpg', ['pappali', 'papaya', 'carica papaya']],
      ['AyurRaksha ALG', 'tulasi.jpg', ['tulasi', 'tulsi', 'holy basil', 'ocimum tenuiflorum']],
      ['AyurRaksha ALG', 'Inji.jpg', ['inji', 'ginger', 'zingiber officinale']],
      ['AyurRaksha ALG', 'Murunga ilai.jpg', ['murungai', 'moringa', 'moringa oleifera']],
      ['AyurRaksha ALG', 'Amla.webp', ['nellikkai', 'amla', 'phyllanthus emblica']],
      ['AyurRaksha ALG', 'draksha.jpg', ['draksha', 'grape', 'vitis vinifera']],
      ['AyurRaksha ALG', 'Garlic - Allium sativum.jpg', ['garlic', 'allium sativum']],
    ],
  },
  {
    slug: 'b-derma-capsules',
    files: [
      ['AyurRaksha B Derma Capsules', 'Santalum album.jpg', ['santalum album']],
      ['AyurRaksha B Derma Capsules', 'Trichosanthes dioica.jpg', ['trichosanthes dioica', 'trichosanthes']],
      ['AyurRaksha B Derma Capsules', 'Berberis aristata.jpg', ['berberis aristata', 'berberis']],
      ['AyurRaksha B Derma Capsules', 'Curcuma longa.jpg', ['curcuma longa', 'turmeric']],
      ['AyurRaksha B Derma Capsules', 'Acacia catechu.jpg', ['acacia catechu', 'catechu', 'khair']],
      ['AyurRaksha B Derma Capsules', 'Azadirachta indica.jpg', ['azadirachta indica', 'neem', 'azadirachta']],
    ],
  },
  {
    slug: 'ayur-raksha-creat-capsules',
    files: [
      ['AyurRaksha CREAT Capsules', 'Aloe vera.jpg', ['aloe vera', 'aloe']],
      ['AyurRaksha CREAT Capsules', 'Phyllanthus amarus.jpg', ['keelanelli', 'phyllanthus amarus']],
      ['AyurRaksha CREAT Capsules', 'Picrorhiza kurroa.jpg', ['katuki', 'picrorhiza kurroa', 'picrorhiza']],
      ['AyurRaksha CREAT Capsules', 'Piper nigrum.jpg', ['milagu', 'black pepper', 'piper nigrum']],
      ['AyurRaksha CREAT Capsules', 'Sambucus nigra.jpeg', ['elderberry', 'sambucus nigra', 'sambucus']],
      ['AyurRaksha CREAT Capsules', 'Trigonella foenum-graecum.jpg', ['vendhayam', 'fenugreek', 'trigonella foenum']],
      ['AyurRaksha CREAT Capsules', 'Zingiber officinale.jpg', ['ginger', 'zingiber officinale', 'inji']],
    ],
  },
  {
    slug: 'ayur-raksha-dant-swasthya',
    files: [
      ['AyurRaksha Dant Swasthya', 'Akkarakaram.jpg', ['aghrakaram', 'akkarakaram', 'akarkara']],
      ['AyurRaksha Dant Swasthya', 'Dry Ginger.jpg', ['chukku', 'dry ginger']],
      ['AyurRaksha Dant Swasthya', 'Rock Salt.jpg', ['induppu', 'rock salt']],
      ['AyurRaksha Dant Swasthya', 'Mint salt.jpg', ['puthina', 'mint salt']],
      ['AyurRaksha Dant Swasthya', 'Oma Uppu.jpg', ['oma upp', 'ajwain', 'trachyspermum ammi']],
      ['AyurRaksha Dant Swasthya', 'Thippili.jpg', ['thippili', 'long pepper', 'piper longum']],
      ['AyurRaksha Dant Swasthya', 'Krambu.jpg', ['lavangam', 'clove', 'syzygium aromaticum']],
      ['AyurRaksha Dant Swasthya', 'Khair  — Acacia catechu extract.jpg', ['karuvelam', 'catechu', 'acacia catechu', 'khair']],
      ['AyurRaksha Dant Swasthya', 'Blackpepper.jpg', ['milagu', 'black pepper', 'piper nigrum']],
    ],
  },
  {
    slug: 'ayurraksha-hair-care-oil',
    files: [
      ['AyurRaksha Hair Care Oil', 'Organic-Coconut-Oil-.jpg', ['coconut oil', 'coconut', 'cocos nucifera']],
      ['AyurRaksha Hair Care Oil', 'Amla.webp', ['amla', 'phyllanthus emblica', 'nellikkai']],
      ['AyurRaksha Hair Care Oil', 'Aloe Vera.jpg', ['aloe vera', 'aloe']],
      ['AyurRaksha Hair Care Oil', 'Hibiscus - Hibiscus rosa-sinensis.jpg', ['hibiscus', 'hibiscus rosa sinensis']],
      ['AyurRaksha Hair Care Oil', 'Bhringraj - Eclipta prostrata.png', ['bhringraj', 'eclipta prostrata', 'eclipta']],
      ['AyurRaksha Hair Care Oil', 'Phyllanthus niruri.jpg', ['phyllanthus niruri', 'keelanelli']],
      ['AyurRaksha Hair Care Oil', 'Phyla nodiflora.jpg', ['phyla nodiflora', 'phyla']],
      ['AyurRaksha Hair Care Oil', 'Indigo - Indigofera tinctoria.png', ['indigo', 'indigofera tinctoria', 'indigofera', 'avuri']],
      ['AyurRaksha Hair Care Oil', 'Henna - Lawsonia inermis.jpg', ['henna', 'lawsonia inermis', 'lawsonia']],
      ['AyurRaksha Hair Care Oil', 'milk.jpeg', ['milk']],
    ],
  },
  {
    slug: 'ayur-raksha-herbal-shampoo',
    files: [
      ['AyurRaksha Herbal Shampoo', 'Aloe Vera.jpg', ['aloe vera', 'aloe']],
      ['AyurRaksha Herbal Shampoo', 'Amla.webp', ['amla', 'phyllanthus emblica']],
      ['AyurRaksha Herbal Shampoo', 'Bhringraj-Extract-Powder.jpg', ['bhringraj', 'eclipta']],
      ['AyurRaksha Herbal Shampoo', 'COLD-PRESSED-CASTOR-OIL.jpg', ['castor oil', 'castor']],
      ['AyurRaksha Herbal Shampoo', 'Argan Oil.jpg', ['argan oil', 'argan']],
    ],
  },
  {
    slug: 'ayur-raksha-imu-360',
    files: [
      ['AyurRaksha IMU 360', 'Maruthamaram.jpeg', ['marudha maram', 'maruthamaram', 'terminalia arjuna', 'arjuna']],
      ['AyurRaksha IMU 360', 'Krambu.jpg', ['krambu', 'clove', 'syzygium aromaticum', 'lavangam']],
      ['AyurRaksha IMU 360', 'Turmeric.jpg', ['manjal', 'turmeric', 'curcuma longa']],
      ['AyurRaksha IMU 360', 'Papaya leaf.jpg', ['pappali', 'papaya', 'carica papaya']],
      ['AyurRaksha IMU 360', 'tulasi.jpg', ['tulasi', 'tulsi', 'holy basil', 'ocimum tenuiflorum']],
      ['AyurRaksha IMU 360', 'Inji.jpg', ['inji', 'ginger', 'zingiber officinale']],
      ['AyurRaksha IMU 360', 'Murunga ilai.jpg', ['murungai', 'moringa', 'moringa oleifera']],
      ['AyurRaksha IMU 360', 'Garlic Extract.jpg', ['garlic', 'allium sativum']],
    ],
  },
  {
    slug: 'sp-soryn-cream',
    files: [
      ['AyurRaksha SP Soryn Cream (2)', 'Cynodon dactylon.jpg', ['cynodon dactylon', 'cynodon']],
      ['AyurRaksha SP Soryn Cream (2)', 'Indigofera tinctoria.jpg', ['indigofera tinctoria', 'indigofera', 'avuri', 'indigo']],
      ['AyurRaksha SP Soryn Cream (2)', 'Nigella sativa.jpg', ['nigella sativa', 'nigella', 'kalonji', 'black seed']],
      ['AyurRaksha SP Soryn Cream (2)', 'Pongamia glabra.jpg', ['pongamia glabra', 'pongamia']],
      ['AyurRaksha SP Soryn Cream (2)', 'Psoralea corylifolia.gif', ['psoralea corylifolia', 'psoralea', 'bakuchi']],
      ['AyurRaksha SP Soryn Cream (2)', 'Vernonia anthelmintica.png', ['vernonia anthelmintica', 'vernonia']],
    ],
  },
  {
    slug: 'ayurraksha-immuno3-immunity-booster-capsules',
    files: [
      ['AyurRaksha-ImmunO3-Immunity-Booster-Capsules', 'Nigella sativa seed oil — black seed or kalonji oil.jpg', ['nigella sativa', 'nigella', 'black seed', 'kalonji']],
      ['AyurRaksha-ImmunO3-Immunity-Booster-Capsules', 'Olive oil.jpg', ['olive oil', 'olive']],
      ['AyurRaksha-ImmunO3-Immunity-Booster-Capsules', 'Plant extracts.jpg', ['plant extracts', 'plant extract']],
      ['AyurRaksha-ImmunO3-Immunity-Booster-Capsules', 'Vitamin E.jpg', ['vitamin e']],
    ],
  },
  {
    slug: 'ayurraksha-vital-o3-anti-vitiligo-cream',
    files: [
      ['Vital O3 Anti-Vitiligo Cream', 'Curcumin.jpg', ['curcumin']],
      ['Vital O3 Anti-Vitiligo Cream', 'Medicinal plant extracts.jpg', ['medicinal plant extracts', 'medicinal plant extract']],
      ['Vital O3 Anti-Vitiligo Cream', 'Oleic acid.jpg', ['oleic acid', 'oleic']],
      // Ozonated oil.jxl is JXL (undecodable here); the existing
      // saponified-vegetable-oils.jpg override still serves the 'ozonated' key.
      ['Vital O3 Anti-Vitiligo Cream', 'Ozonated oil.jxl', ['ozonated oil', 'ozonated']],
    ],
  },
  {
    slug: 'ayur-raksha-superheal-o3-cream',
    files: [
      ['Ayurrakksha Superheal o3 cream', 'Olive oil.jpg', ['olive oil', 'olive', 'extra virgin olive']],
      ['Ayurrakksha Superheal o3 cream', 'Ozone (O3).jpg', ['ozone', 'o3']],
    ],
  },
  {
    slug: 'ayur-raksha-foot-bath-powder',
    files: [
      ['Ayurraksha Foot bath powder 300g', 'Bhimseni.jpg', ['bhimseni', 'bhimseni karpooram']],
      ['Ayurraksha Foot bath powder 300g', 'Dry Ginger.jpg', ['dry ginger', 'chukku', 'zingiber officinale']],
      ['Ayurraksha Foot bath powder 300g', 'Epsom Salt.jpg', ['epsom salt', 'epsom']],
      ['Ayurraksha Foot bath powder 300g', 'Menthol.jpg', ['menthol']],
      ['Ayurraksha Foot bath powder 300g', 'Peppermint Oil..jpg', ['peppermint oil', 'peppermint']],
      ['Ayurraksha Foot bath powder 300g', 'Rock Salt.jpg', ['rock salt', 'induppu']],
      ['Ayurraksha Foot bath powder 300g', 'Thymol.jpg', ['thymol']],
      ['Ayurraksha Foot bath powder 300g', 'karpooram.jpg', ['karpooram', 'camphor']],
    ],
  },
  {
    slug: 'ayur-raksha-gargling-oil',
    files: [
      ['Ayurraksha Gargling oil', 'Sesame Oil.jpg', ['sesame oil', 'sesame', 'cold pressed sesame', 'sesamum indicum']],
      ['Ayurraksha Gargling oil', 'Organic-Coconut-Oil-.jpg', ['coconut oil', 'coconut', 'cocos nucifera']],
      ['Ayurraksha Gargling oil', 'clove oil.jpg', ['clove oil', 'clove']],
    ],
  },
  {
    slug: 'ayur-raksha-premium-high-fiber-health-mix',
    files: [
      ['Ayurraksha premium high fibre health mix (2)', 'Ragi.jpg', ['ragi', 'finger millet']],
      ['Ayurraksha premium high fibre health mix (2)', 'jowar.jpg', ['jowar', 'sorghum']],
      ['Ayurraksha premium high fibre health mix (2)', 'wheat.jpg', ['wheat', 'triticum']],
      ['Ayurraksha premium high fibre health mix (2)', 'barley.jpg', ['barley', 'hordeum vulgare']],
      ['Ayurraksha premium high fibre health mix (2)', 'rice.jpg', ['rice', 'oryza sativa']],
      ['Ayurraksha premium high fibre health mix (2)', 'fried gram.jpg', ['fried gram', 'roasted chana', 'roasted gram']],
      ['Ayurraksha premium high fibre health mix (2)', 'moong dal.jpg', ['moong dal', 'green gram', 'mung']],
      ['Ayurraksha premium high fibre health mix (2)', 'desi chickpea.jpg', ['desi chickpea', 'chickpea', 'chana']],
      ['Ayurraksha premium high fibre health mix (2)', 'soya.jpg', ['soya', 'soybean', 'glycine max']],
      ['Ayurraksha premium high fibre health mix (2)', 'peanut.jpg', ['peanut', 'groundnut', 'groundnuts']],
      ['Ayurraksha premium high fibre health mix (2)', 'badam.jpg', ['badam', 'almond', 'prunus dulcis']],
      ['Ayurraksha premium high fibre health mix (2)', 'cashew nut.jpeg', ['cashew nut', 'cashew']],
      ['Ayurraksha premium high fibre health mix (2)', 'cardamom..jpg', ['cardamom', 'elettaria cardamomum']],
    ],
  },
  {
    slug: 'boozliv',
    files: [
      ['Boozliv (2)', 'Wedelia calendulacea (Kesaraja.png', ['karicalai', 'wedelia calendulacea', 'wedelia', 'kesaraja']],
      ['Boozliv (2)', 'Phyllanthus niruri (Bhumyamalaki).jpg', ['keezhanelli', 'phyllanthus niruri', 'keelanelli', 'bhumyamalaki']],
      ['Boozliv (2)', 'Piper nigrum (Marica).jpg', ['milagu', 'black pepper', 'piper nigrum', 'marica']],
      ['Boozliv (2)', 'Aegle marmelos (Bilva).jpg', ['shombu', 'vilvaver', 'bael', 'aegle marmelos', 'bilva']],
      ['Boozliv (2)', 'Andrographis paniculata (Kalmegh).jpg', ['nilavembu', 'andrographis paniculata', 'andrographis', 'kalmegh']],
    ],
  },
  {
    slug: 'divine-healing-oil',
    files: [
      ['DIVINE HEALING OIL', 'Turmeric.jpg', ['turmeric', 'haridra', 'curcuma longa']],
      ['DIVINE HEALING OIL', 'neem.jpg', ['neem', 'nimba', 'azadirachta indica']],
      ['DIVINE HEALING OIL', 'Terminalia chebula.jpg', ['haritaki', 'kadukkai', 'terminalia chebula']],
      ['DIVINE HEALING OIL', 'Bibhitaki.jpg', ['bibhitaki', 'thanrikkai', 'terminalia bellirica']],
      ['DIVINE HEALING OIL', 'Red Sandalwood.jpg', ['red sandalwood', 'rakta chandanam', 'pterocarpus santalinus']],
      ['DIVINE HEALING OIL', 'Amla.webp', ['amla', 'amalakki', 'nellikkai', 'phyllanthus emblica']],
      ['DIVINE HEALING OIL', 'Adathodai.jpg', ['adathodai', 'vaasa', 'adhatoda vasica', 'adhatoda']],
      ['DIVINE HEALING OIL', 'Sesame Oil.jpg', ['sesame oil', 'sesame', 'tila tailam', 'sesamum indicum']],
      ['DIVINE HEALING OIL', 'Kirata Tikta - Swertia chirata.jpg', ['kirata', 'swertia chirata', 'swertia', 'chirata']],
    ],
  },
  {
    slug: 'esnovate-immunity-boosting-capsules',
    files: [
      ['ESNOVATE Capsules', 'Adathodai.jpg', ['adathodai', 'malabar nut', 'adhatoda', 'justicia']],
      ['ESNOVATE Capsules', 'Thooduvalai.jpeg', ['thooduvalai', 'solanum trilobatum', 'thoduvai']],
      ['ESNOVATE Capsules', 'Thippili.jpg', ['thippili', 'long pepper', 'piper longum']],
      ['ESNOVATE Capsules', 'Najaruppan.jpg', ['nanjaruppan', 'najaruppan', 'tylophora indica', 'tylophora']],
      ['ESNOVATE Capsules', 'tulasi.jpg', ['tulasi', 'tulsi', 'holy basil', 'ocimum']],
    ],
  },
  {
    slug: 'etionment-pain-relief-cream',
    files: [
      ['Etioment Pain Relief Creambalm', 'Nochi.jpg', ['nochi', 'vitex negundo', 'vitex', 'chasteberry']],
      ['Etioment Pain Relief Creambalm', 'Ashwagandha.jpg', ['ashwagandha', 'amukkira', 'withania somnifera', 'withania']],
      ['Etioment Pain Relief Creambalm', 'Kungilium.jpg', ['kungilium', 'kungilam', 'shorea robusta']],
      ['Etioment Pain Relief Creambalm', 'Pachai Karpuram.jpg', ['pachai karpuram', 'camphor', 'karpuram']],
      ['Etioment Pain Relief Creambalm', 'Thenmelugu.jpg', ['thennmelugu', 'thenmelugu', 'pinus roxburghii']],
      ['Etioment Pain Relief Creambalm', 'Oma Uppu.jpg', ['oma upp', 'ajwain', 'trachyspermum']],
      ['Etioment Pain Relief Creambalm', 'Eucalyptus-Globulus.jpg', ['eucalyptus globulus', 'eucalyptus']],
      ['Etioment Pain Relief Creambalm', 'Terminalia chebula.jpg', ['terminalia chebula', 'chebula', 'kadukkai']],
      ['Etioment Pain Relief Creambalm', 'Thymus_vulgaris.jpg', ['thymus vulgaris', 'thymus', 'thymol']],
      ['Etioment Pain Relief Creambalm', 'Sesamum indicum.jpg', ['sesamum indicum', 'sesame', 'gingelly']],
      ['Etioment Pain Relief Creambalm', 'Sida cordifolia.jpg', ['sida cordifolia', 'sida', 'bala']],
      ['Etioment Pain Relief Creambalm', 'Cinnamomum camphora.jpg', ['cinnamomum camphora', 'cinnamomum']],
    ],
  },
  {
    slug: 'migro-prime-tablets',
    remove: ['thippili.jpg', 'kutki.jpg', 'cucumber.jpg', 'shankhpushpi.png', 'saffron.jpg'],
    files: [
      ['Migro Prime Tablets (2)', 'Piper longum.jpg', ['piper longum', 'long pepper', 'pippali', 'thippili']],
      ['Migro Prime Tablets (2)', 'Picrorhiza kurroa.jpg', ['picrorhiza kurroa', 'picrorhiza', 'kutki', 'katuki']],
      ['Migro Prime Tablets (2)', 'Cucumis sativus.jpg', ['cucumis sativus', 'cucumis', 'cucumber']],
      ['Migro Prime Tablets (2)', 'Clitoria ternatea.png', ['clitoria ternatea', 'clitoria', 'butterfly pea', 'shankhpushpi']],
      ['Migro Prime Tablets (2)', 'Crocus sativus.jpg', ['crocus sativus', 'crocus', 'kesar', 'saffron']],
      ['Migro Prime Tablets (2)', 'Tinospora cordifolia.jpg', ['tinospora cordifolia', 'tinospora', 'guduchi', 'seenthil kodi']],
      ['Migro Prime Tablets (2)', 'Momordica charantia.jpg', ['momordica charantia', 'momordica', 'karela', 'bitter melon']],
      ['Migro Prime Tablets (2)', 'Terminalia chebula.jpg', ['terminalia chebula', 'haritaki', 'kadukkai']],
      ['Migro Prime Tablets (2)', 'Amla.webp', ['emblica officinalis', 'emblica', 'amla']],
      ['Migro Prime Tablets (2)', 'Chrysanthemum indicum.jpg', ['chrysanthemum indicum', 'chrysanthemum']],
      ['Migro Prime Tablets (2)', 'Teramnus labialis.jpg', ['teramnus labialis', 'teramnus']],
      ['Migro Prime Tablets (2)', 'Sphaeranthus indicus.jpg', ['sphaeranthus indicus', 'sphaeranthus']],
      ['Migro Prime Tablets (2)', 'Albizia lebbeck.jpg', ['albizia lebbeck', 'albizia']],
      ['Migro Prime Tablets (2)', 'Eclipta alba.jpg', ['eclipta alba', 'eclipta']],
    ],
  },
  {
    slug: 'purna-sakthi-tonic',
    files: [
      ['PURNA SAKTHI', 'Shatavari — Asparagus racemosus.jpg', ['shatavari', 'asparagus racemosus', 'asparagus']],
      ['PURNA SAKTHI', 'Curry Leaves.jpg', ['curry leaves', 'murraya koenigii', 'murraya', 'karuveppilai']],
      ['PURNA SAKTHI', 'Pumpkin.jpg', ['pumpkin', 'cucurbita maxima', 'paraval']],
      ['PURNA SAKTHI', 'Gurmar.jpg', ['gurmar', 'gymnema sylvestre', 'gymnema']],
      ['PURNA SAKTHI', 'Glycyrrhiza glabra.jpg', ['glycyrrhiza glabra', 'glycyrrhiza', 'licorice', 'thadi']],
      ['PURNA SAKTHI', 'Triticum sativum.jpg', ['triticum sativum', 'triticum']],
      ['PURNA SAKTHI', 'Symplocos racemosa.png', ['symplocos racemosa', 'symplocos']],
      ['PURNA SAKTHI', 'Aloe Barbadensis.jpg', ['aloe barbadensis', 'aloe vera', 'aloe']],
      ['PURNA SAKTHI', 'Terminalia arjuna.jpg', ['terminalia arjuna', 'arjuna', 'marudha maram']],
      ['PURNA SAKTHI', 'Garcinia cambogia.jpg', ['garcinia cambogia', 'garcinia', 'kudampuli']],
      ['PURNA SAKTHI', 'Vitis vinifera.jpg', ['vitis vinifera', 'grape', 'draksha']],
      ['PURNA SAKTHI', 'Amla.webp', ['amla', 'emblica', 'indian gooseberry', 'phyllanthus emblica']],
      ['PURNA SAKTHI', 'Ashoka Leaf.jpg', ['ashoka leaf', 'ashoka', 'saraca indica', 'saraca']],
    ],
  },
  {
    slug: 'save-heart',
    files: [
      ['SAVE HEART', 'Garlic Extract.jpg', ['garlic extract', 'garlic', 'allium sativum']],
      ['SAVE HEART', 'Inji.jpg', ['ginger extract', 'ginger', 'zingiber officinale', 'inji']],
      ['SAVE HEART', 'Citrus limon extract.jpg', ['lemon juice', 'lemon', 'citrus limon', 'citrus']],
      ['SAVE HEART', 'Honey.jpg', ['honey']],
      ['SAVE HEART', 'Cardamom Elettaria cardamomum.jpg', ['cardamom', 'elettaria cardamomum', 'elettaria']],
      ['SAVE HEART', 'Cumin   Cuminum cyminum.jpg', ['cumin', 'cuminum cyminum', 'cuminum']],
    ],
  },
  {
    slug: 'ayur-raksha-skinwell-soap-pack-of-2',
    files: [
      ['SkinWell Soap (Pack of 2)', 'Sodium Palm Kernelate.jpg', ['sodium palm kernelate']],
      ['SkinWell Soap (Pack of 2)', 'Aloe Barbadensis.jpg', ['aloe barbadensis', 'aloe vera', 'aloe']],
      ['SkinWell Soap (Pack of 2)', 'Sapindus Mukorossi Root Extract.jpg', ['sapindus mukorossi', 'soapnut', 'reetha']],
      ['SkinWell Soap (Pack of 2)', 'Azadirachta Indica Leaf Extract.png', ['azadirachta indica', 'neem', 'vembu']],
      ['SkinWell Soap (Pack of 2)', 'Ocimum Sanctum Leaf Extract.jpg', ['ocimum sanctum', 'ocimum', 'tulsi', 'holy basil']],
      ['SkinWell Soap (Pack of 2)', 'Argania Spinosa Kernel Oil.jpg', ['argania spinosa', 'argan oil', 'argan']],
      ['SkinWell Soap (Pack of 2)', 'Triticum Vulgare Seed Oil.jpg', ['triticum vulgare', 'wheat seed oil']],
    ],
  },
  {
    slug: 'sleep-well-food-supplement-capsules',
    files: [
      ['Sleep well capsule', 'Brahmi.jpg', ['brahmi', 'bacopa monnieri', 'water hyssop', 'bacopa']],
      ['Sleep well capsule', 'Pumpkin.jpg', ['pumpkin', 'cucurbita maxima', 'cucurbita']],
      ['Sleep well capsule', 'Shankhpushpi.png', ['shankhpushpi', 'convolvulus pluricaulis', 'convolvulus']],
      ['Sleep well capsule', 'Valeriana Jatamansi.jpg', ['valeriana jatamansi', 'valeriana']],
      ['Sleep well capsule', 'Nardostachys Jatamansi.jpeg', ['nardostachys jatamansi', 'nardostachys']],
      ['Sleep well capsule', 'Crocus Sativus.jpg', ['crocus sativus', 'crocus', 'kesar', 'saffron']],
    ],
  },
];

function findSrc(outer, file) {
  // The extracted zip nests the product folder inside itself:
  //   <outer>/<inner>/<file>   where <inner> is <outer> with a trailing
  //   " (2)" stripped. Try both the identical nested dir and the stripped one.
  const inner = outer.replace(/\s*\(\d+\)\s*$/, '');
  for (const dir of [outer, inner]) {
    const p = path.join(BASE, dir, dir === inner && outer !== inner ? inner : outer, file);
    if (fs.existsSync(p)) return p;
  }
  const p1 = path.join(BASE, outer, inner, file);
  if (fs.existsSync(p1)) return p1;
  return null;
}

function cleanBase(file) {
  const noExt = path.basename(file, path.extname(file) || '');
  return noExt.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase();
}

function magicFmt(buf) {
  const h = buf.toString('hex');
  if (h.startsWith('ffd8')) return 'jpeg';
  if (h.startsWith('89504e47')) return 'png';
  if (h.startsWith('47494638')) return 'gif';
  if (h.startsWith('52494646') && h.slice(8, 16) === '57454250') return 'webp';
  if (h.startsWith('0000000c')) return 'jxl';
  return 'unknown';
}

(async () => {
  for (const spec of SPECS) {
    const outDir = path.join(PUB, spec.slug);
    const entries = [];
    for (const [outer, file, keys] of spec.files) {
      const src = findSrc(outer, file);
      if (!src) {
        console.log(`MISSING  ${spec.slug}  source not found: ${outer}/${file}`);
        continue;
      }
      const buf = fs.readFileSync(src);
      const fmt = magicFmt(buf);
      if (fmt === 'jxl') {
        console.log(`SKIP(JXL, undecodable by this sharp)  ${spec.slug}/${file}`);
        continue;
      }
      if (fmt === 'unknown') {
        console.log(`SKIP(unknown bytes)  ${spec.slug}/${file}`);
        continue;
      }
      const base = cleanBase(file);
      let outName;
      if (fmt === 'jpeg') outName = base + '.jpg';
      else if (fmt === 'webp') outName = base + '.webp';
      else if (fmt === 'gif') outName = base + '.gif';
      else outName = base + '.png'; // png

      const outPath0 = path.join(outDir, outName);
      let outPath = outPath0;
      const size = buf.length;
      let action = 'copy';
      if (fmt === 'png' && (size > 800_000)) {
        // Large flat-source PNGs: re-encode as JPEG to keep folder sizes sane.
        outName = base + '.jpg';
        outPath = path.join(outDir, outName);
        action = 'png->jpg';
      } else if (fmt === 'jpeg' && size > 900_000) {
        action = 'jpeg-resize';
      } else if (fmt === 'webp' && size > 400_000) {
        action = 'webp-resize';
      }

      if (!WRITE) {
        entries.push({ outName, keys, action, size });
        console.log(`DRY      ${spec.slug}/${outName}  <- ${outer}/${file}  [${fmt}, ${Math.round(size / 1024)}KB, ${action}]`);
        continue;
      }

      fs.mkdirSync(outDir, { recursive: true });
      if (action === 'copy') {
        fs.copyFileSync(src, outPath);
      } else if (action === 'png->jpg') {
        await sharp(src, { background: { r: 255, g: 255, b: 255 } })
          .flatten()
          .resize({ width: 1400, height: 1400, fit: 'inside', withoutEnlargement: true })
          .jpeg({ quality: 82 })
          .toFile(outPath);
      } else {
        await sharp(src)
          .rotate()
          .resize({ width: 1400, height: 1400, fit: 'inside', withoutEnlargement: true })
          .jpeg({ quality: 82 })
          .toFile(outPath);
      }
      entries.push({ outName, keys, action });
      console.log(`WROTE    ${spec.slug}/${outName}  <- ${outer}/${file}  [${fmt}, ${action}]`);
    }

    if (WRITE && spec.remove) {
      for (const old of spec.remove) {
        const p = path.join(outDir, old);
        if (fs.existsSync(p)) {
          fs.unlinkSync(p);
          console.log(`REMOVED  ${spec.slug}/${old} (superseded)`);
        }
      }
    }

    // Ready-to-paste override entries (only for actually written files).
    const lines = entries
      .filter((e) => e.outName)
      .map((e) => `    { src: '/images/ingredients/products/${spec.slug}/${e.outName}', keys: ${JSON.stringify(e.keys)} }`);
    if (lines.length) {
      console.log(`\n// ${spec.slug}`);
      console.log(`  '${spec.slug}': [${lines.join(',\n')},]`);
    }
  }

  console.log(`\n[${WRITE ? 'WROTE' : 'DRY'}] ${SPECS.length} products processed`);
  console.log('JXL sources skipped (shared library still covers those ingredients):');
  console.log('  - premium-mix: bajra -> library pearl-millet-bajra.jpg');
  console.log('  - migro: Terminalia bellirica -> library thanrikkai-bibhitaki.webp');
  console.log('  - save-heart: Apple Cider Vinegar -> library apple-cider-vinegar.jpg');
  console.log('  - vital-o3: Ozonated oil -> existing products/ayurraksha-vital-o3-anti-vitiligo-cream/saponified-vegetable-oils.jpg');
})();
