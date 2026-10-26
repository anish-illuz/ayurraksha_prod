import productsData from '@/data/products.json';
import { Product } from '@/types/product';

const allProducts: Product[] = productsData as Product[];

export function getAllProducts(): Product[] {
  return allProducts;
}

export function getProductBySlug(slug: string): Product | undefined {
  return allProducts.find((p) => p.slug === slug);
}

export function getBestsellers(limit = 8): Product[] {
  const bestsellers = allProducts.filter((p) => p.isBestseller);
  if (bestsellers.length >= limit) {
    return bestsellers.slice(0, limit);
  }
  // Fill with highest rated if needed
  const others = allProducts.filter((p) => !p.isBestseller);
  return [...bestsellers, ...others].slice(0, limit);
}

export function getProductsByConcern(concernSlug: string): Product[] {
  const slugLower = concernSlug.toLowerCase().replace(/-/g, ' ');
  return allProducts.filter((p) =>
    p.healthConcerns.some((c) => c.toLowerCase().includes(slugLower))
  );
}

export function getProductsByCategory(categorySlug: string): Product[] {
  if (categorySlug === 'all') return allProducts;
  return allProducts.filter((p) =>
    p.categorySlugs.some((s) => s.toLowerCase() === categorySlug.toLowerCase())
  );
}

export function getRelatedProducts(currentProduct: Product, limit = 4): Product[] {
  return allProducts
    .filter((p) => p.id !== currentProduct.id)
    .filter((p) =>
      p.healthConcerns.some((c) => currentProduct.healthConcerns.includes(c)) ||
      p.categories.some((cat) => currentProduct.categories.includes(cat))
    )
    .slice(0, limit);
}

export function searchProducts(query: string): Product[] {
  if (!query || query.trim() === '') return [];
  const q = query.toLowerCase().trim();
  return allProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.cleanDescription.toLowerCase().includes(q) ||
      p.healthConcerns.some((c) => c.toLowerCase().includes(q)) ||
      p.categories.some((cat) => cat.toLowerCase().includes(q))
  );
}
