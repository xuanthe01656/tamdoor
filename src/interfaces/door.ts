export interface Door {
    id: string;
    name: string;
    slug: string;
    category: string;
    type: 'door' | 'accessory';
    price: number;
    image: string;
    description: string;
    features?: string[];
    createdAt: number;
  }