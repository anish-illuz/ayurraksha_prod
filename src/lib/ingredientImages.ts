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

/**
 * Product-specific overrides.
 *
 * When an ingredient is resolved for a specific product, these overrides take
 * precedence over the generic cross-product library. This ensures that custom
 * ingredient photos provided specifically for a product (e.g. Foot Bath Powder,
 * Kalonji Soap, Migro Prime, etc.) are only applied to
 * that product without altering other products.
 */
const PRODUCT_OVERRIDES: Record<string, IngredientImageEntry[]> = {
  'ayur-raksha-foot-bath-powder': [
    { src: '/images/ingredients/products/ayur-raksha-foot-bath-powder/epsom-salt.jpg', keys: ['epsom salt', 'epsom'] },
    { src: '/images/ingredients/products/ayur-raksha-foot-bath-powder/rock-salt.jpg', keys: ['rock salt', 'induppu', 'salt'] },
    { src: '/images/ingredients/products/ayur-raksha-foot-bath-powder/dry-ginger.jpg', keys: ['dry ginger', 'ginger', 'sunthi', 'chukku'] },
    { src: '/images/ingredients/products/ayur-raksha-foot-bath-powder/menthol.jpg', keys: ['menthol'] },
    { src: '/images/ingredients/products/ayur-raksha-foot-bath-powder/peppermint-oil.jpg', keys: ['peppermint oil', 'peppermint'] },
    { src: '/images/ingredients/products/ayur-raksha-foot-bath-powder/thymol.jpg', keys: ['thymol'] },
    { src: '/images/ingredients/products/ayur-raksha-foot-bath-powder/bhimseni.jpg', keys: ['bhimseni karpooram', 'bhimseni'] },
    { src: '/images/ingredients/products/ayur-raksha-foot-bath-powder/karpooram.jpg', keys: ['karpooram', 'camphor'] },
  ],
  'ayurraksha-kalonji-soap': [
    { src: '/images/ingredients/products/ayurraksha-kalonji-soap/karunjeera.jpg', keys: ['kalonji', 'black seed', 'karunjeera', 'karunjeeragam', 'nigella', 'nigella sativa'] },
  ],
  'ayurraksha-immuno3-immunity-booster-capsules': [
    { src: '/images/ingredients/products/ayurraksha-immuno3-immunity-booster-capsules/amla.webp', keys: ['amla', 'amalaki', 'emblica', 'nellikai', 'nellikkai'] },
    { src: '/images/ingredients/products/ayurraksha-immuno3-immunity-booster-capsules/ashwagandha.jpg', keys: ['ashwagandha', 'withania'] },
    { src: '/images/ingredients/products/ayurraksha-immuno3-immunity-booster-capsules/spirulina.jpg', keys: ['spirulina', 'arthrospira'] },
    { src: '/images/ingredients/products/ayurraksha-immuno3-immunity-booster-capsules/nigella-sativa-seed-oil-black-seed-or-kalonji-oil.jpg', keys: ['nigella sativa', 'nigella', 'black seed', 'kalonji'] },
    { src: '/images/ingredients/products/ayurraksha-immuno3-immunity-booster-capsules/olive-oil.jpg', keys: ['olive oil', 'olive'] },
    { src: '/images/ingredients/products/ayurraksha-immuno3-immunity-booster-capsules/plant-extracts.jpg', keys: ['plant extracts', 'plant extract'] },
    { src: '/images/ingredients/products/ayurraksha-immuno3-immunity-booster-capsules/vitamin-e.jpg', keys: ['vitamin e'] },
  ],
  'ayurraksha-vital-o3-anti-vitiligo-cream': [
    { src: '/images/ingredients/products/ayurraksha-vital-o3-anti-vitiligo-cream/aloe-vera-leaf-juice.jpg', keys: ['aloe vera', 'aloe', 'aloe vera leaf juice', 'aloe barbadensis'] },
    { src: '/images/ingredients/products/ayurraksha-vital-o3-anti-vitiligo-cream/turmeric.jpg', keys: ['turmeric', 'curcuma', 'haridra', 'manjal'] },
    { src: '/images/ingredients/products/ayurraksha-vital-o3-anti-vitiligo-cream/neem.jpg', keys: ['neem', 'azadirachta', 'nimba'] },
    { src: '/images/ingredients/products/ayurraksha-vital-o3-anti-vitiligo-cream/saponified-vegetable-oils.jpg', keys: ['ozonated', 'botanical oils', 'saponified', 'vegetable oils'] },
    { src: '/images/ingredients/products/ayurraksha-vital-o3-anti-vitiligo-cream/curcumin.jpg', keys: ['curcumin'] },
    { src: '/images/ingredients/products/ayurraksha-vital-o3-anti-vitiligo-cream/medicinal-plant-extracts.jpg', keys: ['medicinal plant extracts', 'medicinal plant extract'] },
    { src: '/images/ingredients/products/ayurraksha-vital-o3-anti-vitiligo-cream/oleic-acid.jpg', keys: ['oleic acid', 'oleic'] },
  ],
  'migro-prime-tablets': [
    { src: '/images/ingredients/products/migro-prime-tablets/piper-longum.jpg', keys: ['piper longum', 'long pepper', 'pippali', 'thippili'] },
    { src: '/images/ingredients/products/migro-prime-tablets/picrorhiza-kurroa.jpg', keys: ['picrorhiza kurroa', 'picrorhiza', 'kutki', 'katuki'] },
    { src: '/images/ingredients/products/migro-prime-tablets/cucumis-sativus.jpg', keys: ['cucumis sativus', 'cucumis', 'cucumber'] },
    { src: '/images/ingredients/products/migro-prime-tablets/clitoria-ternatea.png', keys: ['clitoria ternatea', 'clitoria', 'butterfly pea', 'shankhpushpi'] },
    { src: '/images/ingredients/products/migro-prime-tablets/crocus-sativus.jpg', keys: ['crocus sativus', 'crocus', 'kesar', 'saffron'] },
    { src: '/images/ingredients/products/migro-prime-tablets/tinospora-cordifolia.jpg', keys: ['tinospora cordifolia', 'tinospora', 'guduchi', 'seenthil kodi'] },
    { src: '/images/ingredients/products/migro-prime-tablets/momordica-charantia.jpg', keys: ['momordica charantia', 'momordica', 'karela', 'bitter melon'] },
    { src: '/images/ingredients/products/migro-prime-tablets/terminalia-chebula.jpg', keys: ['terminalia chebula', 'haritaki', 'kadukkai'] },
    { src: '/images/ingredients/products/migro-prime-tablets/amla.jpg', keys: ['emblica officinalis', 'emblica', 'amla'] },
    { src: '/images/ingredients/products/migro-prime-tablets/chrysanthemum-indicum.jpg', keys: ['chrysanthemum indicum', 'chrysanthemum'] },
    { src: '/images/ingredients/products/migro-prime-tablets/teramnus-labialis.jpg', keys: ['teramnus labialis', 'teramnus'] },
    { src: '/images/ingredients/products/migro-prime-tablets/sphaeranthus-indicus.jpg', keys: ['sphaeranthus indicus', 'sphaeranthus'] },
    { src: '/images/ingredients/products/migro-prime-tablets/albizia-lebbeck.jpg', keys: ['albizia lebbeck', 'albizia'] },
    { src: '/images/ingredients/products/migro-prime-tablets/eclipta-alba.jpg', keys: ['eclipta alba', 'eclipta'] },
  ],
  'sleep-well-food-supplement-capsules': [
    { src: '/images/ingredients/products/sleep-well-food-supplement-capsules/brahmi.jpg', keys: ['brahmi', 'water hyssop', 'bacopa monnieri', 'bacopa'] },
    { src: '/images/ingredients/products/sleep-well-food-supplement-capsules/pumpkin.jpg', keys: ['pumpkin', 'cucurbita maxima', 'cucurbita'] },
    { src: '/images/ingredients/products/sleep-well-food-supplement-capsules/shankhpushpi.png', keys: ['shankhpushpi', 'convolvulus pluricaulis', 'convolvulus'] },
    { src: '/images/ingredients/products/sleep-well-food-supplement-capsules/valeriana-jatamansi.jpg', keys: ['valeriana jatamansi', 'valeriana'] },
    { src: '/images/ingredients/products/sleep-well-food-supplement-capsules/nardostachys-jatamansi.jpg', keys: ['nardostachys jatamansi', 'nardostachys'] },
    { src: '/images/ingredients/products/sleep-well-food-supplement-capsules/crocus-sativus.jpg', keys: ['crocus sativus', 'crocus', 'kesar', 'saffron'] },
  ],
  'ayur-raksha-alg': [
    { src: '/images/ingredients/products/ayur-raksha-alg/maruthamaram.jpg', keys: ['marudha maram', 'maruthamaram', 'terminalia arjuna', 'arjuna'] },
    { src: '/images/ingredients/products/ayur-raksha-alg/krambu.jpg', keys: ['krambu', 'clove', 'syzygium aromaticum', 'lavangam'] },
    { src: '/images/ingredients/products/ayur-raksha-alg/turmeric.jpg', keys: ['manjal', 'turmeric', 'curcuma longa'] },
    { src: '/images/ingredients/products/ayur-raksha-alg/papaya-leaf.jpg', keys: ['pappali', 'papaya', 'carica papaya'] },
    { src: '/images/ingredients/products/ayur-raksha-alg/tulasi.jpg', keys: ['tulasi', 'tulsi', 'holy basil', 'ocimum tenuiflorum'] },
    { src: '/images/ingredients/products/ayur-raksha-alg/inji.jpg', keys: ['inji', 'ginger', 'zingiber officinale'] },
    { src: '/images/ingredients/products/ayur-raksha-alg/murunga-ilai.jpg', keys: ['murungai', 'moringa', 'moringa oleifera'] },
    { src: '/images/ingredients/products/ayur-raksha-alg/amla.jpg', keys: ['nellikkai', 'amla', 'phyllanthus emblica'] },
    { src: '/images/ingredients/products/ayur-raksha-alg/draksha.jpg', keys: ['draksha', 'grape', 'vitis vinifera'] },
    { src: '/images/ingredients/products/ayur-raksha-alg/garlic-allium-sativum.jpg', keys: ['garlic', 'allium sativum'] },
  ],
  'b-derma-capsules': [
    { src: '/images/ingredients/products/b-derma-capsules/santalum-album.jpg', keys: ['santalum album'] },
    { src: '/images/ingredients/products/b-derma-capsules/trichosanthes-dioica.jpg', keys: ['trichosanthes dioica', 'trichosanthes'] },
    { src: '/images/ingredients/products/b-derma-capsules/berberis-aristata.jpg', keys: ['berberis aristata', 'berberis'] },
    { src: '/images/ingredients/products/b-derma-capsules/curcuma-longa.jpg', keys: ['curcuma longa', 'turmeric'] },
    { src: '/images/ingredients/products/b-derma-capsules/acacia-catechu.jpg', keys: ['acacia catechu', 'catechu', 'khair'] },
    { src: '/images/ingredients/products/b-derma-capsules/azadirachta-indica.jpg', keys: ['azadirachta indica', 'neem', 'azadirachta'] },
  ],
  'ayur-raksha-creat-capsules': [
    { src: '/images/ingredients/products/ayur-raksha-creat-capsules/aloe-vera.jpg', keys: ['aloe vera', 'aloe'] },
    { src: '/images/ingredients/products/ayur-raksha-creat-capsules/phyllanthus-amarus.jpg', keys: ['keelanelli', 'phyllanthus amarus'] },
    { src: '/images/ingredients/products/ayur-raksha-creat-capsules/picrorhiza-kurroa.jpg', keys: ['katuki', 'picrorhiza kurroa', 'picrorhiza'] },
    { src: '/images/ingredients/products/ayur-raksha-creat-capsules/piper-nigrum.jpg', keys: ['milagu', 'black pepper', 'piper nigrum'] },
    { src: '/images/ingredients/products/ayur-raksha-creat-capsules/sambucus-nigra.jpg', keys: ['elderberry', 'sambucus nigra', 'sambucus'] },
    { src: '/images/ingredients/products/ayur-raksha-creat-capsules/trigonella-foenum-graecum.jpg', keys: ['vendhayam', 'fenugreek', 'trigonella foenum'] },
    { src: '/images/ingredients/products/ayur-raksha-creat-capsules/zingiber-officinale.jpg', keys: ['ginger', 'zingiber officinale', 'inji'] },
  ],
  'ayur-raksha-dant-swasthya': [
    { src: '/images/ingredients/products/ayur-raksha-dant-swasthya/akkarakaram.jpg', keys: ['aghrakaram', 'akkarakaram', 'akarkara'] },
    { src: '/images/ingredients/products/ayur-raksha-dant-swasthya/dry-ginger.jpg', keys: ['chukku', 'dry ginger'] },
    { src: '/images/ingredients/products/ayur-raksha-dant-swasthya/rock-salt.jpg', keys: ['induppu', 'rock salt'] },
    { src: '/images/ingredients/products/ayur-raksha-dant-swasthya/mint-salt.jpg', keys: ['puthina', 'mint salt'] },
    { src: '/images/ingredients/products/ayur-raksha-dant-swasthya/oma-uppu.jpg', keys: ['oma upp', 'ajwain', 'trachyspermum ammi'] },
    { src: '/images/ingredients/products/ayur-raksha-dant-swasthya/thippili.jpg', keys: ['thippili', 'long pepper', 'piper longum'] },
    { src: '/images/ingredients/products/ayur-raksha-dant-swasthya/krambu.jpg', keys: ['lavangam', 'clove', 'syzygium aromaticum'] },
    { src: '/images/ingredients/products/ayur-raksha-dant-swasthya/khair-acacia-catechu-extract.jpg', keys: ['karuvelam', 'catechu', 'acacia catechu', 'khair'] },
    { src: '/images/ingredients/products/ayur-raksha-dant-swasthya/blackpepper.jpg', keys: ['milagu', 'black pepper', 'piper nigrum'] },
  ],
  'ayurraksha-hair-care-oil': [
    { src: '/images/ingredients/products/ayurraksha-hair-care-oil/organic-coconut-oil.jpg', keys: ['coconut oil', 'coconut', 'cocos nucifera'] },
    { src: '/images/ingredients/products/ayurraksha-hair-care-oil/amla.jpg', keys: ['amla', 'phyllanthus emblica', 'nellikkai'] },
    { src: '/images/ingredients/products/ayurraksha-hair-care-oil/aloe-vera.jpg', keys: ['aloe vera', 'aloe'] },
    { src: '/images/ingredients/products/ayurraksha-hair-care-oil/hibiscus-hibiscus-rosa-sinensis.jpg', keys: ['hibiscus', 'hibiscus rosa sinensis'] },
    { src: '/images/ingredients/products/ayurraksha-hair-care-oil/bhringraj-eclipta-prostrata.jpg', keys: ['bhringraj', 'eclipta prostrata', 'eclipta'] },
    { src: '/images/ingredients/products/ayurraksha-hair-care-oil/phyllanthus-niruri.jpg', keys: ['phyllanthus niruri', 'keelanelli'] },
    { src: '/images/ingredients/products/ayurraksha-hair-care-oil/phyla-nodiflora.jpg', keys: ['phyla nodiflora', 'phyla'] },
    { src: '/images/ingredients/products/ayurraksha-hair-care-oil/indigo-indigofera-tinctoria.png', keys: ['indigo', 'indigofera tinctoria', 'indigofera', 'avuri'] },
    { src: '/images/ingredients/products/ayurraksha-hair-care-oil/henna-lawsonia-inermis.jpg', keys: ['henna', 'lawsonia inermis', 'lawsonia'] },
    { src: '/images/ingredients/products/ayurraksha-hair-care-oil/milk.jpg', keys: ['milk'] },
  ],
  'ayur-raksha-herbal-shampoo': [
    { src: '/images/ingredients/products/ayur-raksha-herbal-shampoo/aloe-vera.jpg', keys: ['aloe vera', 'aloe'] },
    { src: '/images/ingredients/products/ayur-raksha-herbal-shampoo/amla.jpg', keys: ['amla', 'phyllanthus emblica'] },
    { src: '/images/ingredients/products/ayur-raksha-herbal-shampoo/bhringraj-extract-powder.jpg', keys: ['bhringraj', 'eclipta'] },
    { src: '/images/ingredients/products/ayur-raksha-herbal-shampoo/cold-pressed-castor-oil.jpg', keys: ['castor oil', 'castor'] },
    { src: '/images/ingredients/products/ayur-raksha-herbal-shampoo/argan-oil.jpg', keys: ['argan oil', 'argan'] },
  ],
  'ayur-raksha-imu-360': [
    { src: '/images/ingredients/products/ayur-raksha-imu-360/maruthamaram.jpg', keys: ['marudha maram', 'maruthamaram', 'terminalia arjuna', 'arjuna'] },
    { src: '/images/ingredients/products/ayur-raksha-imu-360/krambu.jpg', keys: ['krambu', 'clove', 'syzygium aromaticum', 'lavangam'] },
    { src: '/images/ingredients/products/ayur-raksha-imu-360/turmeric.jpg', keys: ['manjal', 'turmeric', 'curcuma longa'] },
    { src: '/images/ingredients/products/ayur-raksha-imu-360/papaya-leaf.jpg', keys: ['pappali', 'papaya', 'carica papaya'] },
    { src: '/images/ingredients/products/ayur-raksha-imu-360/tulasi.jpg', keys: ['tulasi', 'tulsi', 'holy basil', 'ocimum tenuiflorum'] },
    { src: '/images/ingredients/products/ayur-raksha-imu-360/inji.jpg', keys: ['inji', 'ginger', 'zingiber officinale'] },
    { src: '/images/ingredients/products/ayur-raksha-imu-360/murunga-ilai.jpg', keys: ['murungai', 'moringa', 'moringa oleifera'] },
    { src: '/images/ingredients/products/ayur-raksha-imu-360/garlic-extract.jpg', keys: ['garlic', 'allium sativum'] },
  ],
  'sp-soryn-cream': [
    { src: '/images/ingredients/products/sp-soryn-cream/cynodon-dactylon.jpg', keys: ['cynodon dactylon', 'cynodon'] },
    { src: '/images/ingredients/products/sp-soryn-cream/indigofera-tinctoria.jpg', keys: ['indigofera tinctoria', 'indigofera', 'avuri', 'indigo'] },
    { src: '/images/ingredients/products/sp-soryn-cream/nigella-sativa.jpg', keys: ['nigella sativa', 'nigella', 'kalonji', 'black seed'] },
    { src: '/images/ingredients/products/sp-soryn-cream/pongamia-glabra.jpg', keys: ['pongamia glabra', 'pongamia'] },
    { src: '/images/ingredients/products/sp-soryn-cream/psoralea-corylifolia.gif', keys: ['psoralea corylifolia', 'psoralea', 'bakuchi'] },
    { src: '/images/ingredients/products/sp-soryn-cream/vernonia-anthelmintica.png', keys: ['vernonia anthelmintica', 'vernonia'] },
  ],
  'ayur-raksha-superheal-o3-cream': [
    { src: '/images/ingredients/products/ayur-raksha-superheal-o3-cream/olive-oil.jpg', keys: ['olive oil', 'olive', 'extra virgin olive'] },
    { src: '/images/ingredients/products/ayur-raksha-superheal-o3-cream/ozone-o3.jpg', keys: ['ozone', 'o3'] },
  ],
  'ayur-raksha-gargling-oil': [
    { src: '/images/ingredients/products/ayur-raksha-gargling-oil/sesame-oil.jpg', keys: ['sesame oil', 'sesame', 'cold pressed sesame', 'sesamum indicum'] },
    { src: '/images/ingredients/products/ayur-raksha-gargling-oil/organic-coconut-oil.jpg', keys: ['coconut oil', 'coconut', 'cocos nucifera'] },
    { src: '/images/ingredients/products/ayur-raksha-gargling-oil/clove-oil.jpg', keys: ['clove oil', 'clove'] },
  ],
  'boozliv': [
    { src: '/images/ingredients/products/boozliv/wedelia-calendulacea-kesaraja.jpg', keys: ['karicalai', 'wedelia calendulacea', 'wedelia', 'kesaraja'] },
    { src: '/images/ingredients/products/boozliv/phyllanthus-niruri-bhumyamalaki.jpg', keys: ['keezhanelli', 'phyllanthus niruri', 'keelanelli', 'bhumyamalaki'] },
    { src: '/images/ingredients/products/boozliv/piper-nigrum-marica.jpg', keys: ['milagu', 'black pepper', 'piper nigrum', 'marica'] },
    { src: '/images/ingredients/products/boozliv/aegle-marmelos-bilva.jpg', keys: ['shombu', 'vilvaver', 'bael', 'aegle marmelos', 'bilva'] },
    { src: '/images/ingredients/products/boozliv/andrographis-paniculata-kalmegh.jpg', keys: ['nilavembu', 'andrographis paniculata', 'andrographis', 'kalmegh'] },
  ],
  'divine-healing-oil': [
    { src: '/images/ingredients/products/divine-healing-oil/turmeric.jpg', keys: ['turmeric', 'haridra', 'curcuma longa'] },
    { src: '/images/ingredients/products/divine-healing-oil/neem.jpg', keys: ['neem', 'nimba', 'azadirachta indica'] },
    { src: '/images/ingredients/products/divine-healing-oil/terminalia-chebula.jpg', keys: ['haritaki', 'kadukkai', 'terminalia chebula'] },
    { src: '/images/ingredients/products/divine-healing-oil/bibhitaki.jpg', keys: ['bibhitaki', 'thanrikkai', 'terminalia bellirica'] },
    { src: '/images/ingredients/products/divine-healing-oil/red-sandalwood.jpg', keys: ['red sandalwood', 'rakta chandanam', 'pterocarpus santalinus'] },
    { src: '/images/ingredients/products/divine-healing-oil/amla.jpg', keys: ['amla', 'amalakki', 'nellikkai', 'phyllanthus emblica'] },
    { src: '/images/ingredients/products/divine-healing-oil/adathodai.jpg', keys: ['adathodai', 'vaasa', 'adhatoda vasica', 'adhatoda'] },
    { src: '/images/ingredients/products/divine-healing-oil/sesame-oil.jpg', keys: ['sesame oil', 'sesame', 'tila tailam', 'sesamum indicum'] },
    { src: '/images/ingredients/products/divine-healing-oil/kirata-tikta-swertia-chirata.jpg', keys: ['kirata', 'swertia chirata', 'swertia', 'chirata'] },
  ],
  'esnovate-immunity-boosting-capsules': [
    { src: '/images/ingredients/products/esnovate-immunity-boosting-capsules/adathodai.jpg', keys: ['adathodai', 'malabar nut', 'adhatoda', 'justicia'] },
    { src: '/images/ingredients/products/esnovate-immunity-boosting-capsules/thooduvalai.jpg', keys: ['thooduvalai', 'solanum trilobatum', 'thoduvai'] },
    { src: '/images/ingredients/products/esnovate-immunity-boosting-capsules/thippili.jpg', keys: ['thippili', 'long pepper', 'piper longum'] },
    { src: '/images/ingredients/products/esnovate-immunity-boosting-capsules/najaruppan.jpg', keys: ['nanjaruppan', 'najaruppan', 'tylophora indica', 'tylophora'] },
    { src: '/images/ingredients/products/esnovate-immunity-boosting-capsules/tulasi.jpg', keys: ['tulasi', 'tulsi', 'holy basil', 'ocimum'] },
  ],
  'etionment-pain-relief-cream': [
    { src: '/images/ingredients/products/etionment-pain-relief-cream/nochi.jpg', keys: ['nochi', 'vitex negundo', 'vitex', 'chasteberry'] },
    { src: '/images/ingredients/products/etionment-pain-relief-cream/ashwagandha.jpg', keys: ['ashwagandha', 'amukkira', 'withania somnifera', 'withania'] },
    { src: '/images/ingredients/products/etionment-pain-relief-cream/kungilium.jpg', keys: ['kungilium', 'kungilam', 'shorea robusta'] },
    { src: '/images/ingredients/products/etionment-pain-relief-cream/pachai-karpuram.jpg', keys: ['pachai karpuram', 'camphor', 'karpuram'] },
    { src: '/images/ingredients/products/etionment-pain-relief-cream/thenmelugu.jpg', keys: ['thennmelugu', 'thenmelugu', 'pinus roxburghii'] },
    { src: '/images/ingredients/products/etionment-pain-relief-cream/oma-uppu.jpg', keys: ['oma upp', 'ajwain', 'trachyspermum'] },
    { src: '/images/ingredients/products/etionment-pain-relief-cream/eucalyptus-globulus.jpg', keys: ['eucalyptus globulus', 'eucalyptus'] },
    { src: '/images/ingredients/products/etionment-pain-relief-cream/terminalia-chebula.jpg', keys: ['terminalia chebula', 'chebula', 'kadukkai'] },
    { src: '/images/ingredients/products/etionment-pain-relief-cream/thymus-vulgaris.jpg', keys: ['thymus vulgaris', 'thymus', 'thymol'] },
    { src: '/images/ingredients/products/etionment-pain-relief-cream/sesamum-indicum.jpg', keys: ['sesamum indicum', 'sesame', 'gingelly'] },
    { src: '/images/ingredients/products/etionment-pain-relief-cream/sida-cordifolia.jpg', keys: ['sida cordifolia', 'sida', 'bala'] },
    { src: '/images/ingredients/products/etionment-pain-relief-cream/cinnamomum-camphora.jpg', keys: ['cinnamomum camphora', 'cinnamomum'] },
  ],
  'purna-sakthi-tonic': [
    { src: '/images/ingredients/products/purna-sakthi-tonic/shatavari-asparagus-racemosus.jpg', keys: ['shatavari', 'asparagus racemosus', 'asparagus'] },
    { src: '/images/ingredients/products/purna-sakthi-tonic/curry-leaves.jpg', keys: ['curry leaves', 'murraya koenigii', 'murraya', 'karuveppilai'] },
    { src: '/images/ingredients/products/purna-sakthi-tonic/pumpkin.jpg', keys: ['pumpkin', 'cucurbita maxima', 'paraval'] },
    { src: '/images/ingredients/products/purna-sakthi-tonic/gurmar.jpg', keys: ['gurmar', 'gymnema sylvestre', 'gymnema'] },
    { src: '/images/ingredients/products/purna-sakthi-tonic/glycyrrhiza-glabra.jpg', keys: ['glycyrrhiza glabra', 'glycyrrhiza', 'licorice', 'thadi'] },
    { src: '/images/ingredients/products/purna-sakthi-tonic/triticum-sativum.jpg', keys: ['triticum sativum', 'triticum'] },
    { src: '/images/ingredients/products/purna-sakthi-tonic/symplocos-racemosa.jpg', keys: ['symplocos racemosa', 'symplocos'] },
    { src: '/images/ingredients/products/purna-sakthi-tonic/aloe-barbadensis.jpg', keys: ['aloe barbadensis', 'aloe vera', 'aloe'] },
    { src: '/images/ingredients/products/purna-sakthi-tonic/terminalia-arjuna.jpg', keys: ['terminalia arjuna', 'arjuna', 'marudha maram'] },
    { src: '/images/ingredients/products/purna-sakthi-tonic/garcinia-cambogia.jpg', keys: ['garcinia cambogia', 'garcinia', 'kudampuli'] },
    { src: '/images/ingredients/products/purna-sakthi-tonic/vitis-vinifera.jpg', keys: ['vitis vinifera', 'grape', 'draksha'] },
    { src: '/images/ingredients/products/purna-sakthi-tonic/amla.jpg', keys: ['amla', 'emblica', 'indian gooseberry', 'phyllanthus emblica'] },
    { src: '/images/ingredients/products/purna-sakthi-tonic/ashoka-leaf.jpg', keys: ['ashoka leaf', 'ashoka', 'saraca indica', 'saraca'] },
  ],
  'save-heart': [
    { src: '/images/ingredients/products/save-heart/garlic-extract.jpg', keys: ['garlic extract', 'garlic', 'allium sativum'] },
    { src: '/images/ingredients/products/save-heart/inji.jpg', keys: ['ginger extract', 'ginger', 'zingiber officinale', 'inji'] },
    { src: '/images/ingredients/products/save-heart/citrus-limon-extract.jpg', keys: ['lemon juice', 'lemon', 'citrus limon', 'citrus'] },
    { src: '/images/ingredients/products/save-heart/honey.jpg', keys: ['honey'] },
    { src: '/images/ingredients/products/save-heart/cardamom-elettaria-cardamomum.jpg', keys: ['cardamom', 'elettaria cardamomum', 'elettaria'] },
    { src: '/images/ingredients/products/save-heart/cumin-cuminum-cyminum.jpg', keys: ['cumin', 'cuminum cyminum', 'cuminum'] },
  ],
  'ayur-raksha-skinwell-soap-pack-of-2': [
    { src: '/images/ingredients/products/ayur-raksha-skinwell-soap-pack-of-2/sodium-palm-kernelate.jpg', keys: ['sodium palm kernelate'] },
    { src: '/images/ingredients/products/ayur-raksha-skinwell-soap-pack-of-2/aloe-barbadensis.jpg', keys: ['aloe barbadensis', 'aloe vera', 'aloe'] },
    { src: '/images/ingredients/products/ayur-raksha-skinwell-soap-pack-of-2/sapindus-mukorossi-root-extract.jpg', keys: ['sapindus mukorossi', 'soapnut', 'reetha'] },
    { src: '/images/ingredients/products/ayur-raksha-skinwell-soap-pack-of-2/azadirachta-indica-leaf-extract.png', keys: ['azadirachta indica', 'neem', 'vembu'] },
    { src: '/images/ingredients/products/ayur-raksha-skinwell-soap-pack-of-2/ocimum-sanctum-leaf-extract.jpg', keys: ['ocimum sanctum', 'ocimum', 'tulsi', 'holy basil'] },
    { src: '/images/ingredients/products/ayur-raksha-skinwell-soap-pack-of-2/argania-spinosa-kernel-oil.jpg', keys: ['argania spinosa', 'argan oil', 'argan'] },
    { src: '/images/ingredients/products/ayur-raksha-skinwell-soap-pack-of-2/triticum-vulgare-seed-oil.jpg', keys: ['triticum vulgare', 'wheat seed oil'] },
  ],
};

