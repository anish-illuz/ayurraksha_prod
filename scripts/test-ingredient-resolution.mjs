/* Simulate every live-CMS ingredient card through the resolver and confirm
 * each resolves to its product-specific photo (or a known shared-library hit).
 * Run:  node scripts/test-ingredient-resolution.mjs
 */
import { resolveIngredientImage } from '../src/lib/ingredientImages.ts';

const FALLBACK = '/images/ingredients/traditional-raw-ayurvedic-herbs-mortar.webp';

// [resolver productSlug, CMS ingredient items as parsed]
const T = [
  ['ayur-raksha-alg', ['Marudha Maram', 'Krambu / Clove — Syzygium aromaticum', 'Manjal / Turmeric — Curcuma longa', 'Pappali Ilai / Papaya Leaf — Carica papaya', 'Tulasi / Holy Basil — Ocimum tenuiflorum', 'Inji / Ginger — Zingiber officinale', 'Murungai Ilai / Moringa Leaf — Moringa oleifera', 'Nellikkai / Amla — Phyllanthus emblica', 'Draksha / Grape — Vitis vinifera', 'Garlic - Allium sativum']],
  ['b-derma-capsules', ['Santalum album', 'Trichosanthes dioica', 'Berberis aristata', 'Curcuma longa', 'Acacia catechu', 'Azadirachta indica']],
  ['ayur-raksha-creat-capsules', ['Aloe vera', 'Keelanelli — Phyllanthus amarus', 'Katuki — Picrorhiza kurroa', 'Inji / Ginger — Zingiber officinale', 'Milagu / Black Pepper — Piper nigrum', 'Vendhayam / Fenugreek — Trigonella foenum-graecum', 'Elderberry — Sambucus nigra']],
  ['ayur-raksha-dant-swasthya', ['Aghrakaram', 'Chukku / Dry Ginger — Zingiber officinale', 'Induppu / Rock Salt', 'Puthina Uppu / Mint Salt', 'Oma Uppu / Ajwain Salt', 'Thippili / Long Pepper — Piper longum', 'Lavangam / Clove — Syzygium aromaticum', 'Karuvelam Pattai / Black Catechu — Acacia catechu', 'Lavanga Pattai / Cinnamon Bark — Cinnamomum zeylanicum', 'Milagu (black pepper)']],
  ['ayurraksha-hair-care-oil', ['Coconut oil - Cocos nucifera', 'Amla - Phyllanthus emblica', 'Aloe vera', 'Hibiscus - Hibiscus rosa-sinensis', 'Bhringraj - Eclipta prostrata', 'Phyllanthus niruri', 'Phyla nodiflora', 'Indigo - Indigofera tinctoria', 'Henna - Lawsonia inermis', 'Milk']],
  ['ayur-raksha-herbal-shampoo', ['Aloe Vera', 'Amla Extract', 'Bhringraj Extract', 'Castor Oil', 'Argan Oil']],
  ['ayur-raksha-imu-360', ['Marudha Maram / Arjuna — Terminalia arjuna', 'Krambu / Clove — Syzygium aromaticum', 'Manjal / Turmeric — Curcuma longa', 'Pappali Ilai / Papaya Leaf — Carica papaya', 'Tulasi / Holy Basil — Ocimum tenuiflorum', 'Inji / Ginger — Zingiber officinale', 'Murungai Ilai / Moringa Leaf — Moringa oleifera', 'Allium sativum (Garlic)']],
  ['sp-soryn-cream', ['Indigofera tinctoria', 'Psoralea corylifolia', 'Nigella sativa', 'Pongamia glabra', 'Vernonia anthelmintica', 'Cynodon dactylon']],
  ['ayurraksha-immuno3-immunity-booster-capsules', ['Amla', 'Ashwagandha', 'Spirulina']],
  ['ayur-raksha-superheal-o3-cream', ['Extra Virgin Olive Oil', 'Ozone (O3)']],
  ['ayur-raksha-foot-bath-powder', ['Epsom Salt', 'Rock Salt', 'Dry Ginger', 'Menthol', 'Thymol', 'Bhimseni Karpooram', 'Peppermint Oil']],
  ['ayur-raksha-gargling-oil', ['Cold-Pressed Sesame Oil', 'Coconut Oil', 'Clove Oil']],
  ['ayur-raksha-premium-high-fiber-health-mix', ['Ragi', 'jowar', 'wheat', 'bajra', 'barley', 'rice', 'fried gram', 'moong dal', 'desi chickpea', 'soya', 'peanut', 'badam', 'cashew nut', 'cardamom']],
  ['boozliv', ['Karicalai, Wedelia calendulacea', 'Keezhanelli, Phyllanthus niruri', 'Milagu / Black Pepper, Piper nigrum', 'Shombu Vilvaver / Bael Root, Aegle Marmelos', 'nilavembu, Andrographis paniculata']],
  ['divine-healing-oil', ['Haridra / Turmeric — Curcuma longa rhizome', 'Nimba / Neem — Azadirachta indica leaf', 'Haritaki / Kadukkai — Terminalia chebula fruit', 'Bibhitaki / Thanrikkai — Terminalia bellirica fruit', 'Rakta Chandanam / Red Sandalwood — Pterocarpus santalinus heartwood', 'Amalaki / Amla / Nellikai — Phyllanthus emblica fruit', 'Vaasa / Adathodai — Adhatoda vasica leaves', 'Sesame Oil / Tila Tailam — Sesamum indicum', 'Kirata Tikta - Swertia chirata']],
  ['esnovate-immunity-boosting-capsules', ['Adathodai / Malabar Nut — Justicia adhatoda / Adhatoda vasica', 'Thooduvalai — Solanum trilobatum', 'Thippili / Long Pepper — Piper longum', 'Nanjaruppan — Tylophora indica', 'Tulasi / Holy Basil — Ocimum tenuiflorum / Ocimum sanctum']],
  ['etionment-pain-relief-cream', ['Nochi — Vitex negundo', 'Vaadanarayanan', 'Amukkira / Ashwagandha — Withania somnifera', 'Kungilium', 'Pachai Karpuram', 'Thennmelugu', 'Oma Uppu', 'Eucalyptus globulus', 'Terminalia chebula', 'Thymus vulgaris', 'Sesamum indicum', 'Sida cordifolia', 'Cinnamomum camphora']],
  ['migro-prime-tablets', ['Piper longum', 'Picrorhiza kurroa', 'Cucumis sativus', 'Clitoria ternatea', 'Crocus sativus', 'Tinospora cordifolia', 'Momordica charantia', 'Terminalia chebula', 'Terminalia bellirica', 'Emblica officinalis', 'Chrysanthemum indicum', 'Teramnus labialis', 'Sphaeranthus indicus', 'Albizia lebbeck', 'Eclipta alba']],
  ['purna-sakthi-tonic', ['Shatavari — Asparagus racemosus', 'Curry Leaves — Murraya koenigii', 'Pumpkin — Cucurbita maxima', 'Gurmar — Gymnema sylvestre', 'Amla / Indian Gooseberry', 'Glycyrrhiza glabra', 'Triticum sativum', 'Symplocos racemosa', 'Aloe barbadensis', 'Terminalia arjuna', 'Garcinia cambogia', 'Vitis vinifera', 'Phyllanthus emblica', 'Ashoka Leaf — Saraca indica']],
  ['save-heart', ['Garlic Extract — Allium sativum', 'Ginger Extract — Zingiber officinale', 'Lemon Juice — Citrus limon', 'Apple Cider Vinegar', 'Honey', 'Cardamom / Elettaria cardamomum', 'Cumin / Cuminum cyminum']],
  ['ayur-raksha-skinwell-soap-pack-of-2', ['Sodium Palm Kernelate', 'Aloe Barbadensis', 'Sapindus Mukorossi Root Extract', 'Azadirachta Indica Leaf Extract', 'Ocimum Sanctum Leaf Extract', 'Argania Spinosa Kernel Oil', 'Triticum Vulgare Seed Oil']],
  ['sleep-well-food-supplement-capsules', ['Brahmi / Water Hyssop — Bacopa monnieri', 'Pumpkin — Cucurbita maxima', 'Shankhpushpi — Convolvulus pluricaulis', 'Valeriana Jatamansi', 'Nardostachys Jatamansi', 'Crocus Sativus']],
  ['ayurraksha-vital-o3-anti-vitiligo-cream', ['Ozonated oil', 'Oleic acid', 'Curcumin', 'Medicinal plant extracts', 'Aloe Vera', 'Turmeric', 'Neem']],
];

let total = 0;
let hardFallbacks = 0;
for (const [slug, items] of T) {
  for (const it of items) {
    total++;
    const r = resolveIngredientImage({ name: it, description: it, productSlug: slug });
    const isProductSpecific = r.includes(`/products/${slug}/`);
    if (r === FALLBACK) {
      hardFallbacks++;
      console.log(`FALLBACK      ${slug} | ${it}`);
    } else if (!isProductSpecific) {
      console.log(`LIB-IMAGE     ${slug} | ${it}  -> ${r}`);
    }
  }
}
console.log(`\nchecked ${total} ingredient cards across ${T.length} products; hard fallbacks: ${hardFallbacks}`);
