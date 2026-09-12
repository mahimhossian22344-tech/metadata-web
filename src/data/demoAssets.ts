import { StockFileItem } from '../types';

// Exact SVG Vector Logo for "wellness logo3.jpg" matching user screenshot Image 1
const WELLNESS_LOGO_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
  <rect width="600" height="600" fill="%23ffffff"/>
  <g transform="translate(100, 80)">
    <!-- Leaves growing out of capsule center -->
    <path d="M200 230 C200 130 140 80 110 130 C130 190 190 220 200 230 Z" fill="%2376bb12"/>
    <path d="M200 230 C200 110 200 50 200 50 C200 50 200 110 200 230 Z" stroke="%23ffffff" stroke-width="3" stroke-linecap="round"/>
    <path d="M200 230 C200 100 200 40 200 40 C220 90 270 120 200 230 Z" fill="%2384cc16"/>
    <path d="M200 230 C190 100 200 40 200 40 C180 90 130 120 200 230 Z" fill="%2365a30d"/>
    <path d="M200 230 C200 130 260 80 290 130 C270 190 210 220 200 230 Z" fill="%2384cc16"/>

    <!-- Capsule Left Orange Half -->
    <path d="M60 260 C60 215 95 180 140 180 L180 180 L180 340 L140 340 C95 340 60 305 60 260 Z" fill="%23ff6600"/>
    <!-- Capsule Right Orange Half -->
    <path d="M220 180 L260 180 C305 180 340 215 340 260 C340 305 305 340 260 340 L220 340 Z" fill="%23ff6600"/>

    <!-- Capsule Inner Highlights -->
    <path d="M75 250 C75 225 95 200 130 200 L170 200" stroke="%23ffffff" stroke-width="8" stroke-linecap="round" fill="none"/>
    <path d="M325 250 C325 225 305 200 270 200 L230 200" stroke="%23ffffff" stroke-width="8" stroke-linecap="round" fill="none"/>

    <!-- Center divider stem gap -->
    <rect x="180" y="180" width="40" height="160" fill="%23ffffff"/>
    <path d="M200 200 L200 330" stroke="%2384cc16" stroke-width="8" stroke-linecap="round"/>

    <!-- LOGO NAME Text -->
    <text x="200" y="410" font-family="Arial Black, Impact, sans-serif" font-size="34" font-weight="900" fill="%23111827" text-anchor="middle" letter-spacing="2">LOGO NAME</text>
    <text x="200" y="445" font-family="sans-serif" font-size="18" font-weight="700" fill="%23374151" text-anchor="middle">Slogan Here</text>
  </g>
