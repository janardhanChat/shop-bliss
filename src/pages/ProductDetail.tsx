import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Minus, Plus } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/data/products';
import { ProductCard } from '@/components/product/ProductCard';
import { useCart } from '@/context/CartContext';
import { useProducts } from '@/context/ProductContext';
import { toast } from '@/hooks/use-toast';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { getProductById, allProducts } = useProducts();
  const product = getProductById(id || '');
  
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [selectedImage, setSelectedImage] = useState(0);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-2xl font-medium mb-4">Product Not Found</h1>
            <Button asChild>
              <Link to="/products">Back to Products</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!product.inStock) return;
    addItem(product, quantity, selectedVariants);
    toast({
      title: "Added to cart",
      description: `${quantity}x ${product.name}`,
    });
  };

  const relatedProducts = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container-wide py-8 md:py-12">
          <button 
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            <div className="space-y-4">
              <div className="aspect-square bg-secondary overflow-hidden">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-3">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-20 h-20 bg-secondary overflow-hidden border-2 transition-colors ${
                        selectedImage === index ? 'border-foreground' : 'border-transparent'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
                <h1 className="font-display text-3xl md:text-4xl font-medium">{product.name}</h1>
                <div className="flex items-center gap-3 mt-4">
                  <span className="text-2xl font-medium">{formatPrice(product.price)}</span>
                  {product.originalPrice && (
                    <span className="text-lg text-muted-foreground line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed mb-8">
                {product.description}
              </p>

              {product.variants && product.variants.length > 0 && (
                <div className="space-y-6 mb-8">
                  {product.variants.map((variant) => (
                    <div key={variant.name}>
                      <label className="text-sm font-medium mb-3 block">
                        {variant.name}: {selectedVariants[variant.name] || 'Select'}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {variant.options.map((option) => (
                          <button
                            key={option}
                            onClick={() => setSelectedVariants(prev => ({
                              ...prev,
                              [variant.name]: option
                            }))}
                            className={`px-4 py-2 text-sm border transition-colors ${
                              selectedVariants[variant.name] === option
                                ? 'border-foreground bg-foreground text-background'
                                : 'border-border hover:border-foreground'
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center border border-border">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="p-3 hover:bg-secondary transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="p-3 hover:bg-secondary transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                
                <Button 
                  size="lg" 
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                >
                  {product.inStock ? 'Add to Cart' : 'Sold Out'}
                </Button>
              </div>

              <div className="space-y-4 pt-8 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Availability</span>
                  <span className={product.inStock ? 'text-foreground' : 'text-muted-foreground'}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>Free over $100</span>
                </div>
              </div>
            </div>
          </div>

          {relatedProducts.length > 0 && (
            <section className="mt-20 pt-16 border-t border-border">
              <h2 className="font-display text-2xl font-medium mb-8">You May Also Like</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                {relatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
