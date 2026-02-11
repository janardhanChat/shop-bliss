import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, products as defaultProducts } from '@/data/products';

interface ProductContextType {
  allProducts: Product[];
  addProduct: (product: Omit<Product, 'id'> & { sellerId: string }) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProductById: (id: string) => Product | undefined;
  getProductsByCategory: (category: string) => Product[];
  getProductsBySeller: (sellerId: string) => Product[];
  categories: string[];
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const SELLER_PRODUCTS_KEY = 'minimal_seller_products';

export function ProductProvider({ children }: { children: ReactNode }) {
  const [sellerProducts, setSellerProducts] = useState<(Product & { sellerId?: string })[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(SELLER_PRODUCTS_KEY);
    if (saved) {
      setSellerProducts(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(SELLER_PRODUCTS_KEY, JSON.stringify(sellerProducts));
  }, [sellerProducts]);

  const allProducts = [...defaultProducts, ...sellerProducts];

  const addProduct = (product: Omit<Product, 'id'> & { sellerId: string }): Product => {
    const newProduct = {
      ...product,
      id: `seller-${crypto.randomUUID()}`,
    };
    setSellerProducts(prev => [...prev, newProduct]);
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setSellerProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setSellerProducts(prev => prev.filter(p => p.id !== id));
  };

  const getProductById = (id: string) => allProducts.find(p => p.id === id);

  const getProductsByCategory = (category: string) =>
    category === 'All' ? allProducts : allProducts.filter(p => p.category === category);

  const getProductsBySeller = (sellerId: string) =>
    sellerProducts.filter(p => p.sellerId === sellerId);

  const categorySet = new Set(allProducts.map(p => p.category));
  const categories = ['All', ...Array.from(categorySet)];

  return (
    <ProductContext.Provider
      value={{
        allProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductById,
        getProductsByCategory,
        getProductsBySeller,
        categories,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}