</svg>`;

export const DEMO_STOCK_FILES: StockFileItem[] = [
  {
    id: 'demo-wellness-logo',
    filename: 'wellness logo3.jpg',
    previewUrl: WELLNESS_LOGO_SVG,
    fileSize: 1850000,
    fileType: 'image/jpeg',
    dimensions: { width: 4000, height: 4000 },
    status: 'ready',
    source: 'sample',
    title: 'Green leaves growing from an orange abstract shape a wellness logo design',
    description: 'A vector illustration depicting green leaves emerging from an orange abstract form, designed as a wellness logo with a white',
    keywords: [
      'leaves', 'foliage', 'plant', 'growth', 'organic', 'wellness', 'health', 'nature',
      'abstract', 'shape', 'design', 'logo', 'graphic', 'vector', 'illustration',
      'branding', 'corporate', 'identity', 'symbol', 'emblem', 'modern', 'minimal',
      'clean', 'fresh', 'vibrant', 'green', 'orange', 'whitebackground', 'isolated',
      'studio', 'concept', 'ecology', 'sustainable', 'botanical', 'flourish', 'vitality'
    ],
    category: 'Illustration',
    pngData: {
      category1: 'ILLUSTRATION',
      category2: 'Nature',
      mainKeywords: ['wellness logo', 'green leaves', 'abstract shape'],
      secondaryKeywords: [
        'foliage plant', 'organic growth', 'health nature', 'vector graphic',
        'branding corporate', 'modern emblem', 'minimal clean', 'fresh vibrant',
        'whitebackground isolated', 'ecology concept', 'sustainable flourish'
      ],
      promptKeywords: 'Vector illustration depicting fresh green leaves emerging from an orange abstract capsule form, modern corporate wellness logo.',
      aiPlatformName: 'Midjourney',
      aiPlatformUrl: 'https://www.midjourney.com',
      uploadId: '22263531',
    },
  },
  {
    id: 'demo-1',
    filename: 'fresh_coffee_cup_isolated_white.jpg',
    previewUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
    fileSize: 2450000,
    fileType: 'image/jpeg',
    dimensions: { width: 4000, height: 3000 },
    status: 'ready',
    source: 'sample',
    title: 'Hot ceramic coffee cup with steam isolated on pure white background',
    description: 'Fresh brewed aromatic hot coffee in a clean ceramic cup isolated on a pure white background with copy space for design.',
    keywords: [
      'coffee', 'cup', 'isolated', 'white background', 'steam', 'hot', 'beverage',
      'ceramic', 'drink', 'aroma', 'morning', 'breakfast', 'caffeine', 'espresso',
      'cafe', 'copyspace', 'blank', 'cutout', 'fresh', 'simple', 'clean',
      'mug', 'table', 'relax', 'warm', 'lifestyle', 'taste', 'roast'
    ],
    category: 'Food & Drink',
    pngData: {
      category1: 'ELEMENTS',
      category2: 'Food & Drink',
      mainKeywords: ['coffee cup', 'steam isolated', 'white background'],
      secondaryKeywords: [
        'hot beverage', 'ceramic mug', 'espresso aroma', 'morning breakfast',
        'caffeine drink', 'fresh roast', 'cafe tableware', 'copyspace blank',
        'isolated cutout', 'simple clean', 'warm drink', 'creamy latte'
      ],
      promptKeywords: 'White ceramic coffee cup with steaming espresso beverage on a clean isolated background.',
      aiPlatformName: 'Midjourney',
      aiPlatformUrl: 'https://www.midjourney.com',
      uploadId: '22263531',
    },
  },
  {
    id: 'demo-2',
    filename: 'modern_futuristic_technology_grid.jpg',
    previewUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
    fileSize: 3120000,
    fileType: 'image/jpeg',
    dimensions: { width: 4096, height: 2286 },
    status: 'ready',
    source: 'sample',
    title: 'Digital cybersecurity code and glowing binary data streaming on dark network background',
    description: 'High tech cyber security matrix with glowing binary code stream and digital communication concept for modern banner backdrop.',
    keywords: [
      'technology', 'digital', 'cyber', 'code', 'data', 'network', 'futuristic',
      'security', 'matrix', 'binary', 'internet', 'computing', 'abstract', 'glow',
      'background', 'connection', 'virtual', 'software', 'programming', 'ai',
      'information', 'server', 'science', 'screen', 'modern', 'telecom', 'flow'
    ],
    category: 'Technology',
    pngData: {
      category1: 'BACKGROUND',
      category2: 'Technology',
      mainKeywords: ['cybersecurity code', 'binary network', 'digital data'],
      secondaryKeywords: [
        'high tech matrix', 'futuristic glow', 'big data stream', 'server room backdrop',
        'programming algorithm', 'internet security', 'virtual reality', 'information flow',
        'circuit board grid', 'dark background', 'fiber optic light', 'artificial intelligence'
      ],
      promptKeywords: 'Cybersecurity digital matrix with glowing cyan binary numbers and data streams on dark server background.',
      aiPlatformName: 'Ideogram',
      aiPlatformUrl: 'https://ideogram.ai',
      uploadId: '38491024',
    },
  },
  {
    id: 'demo-3',
    filename: 'minimal_workspace_laptop_overhead.jpg',
    previewUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&auto=format&fit=crop&q=80',
    fileSize: 1980000,
    fileType: 'image/jpeg',
    dimensions: { width: 3840, height: 2160 },
    status: 'ready',
    source: 'sample',
    title: 'Top view minimalist creative workspace with laptop notebook and cup of tea',
    description: 'Flat lay top view of a clean modern designer desk arrangement with laptop notebook pen and organic morning tea.',
    keywords: [
      'workspace', 'laptop', 'flatlay', 'desk', 'minimal', 'overhead', 'top view',
      'notebook', 'office', 'creative', 'work', 'freelance', 'computer', 'coffee',
      'business', 'lifestyle', 'stationery', 'modern', 'clean', 'simple', 'table',
      'remote', 'study', 'designer', 'planning', 'morning', 'aesthetic'
    ],
    category: 'Business & Office',
    pngData: {
      category1: 'BACKGROUND',
      category2: 'Business',
      mainKeywords: ['laptop desk', 'minimalist workspace', 'overhead flatlay'],
      secondaryKeywords: [
        'designer office', 'notebook stationery', 'freelance workstation', 'tea mug morning',
        'clean wood table', 'modern computer', 'business planning', 'creative setup',
        'remote work desk', 'aesthetic flat lay', 'copyspace background', 'productivity space'
      ],
      promptKeywords: 'Minimalist creative workspace flat lay with modern laptop, journal notebook, and tea on light desk.',
      aiPlatformName: 'Leonardo AI',
      aiPlatformUrl: 'https://leonardo.ai',
      uploadId: '51920482',
    },
  },
];
