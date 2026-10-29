export interface CustomerReview {
  id: string;
  author: string;
  location: string;
  rating: number;
  productName: string;
  productSlug: string;
  title: string;
  content: string;
  verified: boolean;
  date: string;
}

export const VERIFIED_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    author: 'Mr. Salim K.',
    location: 'Chennai, Tamil Nadu',
    rating: 5,
    productName: 'BoozLiv Herbal Tonic',
    productSlug: 'boozliv',
    title: 'A transformative journey back to normal liver health',
    content: 'After continuous guidance and taking BoozLiv consistently for 60 days, my digestive comfort and appetite returned completely. My follow-up reports showed remarkable stability.',
    verified: true,
    date: 'July 2025',
  },
  {
    id: 'rev-2',
    author: 'Mr. Rama Krishnan',
    location: 'Madurai, Tamil Nadu',
    rating: 5,
    productName: 'AyurRaksha Divine Healing Oil',
    productSlug: 'divine-healing-oil',
    title: 'Deep relief for persistent joint and knee pain',
    content: 'The herbal aroma is authentic and soothing. Within two weeks of daily massage, the morning stiffness in my knees reduced drastically. It has become an essential part of my routine.',
    verified: true,
    date: 'August 2025',
  },
  {
    id: 'rev-3',
    author: 'Mrs. Saraswathi',
    location: 'Coimbatore, Tamil Nadu',
    rating: 5,
    productName: 'AyurRaksha Skin Well Pack',
    productSlug: 'skin-well-pack',
    title: 'Real relief for chronic skin irritation and flaking',
    content: 'I had struggled for years with dry, irritable patches on my arms. Combining the SkinWell soap with the external healing oil cleared the redness without any burning or steroids.',
    verified: true,
    date: 'August 2025',
  },
  {
    id: 'rev-4',
    author: 'Mrs. Devi P.',
    location: 'Bengaluru, Karnataka',
    rating: 5,
    productName: 'Purna Sakthi Tonic',
    productSlug: 'purna-sakthi-tonic',
    title: 'Restored vitality, energy, and cycle balance',
    content: 'Purna Sakthi helped me overcome daily fatigue and weakness. It is gentle on the stomach and genuinely revitalizing. Thank you Dr. Jegajothi Pandian and team.',
    verified: true,
    date: 'August 2025',
  },
  {
    id: 'rev-5',
    author: 'Mr. Ranganathan M.',
    location: 'Tiruchirappalli, Tamil Nadu',
    rating: 5,
    productName: 'Flow Well Pack',
    productSlug: 'flow-well-pack',
    title: 'Remarkable easing of lower leg heaviness',
    content: 'Standing for long hours at work used to leave my calves throbbing with vein tightness. Flow Well provided significant comfort and reduced the evening swelling.',
    verified: true,
    date: 'July 2025',
  },
  {
    id: 'rev-6',
    author: 'Mr. Sasi Kumar',
    location: 'Salem, Tamil Nadu',
    rating: 5,
    productName: 'BoozLiv Herbal Tonic',
    productSlug: 'boozliv',
    title: 'Appetite and digestion restored naturally',
    content: 'My digestion felt sluggish and heavy for months. After starting the 30-day course of BoozLiv, my appetite naturally stimulated and bloating disappeared.',
    verified: true,
    date: 'July 2025',
  },
];
