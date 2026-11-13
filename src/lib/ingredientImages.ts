/**
 * Curated ingredient image library.
 *
 * These static assets live in public/images/ingredients/ and were previously
 * wired up through the bundled per-product `ingredientCards`. When the CMS is
 * the single source of truth, the ingredient NAMES come from the WordPress ACF
 * `ingredients` field, but the CMS stores no per-ingredient photos. So we
 * match the backend ingredient name (common names, regional aliases and Latin
 * binomials) against this name-keyed library to pick the correct image.
 *
 * This is a generic, cross-product name -> image mapping, not product-specific
 * content: any ingredient string the backend returns can be resolved here.
 * New ingredient names added later fall back to a generic botanical image.
 */

export const INGREDIENT_FALLBACK_IMAGE =
  '/images/ingredients/traditional-raw-ayurvedic-herbs-mortar.webp';

interface IngredientImageEntry {
  src: string;
  /** Lower-cased tokens: common names, regional aliases and Latin genus/species. */
  keys: string[];
}

// One entry per asset in public/images/ingredients/. Keys are deliberately
// redundant (common + alias + latin) so a backend name in any of its forms
// resolves to the right photo. Multi-word keys phrase-match; single-word keys
// match on word boundaries.
const LIBRARY: IngredientImageEntry[] = [
  { src: '/images/ingredients/turmeric-rhizome.jpg', keys: ['turmeric', 'manjal', 'haridra', 'haridr', 'curcuma longa', 'curcuma', 'golden turmeric'] },
  { src: '/images/ingredients/neem-leaves.jpg', keys: ['neem', 'nimba', 'nimbam', 'nimbha', 'nemba', 'azadirachta indica', 'azadirachta'] },
  { src: '/images/ingredients/senna-leaves.jpg', keys: ['senna', 'cassia angustifolia', 'laxa health', 'laxahealth', 'laxa', 'senna leaves'] },
  { src: '/images/ingredients/cinnamon-bark.jpg', keys: ['cinnamon', 'cinnamomum zeylanicum', 'cinnamomum', 'zeylanicum', 'cinnamon bark', 'elaku', 'dallakka'] },
  { src: '/images/ingredients/sesame-seeds.jpg', keys: ['sesame', 'gingelly', 'sesamum indicum', 'sesamum', 'tila tailam', 'tila', 'sesame seed', 'gingelly oil', 'sesame oil'] },
  { src: '/images/ingredients/raw-garlic-bulb.jpg', keys: ['garlic', 'allium sativum', 'lasun'] },
  { src: '/images/ingredients/fresh-lemon-citrus.jpg', keys: ['lemon', 'citrullus', 'citrus', 'nimbu', 'kankan'] },
  { src: '/images/ingredients/virgin-coconut-oil.jpg', keys: ['coconut', 'cocos nucifera', 'kadayi', 'coconut oil'] },
  { src: '/images/ingredients/bitter-melon-karela.jpg', keys: ['karela', 'bitter melon', 'momordica', 'kareerai'] },
  { src: '/images/ingredients/brahmi-bacopa.jpg', keys: ['brahmi', 'bacopa', 'water hyssop', 'bachi'] },
  { src: '/images/ingredients/kalonji-black-seed.jpg', keys: ['kalonji', 'nigella', 'nigella sativa', 'black seed', 'kalonji'] },
  { src: '/images/ingredients/olive-oil-olives.jpg', keys: ['olive', 'olea europaea', 'olive oil', 'zaitun'] },
  { src: '/images/ingredients/eucalyptus-leaves.jpg', keys: ['eucalyptus'] },
  { src: '/images/ingredients/ragi-finger-millet.jpg', keys: ['ragi', 'finger millet', 'millet', 'elai'] },
  { src: '/images/ingredients/red-sandalwood.jpg', keys: ['red sandalwood', 'chandanam', 'chandan', 'sandalwood', 'pterocarpus santalinus', 'pterocarpus', 'santalinus', 'rakta chandanam'] },
  { src: '/images/ingredients/papaya-leaves.jpg', keys: ['papaya', 'carica papaya', 'pappali ilai', 'pappali'] },
  { src: '/images/ingredients/grape-seed.jpg', keys: ['grape', 'vitis vinifera', 'draksha', 'draksha', 'grape seed'] },
  { src: '/images/ingredients/almonds-badam.jpg', keys: ['almond', 'badam', 'prunus dulcis', 'almond', 'mandi badam'] },
  { src: '/images/ingredients/clitoria-ternatea-butterfly-pea.jpg', keys: ['butterfly pea', 'clitoria ternatea', 'clitoria', 'neeli kumbizha', 'butterfly pea'] },
  { src: '/images/ingredients/sida-cordifolia-bala.jpg', keys: ['bala', 'sida cordifolia', 'sida', 'bala herb', 'bala root'] },
  { src: '/images/ingredients/phyllanthus-niruri-keelanelli.jpg', keys: ['keelanelli', 'keelavembu', 'keezhanelli', 'phyllanthus niruri', 'bhumyamalaki', 'bhumiamalaki', 'bhumiyamalaki', 'phyllanthus'] },
  { src: '/images/ingredients/garcinia-mangostana-mangosteen.jpg', keys: ['mangosteen', 'garcinia mangostana', 'garcinia'] },
  { src: '/images/ingredients/cissus-quadrangularis-perandai.jpg', keys: ['perandai', 'cissus quadrangularis', 'cissus', 'perandai'] },
  { src: '/images/ingredients/sapindus-mukorossi-soapnut.jpg', keys: ['soapnut', 'mukorossi', 'sapindus', 'reetha', 'reethaka'] },
  { src: '/images/ingredients/sesbania-grandiflora-agathi.jpg', keys: ['agathi', 'sesbania', 'sesbania grandiflora', 'vegetable hummingbird'] },
  { src: '/images/ingredients/cassia-fistula-kondrai.jpg', keys: ['kondrai', 'cassia fistula', 'cassia', 'indian laburnum', 'kondrai'] },
  { src: '/images/ingredients/smilax-chinensis-chobchini.jpg', keys: ['smilax', 'chobchini', 'smilax chinensis'] },
  { src: '/images/ingredients/hemidesmus-indicus-nannari.jpg', keys: ['nannari', 'hemidesmus', 'nannari', 'nannari root'] },
  { src: '/images/ingredients/delonix-elata-vaadanarayanan.jpg', keys: ['vaadanarayanan', 'delonix', 'delonix elata'] },
  { src: '/images/ingredients/gymnema-sylvestre-gurmar.jpg', keys: ['gurmar', 'gymnema', 'gymnema sylvestre', 'gurmar'] },
  { src: '/images/ingredients/coleus-vettiveroides-kuruver.jpg', keys: ['kuruver', 'coleus', 'vettiveroides', 'kuruvel'] },
  { src: '/images/ingredients/phoenix-dactylifera-date.jpg', keys: ['date', 'kharjura', 'phoenix dactylifera', 'phoenix', 'draksha'] },
  { src: '/images/ingredients/cichorium-intybus-kasni.jpg', keys: ['kasni', 'chicory', 'cichorium intybus', 'cichorium', 'kasni'] },
  { src: '/images/ingredients/tinospora-cordifolia-guduchi.jpg', keys: ['guduchi', 'guduchi', 'tinospora', 'seenthil kodi', 'seenthil', 'guduchi'] },
  { src: '/images/ingredients/apple-cider-vinegar.jpg', keys: ['vinegar', 'apple cider', 'jaggery'] },
  { src: '/images/ingredients/wheat-germ-vitamin-e.jpg', keys: ['wheat germ', 'wheat'] },
  { src: '/images/ingredients/garcinia-cambogia-kudampuli.jpg', keys: ['garcinia cambogia', 'kudampuli', 'malabar tamarind', 'garcinia cambogia'] },
  { src: '/images/ingredients/glycyrrhiza-glabra-licorice.jpg', keys: ['licorice', 'glycyrrhiza', 'thadi', 'licorice root', 'glycyrrhiza glabra'] },
  { src: '/images/ingredients/asparagus-racemosus-shatavari.jpg', keys: ['shatavari', 'shatavari', 'asparagus racemosus', 'asparagus', 'shatavari root'] },
  { src: '/images/ingredients/cucurbita-maxima-pumpkin.jpg', keys: ['pumpkin', 'paraval', 'cucurbita maxima', 'cucurbita', 'pumpkin'] },
  { src: '/images/ingredients/eclipta-alba-bhringraj.jpg', keys: ['bhringraj', 'eclipta', 'eclipta alba', 'karisalankanni', 'bhringaraj', 'eclipta prostrata'] },
  { src: '/images/ingredients/solanum-trilobatum-thooduvalai.jpg', keys: ['thooduvalai', 'solanum trilobatum', 'solanum', 'thoduvai', 'kudampan'] },
  { src: '/images/ingredients/tribulus-terrestris-gokshura.jpg', keys: ['gokshura', 'tribulus', 'tribulus terrestris', 'gokshura'] },
  { src: '/images/ingredients/chlorophytum-borivilianum-musli.jpg', keys: ['musli', 'chlorophytum', 'shalparni', 'chlorophytum borivilianum', 'shatavari? no'] },
  { src: '/images/ingredients/camellia-sinensis-tea.jpg', keys: ['green tea', 'camellia sinensis', 'camellia', 'tea'] },
  { src: '/images/ingredients/mucuna-pruriens-velvet-bean.jpg', keys: ['mucuna', 'mucuna pruriens', 'velvet bean', 'kapikachchu', 'poonaikali', 'kapichchu'] },
  { src: '/images/ingredients/myristica-fragrans-nutmeg.jpg', keys: ['nutmeg', 'jathikai', 'myristica fragrans', 'myristica', 'nutmeg'] },
  { src: '/images/ingredients/syzygium-cumini-jamun.jpg', keys: ['jamun', 'syzygium cumini', 'chunnamavil', 'chunnamavil'] },
  { src: '/images/ingredients/rubia-cordifolia-manjistha.jpg', keys: ['manjistha', 'manjishtaka', 'indian madder', 'rubia cordifolia', 'rubia', 'manjistha root'] },
  { src: '/images/ingredients/clove-buds.jpg', keys: ['clove', 'krambu', 'karanthi', 'lavangam', 'syzygium aromaticum', 'clove bud'] },
  { src: '/images/ingredients/hibiscus-petals.jpg', keys: ['hibiscus', 'rosella', 'hibiscus sabdariffa', 'thenthoor', 'goda', 'hibiscus petal'] },
  { src: '/images/ingredients/black-pepper-seeds.jpg', keys: ['black pepper', 'milagu', 'piper nigrum', 'pepper', 'black pepper seed'] },
  { src: '/images/ingredients/red-onion.jpg', keys: ['red onion', 'allium cepa', 'onion', 'ellu'] },
  { src: '/images/ingredients/avocado-fruit.jpg', keys: ['avocado', 'butter fruit', 'avocado'] },
  { src: '/images/ingredients/wrightia-tinctoria.jpg', keys: ['wrightia tinctoria', 'wrightia', 'vetpalai', 'vetiver', 'vetpalai leaf'] },
  { src: '/images/ingredients/fennel-seeds.jpg', keys: ['fennel', 'shombu', 'sweet fennel', 'foeniculum', 'fennel seed', 'mushipallan'] },
  { src: '/images/ingredients/curry-leaves.jpg', keys: ['curry leaves', 'karuveppilai', 'karuvai', 'murraya koenigii', 'murraya', 'curry leaf'] },
  { src: '/images/ingredients/moringa-leaves.jpg', keys: ['moringa', 'murungai', 'murungai ilai', 'moringa oleifera', 'moringa leaf'] },
  { src: '/images/ingredients/ashwagandha-root.jpg', keys: ['ashwagandha', 'withania', 'ashwagandha root', 'ashwagandha'] },
  { src: '/images/ingredients/alum-crystals.png', keys: ['alum', 'phitkari', 'fitkari', 'alum crystal', 'rock alum'] },
  { src: '/images/ingredients/camphor-flakes.png', keys: ['camphor', 'karpooram', 'camphor flake', 'karpooram flake'] },
  { src: '/images/ingredients/dry-ginger-sunthi.png', keys: ['ginger', 'dry ginger', 'sunthi', 'chukku', 'zingiber', 'adingil', 'zingiber officinale'] },
  { src: '/images/ingredients/himalayan-pink-salt.png', keys: ['pink salt', 'himalayan', 'himalayan pink', 'pink rock salt'] },
  { src: '/images/ingredients/menthol-peppermint.png', keys: ['menthol', 'peppermint', 'mint', 'puthina', 'pudina', 'peppermint leaf'] },
  { src: '/images/ingredients/rock-salt.png', keys: ['rock salt', 'induppu', 'salt', 'induppu rock salt'] },
  { src: '/images/ingredients/avuri-neeli.webp', keys: ['avuri', 'neeli', 'indigo', 'indigofera tinctoria', 'indigofera'] },
  { src: '/images/ingredients/kadukkai-haritaki.webp', keys: ['kadukkai', 'haritaki', 'terminalia chebula', 'chebula', 'kadukkai fruit'] },
  { src: '/images/ingredients/thanrikkai-bibhitaki.webp', keys: ['thanrikkai', 'bibhitaki', 'vibhitaki', 'bitaki', 'terminalia bellirica', 'bellirica'] },
  { src: '/images/ingredients/nellikai-amla.webp', keys: ['nellikkai', 'nelli', 'amla', 'amalaki', 'amaraki', 'emblica officinalis', 'emblica', 'nellik'] },
  { src: '/images/ingredients/tulsi-holy-basil.jpg', keys: ['tulsi', 'tulasi', 'thulasi', 'holy basil', 'ocimum', 'basil', 'tulasi leaf'] },
  { src: '/images/ingredients/fenugreek-seeds.jpg', keys: ['fenugreek', 'vendhayam', 'vendha', 'trigonella', 'trigonella foenum', 'fenugreek seed', 'fenugreek leaves'] },
  { src: '/images/ingredients/arjuna-bark.jpg', keys: ['arjuna', 'terminalia arjuna', 'marudha maram', 'marudu', 'arjuna bark', 'marudha'] },
  { src: '/images/ingredients/aloe-vera-gel.jpg', keys: ['aloe', 'aloe vera', 'aloe barbadensis', 'kumbhirai', 'aloe leaf', 'aloe barbadensis miller'] },
];

