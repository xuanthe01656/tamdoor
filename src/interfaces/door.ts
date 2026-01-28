export interface ProductSpecification {
  key: string;   // Ví dụ: "Kích thước phủ bì"
  value: string; // Ví dụ: "900 x 2200 mm"
}

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
  specifications?: ProductSpecification[]; 
  createdAt: number;
}