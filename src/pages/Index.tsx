import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/product/ProductCard';
import { useProducts } from '@/context/ProductContext';

const Index = () => {
  const { allProducts } = useProducts();
  const featuredProducts = allProducts.slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-secondary/50 overflow-hidden">
          <div className="container-wide py-20 md:py-32">
            <div className="max-w-2xl">
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-tight">
                Thoughtfully Designed Goods
              </h1>
              <p className="mt-6 text-lg text-muted-foreground max-w-lg">
                Quality craftsmanship meets timeless aesthetics. Curated essentials for modern living.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button asChild size="lg">
                  <Link to="/products">
                    Shop Collection
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          
          <div className="absolute right-0 top-0 w-1/2 h-full hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-secondary/50" />
            <img
              src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80"
              alt="Minimal interior"
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        {/* Featured Products */}
        <section className="container-wide py-16 md:py-24">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-medium">Featured</h2>
              <p className="mt-2 text-muted-foreground">Handpicked favorites from our collection</p>
            </div>
            <Link 
              to="/products" 
              className="text-sm font-medium hover:underline underline-offset-4 hidden sm:block"
            >
              View All
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="mt-10 text-center sm:hidden">
            <Button variant="outline" asChild>
              <Link to="/products">View All Products</Link>
            </Button>
          </div>
        </section>

        {/* Categories */}
        <section className="container-wide py-16 md:py-24 border-t border-border">
          <h2 className="font-display text-2xl md:text-3xl font-medium mb-10 text-center">
            Shop by Category
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Home', image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80' },
              { name: 'Kitchen', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80' },
              { name: 'Accessories', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80' },
            ].map((category) => (
              <Link
                key={category.name}
                to={`/products?category=${category.name}`}
                className="group relative aspect-[4/3] overflow-hidden bg-secondary"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-foreground/20 group-hover:bg-foreground/30 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-display text-xl font-medium text-background">
                    {category.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Value Props */}
        <section className="bg-secondary/30 py-16 md:py-20">
          <div className="container-wide">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <h3 className="font-medium mb-2">Free Shipping</h3>
                <p className="text-sm text-muted-foreground">On orders over $100</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Easy Returns</h3>
                <p className="text-sm text-muted-foreground">30-day return policy</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Secure Checkout</h3>
                <p className="text-sm text-muted-foreground">Encrypted transactions</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
