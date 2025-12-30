import { Link } from 'react-router-dom';
import { Product, formatPrice } from '@/data/products';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link 
      to={`/product/${product.id}`} 
      className="group block animate-fade-in"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-secondary mb-4">
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
            <span className="text-sm font-medium text-muted-foreground">Sold Out</span>
          </div>
        )}
        {product.originalPrice && product.inStock && (
          <span className="absolute top-3 left-3 bg-foreground text-background text-xs font-medium px-2 py-1">
            Sale
          </span>
        )}
      </div>
      
      <div className="space-y-1">
        <h3 className="text-sm font-medium group-hover:underline underline-offset-4 transition-all">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {product.category}
        </p>
      </div>
    </Link>
  );
}
