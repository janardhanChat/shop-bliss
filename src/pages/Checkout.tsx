import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Minus, Plus, X } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/data/products';
import { toast } from '@/hooks/use-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const shippingCost = totalPrice >= 100 ? 0 : 10;
  const orderTotal = totalPrice + shippingCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    clearCart();
    toast({
      title: "Order placed successfully!",
      description: "Thank you for your purchase. You'll receive a confirmation email shortly.",
    });
    navigate('/');
    setIsSubmitting(false);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-2xl font-medium mb-4">Your cart is empty</h1>
            <Button asChild>
              <Link to="/products">Continue Shopping</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container-wide py-8 md:py-12">
          {/* Breadcrumb */}
          <button 
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </button>

          <h1 className="font-display text-3xl md:text-4xl font-medium mb-10">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Contact */}
              <div>
                <h2 className="font-medium text-lg mb-4">Contact</h2>
                <Input 
                  type="email" 
                  placeholder="Email address" 
                  required 
                  className="w-full"
                />
              </div>

              {/* Shipping */}
              <div>
                <h2 className="font-medium text-lg mb-4">Shipping Address</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="First name" required />
                    <Input placeholder="Last name" required />
                  </div>
                  <Input placeholder="Address" required />
                  <Input placeholder="Apartment, suite, etc. (optional)" />
                  <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="City" required />
                    <Input placeholder="ZIP code" required />
                  </div>
                  <Input placeholder="Country" required />
                  <Input type="tel" placeholder="Phone (optional)" />
                </div>
              </div>

              {/* Payment Note */}
              <div className="p-4 bg-secondary/50 rounded">
                <p className="text-sm text-muted-foreground">
                  This is a demo store. No real payment will be processed.
                </p>
              </div>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : `Pay ${formatPrice(orderTotal)}`}
              </Button>
            </form>

            {/* Order Summary */}
            <div className="lg:pl-8 lg:border-l border-border">
              <h2 className="font-medium text-lg mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-8">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-4">
                    <div className="relative w-16 h-20 bg-secondary overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-foreground text-background text-xs flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium truncate">{item.product.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 hover:bg-secondary rounded transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-xs w-6 text-center">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 hover:bg-secondary rounded transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.product.id)}
                      className="p-1 hover:bg-secondary rounded transition-colors self-start"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}</span>
                </div>
                <div className="flex justify-between font-medium pt-3 border-t border-border">
                  <span>Total</span>
                  <span>{formatPrice(orderTotal)}</span>
                </div>
              </div>

              {totalPrice < 100 && (
                <p className="text-xs text-muted-foreground mt-4">
                  Add {formatPrice(100 - totalPrice)} more for free shipping!
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