// Aliases support so CMS post_name also matches
PRODUCT_OVERRIDES['ayurraksha-foot-bath-powder-300g'] = PRODUCT_OVERRIDES['ayur-raksha-foot-bath-powder'];
PRODUCT_OVERRIDES['sleep-well-capsules'] = PRODUCT_OVERRIDES['sleep-well-food-supplement-capsules'];
PRODUCT_OVERRIDES['esnovate-capsules'] = PRODUCT_OVERRIDES['esnovate-immunity-boosting-capsules'];
PRODUCT_OVERRIDES['ayurraksha-gargling-oil'] = PRODUCT_OVERRIDES['ayur-raksha-gargling-oil'];

// One entry per asset in public/images/ingredients/. Keys are deliberately
// redundant (common + alias + latin) so a backend name in any of its forms
// resolves to the right photo. Multi-word keys phrase-match; single-word keys
// match on word boundaries.
const LIBRARY: IngredientImageEntry[] = [
  { src: '/images/ingredients/turmeric-rhizome.jpg', keys: ['turmeric', 'manjal', 'haridra', 'haridr', 'curcuma longa', 'curcuma', 'golden turmeric'] },
  { src: '/images/ingredients/neem-leaves.jpg', keys: ['neem', 'nimba', 'nimbam', 'nimbha', 'nemba', 'azadirachta indica', 'azadirachta'] },
  { src: '/images/ingredients/senna-leaves.jpg', keys: ['senna', 'cassia angustifolia', 'senna leaves'] },
  { src: '/images/ingredients/cinnamon-bark.jpg', keys: ['cinnamon', 'cinnamomum zeylanicum', 'cinnamomum', 'zeylanicum', 'cinnamon bark', 'elaku', 'dallakka'] },
  { src: '/images/ingredients/sesame-seeds.jpg', keys: ['sesame', 'gingelly', 'sesamum indicum', 'sesamum', 'tila tailam', 'tila', 'sesame seed', 'gingelly oil', 'sesame oil'] },
  { src: '/images/ingredients/raw-garlic-bulb.jpg', keys: ['garlic', 'allium sativum', 'lasun'] },
  { src: '/images/ingredients/fresh-lemon-citrus.jpg', keys: ['lemon', 'citrullus', 'citrus', 'nimbu', 'kankan'] },
  { src: '/images/ingredients/virgin-coconut-oil.jpg', keys: ['coconut', 'cocos nucifera', 'kadayi', 'coconut oil'] },
  { src: '/images/ingredients/bitter-melon-karela.jpg', keys: ['karela', 'bitter melon', 'momordica', 'kareerai'] },
  { src: '/images/ingredients/brahmi-bacopa.jpg', keys: ['brahmi', 'bacopa', 'water hyssop', 'bachi'] },
  { src: '/images/ingredients/kalonji-black-seed.webp', keys: ['kalonji', 'nigella', 'nigella sativa', 'black seed', 'karunjeeragam', 'kalonji oil'] },
  { src: '/images/ingredients/olive-oil-olives.jpg', keys: ['olive', 'olea europaea', 'olive oil', 'zaitun'] },
  { src: '/images/ingredients/eucalyptus-leaves.jpg', keys: ['eucalyptus'] },
  { src: '/images/ingredients/ragi-finger-millet.jpg', keys: ['ragi', 'finger millet', 'millet', 'elai'] },
  { src: '/images/ingredients/red-sandalwood.jpg', keys: ['red sandalwood', 'chandanam', 'chandan', 'sandalwood', 'pterocarpus santalinus', 'pterocarpus', 'santalinus', 'rakta chandanam'] },
  { src: '/images/ingredients/papaya-leaves.jpg', keys: ['papaya', 'carica papaya', 'pappali ilai', 'pappali'] },
  { src: '/images/ingredients/grape-seed.jpg', keys: ['grape', 'vitis vinifera', 'draksha', 'draksha', 'grape seed'] },
  { src: '/images/ingredients/almonds-badam.jpg', keys: ['almond', 'badam', 'prunus dulcis', 'almond', 'mandi badam'] },
  { src: '/images/ingredients/clitoria-ternatea-butterfly-pea.jpg', keys: ['butterfly pea', 'clitoria ternatea', 'clitoria', 'neeli kumbizha', 'butterfly pea'] },
  { src: '/images/ingredients/sida-cordifolia-bala.jpg', keys: ['bala', 'sida cordifolia', 'sida', 'bala herb', 'bala root'] },
  { src: '/images/ingredients/phyllanthus-niruri-keelanelli.jpg', keys: ['keelanelli', 'keelavembu', 'keezhanelli', 'phyllanthus niruri', 'bhumyamalaki', 'bhumiamalaki', 'bhumiyamalaki'] },
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
  { src: '/images/ingredients/piper-longum-pippali.jpg', keys: ['piper longum', 'pippali', 'long pepper', 'thippili', 'thippili'] },
  { src: '/images/ingredients/picrorhiza-kurroa-kutki.jpg', keys: ['kutki', 'katuki', 'picrorhiza', 'picrorhiza kurroa', 'kurchi'] },
  { src: '/images/ingredients/cucumis-sativus-cucumber.jpg', keys: ['cucumber', 'muskmelon', 'cucumis', 'cucumis sativus', 'khari'] },
  { src: '/images/ingredients/crocus-sativus-saffron.jpg', keys: ['saffron', 'crocus', 'crocus sativus', 'kesar', 'kumkum'] },
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
  { src: '/images/ingredients/nellikai-amla.webp', keys: ['nellikkai', 'nelli', 'amla', 'amalaki', 'amaraki', 'emblica officinalis', 'emblica', 'phyllanthus emblica', 'nellik'] },
  { src: '/images/ingredients/tulsi-holy-basil.jpg', keys: ['tulsi', 'tulasi', 'thulasi', 'holy basil', 'ocimum', 'basil', 'tulasi leaf'] },
  { src: '/images/ingredients/fenugreek-seeds.jpg', keys: ['fenugreek', 'vendhayam', 'vendha', 'trigonella', 'trigonella foenum', 'fenugreek seed', 'fenugreek leaves'] },
  { src: '/images/ingredients/arjuna-bark.jpg', keys: ['arjuna', 'terminalia arjuna', 'marudha maram', 'marudu', 'arjuna bark', 'marudha'] },
  { src: '/images/ingredients/aloe-vera-gel.jpg', keys: ['aloe', 'aloe vera', 'aloe barbadensis', 'kumbhirai', 'aloe leaf', 'aloe barbadensis miller'] },
  { src: '/images/ingredients/anacyclus-pyrethrum-akarkara.jpg', keys: ['aghrakaram', 'akrakarah', 'akarkara', 'anacyclus pyrethrum', 'anacyclus', 'pellitory'] },
  { src: '/images/ingredients/acacia-catechu-khair.jpg', keys: ['karuvelam pattai', 'black catechu', 'acacia catechu', 'catechu', 'khair', 'khadira'] },
  { src: '/images/ingredients/mixed-millet-grains.jpg', keys: ['millets and grains', 'millets', 'grains', 'millet mix'] },
  { src: '/images/ingredients/sorghum-jowar.jpg', keys: ['jowar', 'sorghum', 'sorghum bicolor'] },
  { src: '/images/ingredients/pearl-millet-bajra.jpg', keys: ['bajra', 'pearl millet'] },
  { src: '/images/ingredients/barley-grain.jpg', keys: ['barley', 'barley grain', 'hordeum vulgare'] },
  { src: '/images/ingredients/raw-rice-grain.jpg', keys: ['rice', 'raw rice', 'rice grain', 'oryza sativa'] },
  { src: '/images/ingredients/lentils-dal.jpg', keys: ['pulses and legumes', 'pulses', 'legumes', 'lentil', 'lentils', 'dal'] },
  { src: '/images/ingredients/roasted-gram-chana.jpg', keys: ['fried gram', 'roasted chana', 'roasted gram'] },
  { src: '/images/ingredients/mung-dal.jpg', keys: ['moong dal', 'green gram', 'mung bean', 'vigna radiata'] },
  { src: '/images/ingredients/chickpea.jpg', keys: ['chickpea', 'desi chana', 'chana', 'cicer arietinum'] },
  { src: '/images/ingredients/soybean.jpg', keys: ['soya', 'soybean', 'glycine max', 'soya bean'] },
  { src: '/images/ingredients/peanut-groundnut.jpg', keys: ['peanuts', 'groundnuts', 'groundnut', 'arachis hypogaea'] },
  { src: '/images/ingredients/mixed-nuts.jpg', keys: ['peanuts and nuts', 'mixed nuts', 'assorted nuts', 'nuts'] },
  { src: '/images/ingredients/elderberry.jpg', keys: ['elderberry', 'sambucus'] },
  { src: '/images/ingredients/morinda-pubescens-manjanathi.jpg', keys: ['manjanathi', 'morinda pubescens', 'morinda', 'manjanathi kezhangu', 'indian mulberry'] },
  { src: '/images/ingredients/saussurea-lappa-kuth.jpg', keys: ['kuth', 'costus', 'saussurea lappa', 'saussurea costus', 'saussurea'] },
  { src: '/images/ingredients/acalypha-indica-kuppaimeni.jpg', keys: ['kuppaimeni', 'acalypha indica', 'acalypha', 'indian nettle'] },
  { src: '/images/ingredients/psidium-guajava-guava.jpg', keys: ['guava', 'psidium guajava', 'guajava', 'guava extract'] },
  { src: '/images/ingredients/adhatoda-vasica-adathodai.jpg', keys: ['adathodai', 'adhatoda', 'adhatoda vasica', 'justicia adhatoda', 'vasaindu'] },
  { src: '/images/ingredients/shorea-robusta-kungilium.jpg', keys: ['kungilium', 'shorea robusta', 'kungilam', 'red bean'] },
  { src: '/images/ingredients/vitex-negundo-nochi.jpg', keys: ['nochi', 'vitex negundo', 'chasteberry', 'five leaved chaste tree', 'five leaved', 'nischaya'] },
  { src: '/images/ingredients/trachyspermum-ammi-omauppu.jpg', keys: ['trachyspermum ammi', 'trachyspermum'] },
  { src: '/images/ingredients/pinus-roxburghii-thenmelugu.jpg', keys: ['thenmelugu', 'pinus roxburghii', 'pine resin', 'rosin', 'long pine'] },
  { src: '/images/ingredients/linum-usitatissimum-flax.jpg', keys: ['flax', 'linseed', 'linum usitatissimum', 'linum usitatissimum extract', 'flax seed'] },
  { src: '/images/ingredients/saraca-asoca-ashoka.jpg', keys: ['ashoka', 'saraca', 'asoka', 'ashoka leaf'] },
  { src: '/images/ingredients/honey-bee-product.jpg', keys: ['honey', 'madhu', 'bee honey'] },
  { src: '/images/ingredients/saponified-vegetable-oils.jpg', keys: ['saponified vegetable oils', 'saponified', 'vegetable oils', 'vegetable oil'] },
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
  productSlug?: string;
}): string {
  const haystackParts: string[] = [];
  if (args.name) haystackParts.push(args.name);
  if (args.aliases) haystackParts.push(...args.aliases);
  if (args.latin) haystackParts.push(args.latin);
  if (args.description) haystackParts.push(args.description);

  const haystack = normalize(haystackParts.join(' '));
  if (!haystack) return INGREDIENT_FALLBACK_IMAGE;

  // 1. Check product-specific overrides first if a product slug is provided
  if (args.productSlug) {
    const overrides = PRODUCT_OVERRIDES[args.productSlug.toLowerCase()];
    if (overrides) {
      let bestOverrideSrc: string | null = null;
      let bestOverrideScore = 0;

      for (const entry of overrides) {
        for (const key of entry.keys) {
          const isPhrase = key.includes(' ');
          const found = isPhrase
            ? haystack.includes(key.toLowerCase())
            : wordPattern(key).test(haystack);
          if (found && key.length > bestOverrideScore) {
            bestOverrideScore = key.length;
            bestOverrideSrc = entry.src;
          }
        }
      }

      if (bestOverrideSrc) {
        return bestOverrideSrc;
      }
    }
  }

  // 2. Fall back to generic cross-product library
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
