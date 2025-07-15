// Define the Brand interface
export interface Brand {
  id: number;
  name: string;
  slug: string;
  logo: string;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  user_id: number;
  created_at: string;
  updated_at: string;
}

// Define the Category interface
export interface Category {
  id: number;
  user_id: number;
  name: string;
  slug: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  image: string;
  created_at: string;
  updated_at: string;
}

// Define the Variation interface
export interface Variation {
  id: number;
  product_id: number;
  attribute_id: number;
  attribute_value_id: number;
  name: string;
  sku: string;
  description: string;
  sale_price: string;
  stock_status: string;
  gallery_images: string[];
  created_at: string;
  updated_at: string;
  attribute: {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
  };
  value: {
    id: number;
    attribute_id: number;
    name: string;
    created_at: string;
    updated_at: string;
  };
}

// Define the Product interface
export interface Product {
  id: number;
  name: string;
  user_id: number;
  brand_id: number;
  category_id: number;
  slug: string;
  description: string;
  short_description: string;
  sku: string;
  price: number;
  sale_price: string;
  currency: string;
  quantity: number | null;
  stock_status: string;
  main_image: string | null;
  gallery_images: string[];
  video_url: string | null;
  weight: string | null;
  dimensions: string | null;
  tags: string | null;
  features: string | null;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  meta_canonical: string | null;
  cost_price: string | null;
  shipping_class: string | null;
  is_featured: number;
  status: string;
  average_rating: number | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  brand: Brand;
  category: Category;
  variations: Variation[];
}

// Define the API response interface
export interface ProductResponse {
  status: string;
  message: string;
  data: Product[];
}
export interface SingleProductRes {
    status: string;
  message: string;
  data: Product;
}

