import { Product } from "@/types/product_list"; 


export const mapProductsForSchema = (products: Product[]) => {
  return products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: `${p.category?.slug}/${p.slug}`, 
    image: p.main_image || "/assets/images/default-product.jpg",
    price: p.sale_price || p.price?.toString() || "0",
    brand: p.brand?.name || "Best Fashion",
    description: p.meta_description || p.short_description || p.description,
  }));
};
