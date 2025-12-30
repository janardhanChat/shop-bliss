export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  inStock: boolean;
  variants?: {
    name: string;
    options: string[];
  }[];
}

export const products: Product[] = [
  {
    id: "1",
    name: "Minimal Canvas Tote",
    description: "A beautifully crafted canvas tote bag with reinforced handles. Perfect for everyday use, groceries, or as a work bag. Made from 100% organic cotton canvas.",
    price: 48,
    images: [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80"
    ],
    category: "Bags",
    inStock: true,
    variants: [
      { name: "Color", options: ["Natural", "Black", "Navy"] }
    ]
  },
  {
    id: "2",
    name: "Ceramic Pour-Over Set",
    description: "Hand-thrown ceramic pour-over coffee set. Includes dripper and carafe. Each piece is unique with subtle variations in glaze.",
    price: 85,
    originalPrice: 110,
    images: [
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80"
    ],
    category: "Kitchen",
    inStock: true
  },
  {
    id: "3",
    name: "Linen Throw Blanket",
    description: "Soft, stonewashed linen throw blanket. Perfect weight for year-round comfort. Pre-washed for extra softness.",
    price: 120,
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
      "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800&q=80"
    ],
    category: "Home",
    inStock: true,
    variants: [
      { name: "Color", options: ["Oatmeal", "Charcoal", "Sage"] }
    ]
  },
  {
    id: "4",
    name: "Oak Desk Organizer",
    description: "Solid oak desk organizer with multiple compartments. Natural oil finish highlights the wood grain. Handcrafted in small batches.",
    price: 65,
    images: [
      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&q=80",
      "https://images.unsplash.com/photo-1616627547584-bf28cee262db?w=800&q=80"
    ],
    category: "Office",
    inStock: true
  },
  {
    id: "5",
    name: "Wool Blend Scarf",
    description: "Luxuriously soft wool blend scarf. Generously sized for multiple styling options. Ethically sourced materials.",
    price: 75,
    originalPrice: 95,
    images: [
      "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=800&q=80",
      "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&q=80"
    ],
    category: "Accessories",
    inStock: true,
    variants: [
      { name: "Color", options: ["Camel", "Grey", "Burgundy"] }
    ]
  },
  {
    id: "6",
    name: "Stoneware Mug Set",
    description: "Set of four handcrafted stoneware mugs. Each mug holds 12oz. Microwave and dishwasher safe.",
    price: 58,
    images: [
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80",
      "https://images.unsplash.com/photo-1481349518771-20055b2a7b24?w=800&q=80"
    ],
    category: "Kitchen",
    inStock: true
  },
  {
    id: "7",
    name: "Leather Passport Holder",
    description: "Full-grain leather passport holder with card slots. Develops beautiful patina over time. Fits standard passports.",
    price: 42,
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
      "https://images.unsplash.com/photo-1473188588951-666fce8e7c68?w=800&q=80"
    ],
    category: "Accessories",
    inStock: false
  },
  {
    id: "8",
    name: "Brass Table Lamp",
    description: "Minimalist brass table lamp with linen shade. Warm, ambient lighting. Dimmer compatible.",
    price: 145,
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80",
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80"
    ],
    category: "Home",
    inStock: true
  }
];

export const categories = ["All", "Bags", "Kitchen", "Home", "Office", "Accessories"];

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  if (category === "All") return products;
  return products.filter(p => p.category === category);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(price);
}