/** Lower-case, symbol-stripped, whitespace-normalized form of a string. */
function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/&amp;/g, '&')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function wordPattern(key: string): RegExp {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(?<![a-z])${escaped}(?![a-z])`, 'i');
}

/**
 * Resolve the correct botanical image for a parsed ingredient.
 *
 * The match runs against the ingredient's common name, its aliases and its
 * Latin binomial. A longer (more specific) matched keyword wins, so e.g.
 * "curcuma longa" resolves to the turmeric photo rather than a generic one.
 * Unrecognized ingredients fall back to the generic herbs image so every card
 * still displays a relevant botanical.
 */
export function resolveIngredientImage(args: {
  name?: string;
  aliases?: string[];
  latin?: string;
  description?: string;
}): string {
  const haystackParts: string[] = [];
  if (args.name) haystackParts.push(args.name);
  if (args.aliases) haystackParts.push(...args.aliases);
  if (args.latin) haystackParts.push(args.latin);
  if (args.description) haystackParts.push(args.description);

  const haystack = normalize(haystackParts.join(' '));
  if (!haystack) return INGREDIENT_FALLBACK_IMAGE;

  let bestSrc: string | null = null;
  let bestScore = 0;

  for (const entry of LIBRARY) {
    for (const key of entry.keys) {
      const isPhrase = key.includes(' ');
      const found = isPhrase
        ? haystack.includes(key.toLowerCase())
        : wordPattern(key).test(haystack);
      if (found && key.length > bestScore) {
        bestScore = key.length;
        bestSrc = entry.src;
      }
    }
  }

  return bestSrc ?? INGREDIENT_FALLBACK_IMAGE;
}
