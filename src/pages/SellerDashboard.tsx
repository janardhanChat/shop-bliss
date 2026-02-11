import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAuth } from '@/context/AuthContext';
import { useProducts } from '@/context/ProductContext';
import { formatPrice } from '@/data/products';
import { Plus, Package, Edit, Trash2, Store, DollarSign, Eye } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const PRODUCT_CATEGORIES = ['Bags', 'Kitchen', 'Home', 'Office', 'Accessories'];

interface ProductForm {
  name: string;
  description: string;
  price: string;
  originalPrice: string;
  category: string;
  imageUrl: string;
  imageUrl2: string;
  inStock: boolean;
}

const emptyForm: ProductForm = {
  name: '',
  description: '',
  price: '',
  originalPrice: '',
  category: '',
  imageUrl: '',
  imageUrl2: '',
  inStock: true,
};

export default function SellerDashboard() {
  const { user, isLoading } = useAuth();
  const { getProductsBySeller, addProduct, updateProduct, deleteProduct } = useProducts();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user || user.role !== 'seller') {
    return <Navigate to="/seller/signup" replace />;
  }

  const myProducts = getProductsBySeller(user.id);

  const totalRevenue = myProducts.reduce((sum, p) => sum + p.price, 0);

  const handleOpenAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (productId: string) => {
    const product = myProducts.find(p => p.id === productId);
    if (!product) return;
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      originalPrice: product.originalPrice ? String(product.originalPrice) : '',
      category: product.category,
      imageUrl: product.images[0] || '',
      imageUrl2: product.images[1] || '',
      inStock: product.inStock,
    });
    setEditingId(productId);
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.category) {
      toast({ title: 'Missing fields', description: 'Please fill in name, price, and category.', variant: 'destructive' });
      return;
    }

    const images = [form.imageUrl, form.imageUrl2].filter(Boolean);
    if (images.length === 0) {
      images.push('https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80');
    }

    const productData = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : undefined,
      category: form.category,
      images,
      inStock: form.inStock,
    };

    if (editingId) {
      updateProduct(editingId, productData);
      toast({ title: 'Product updated', description: `${form.name} has been updated.` });
    } else {
      addProduct({ ...productData, sellerId: user.id });
      toast({ title: 'Product added', description: `${form.name} has been listed.` });
    }

    setDialogOpen(false);
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleDelete = (id: string, name: string) => {
    deleteProduct(id);
    toast({ title: 'Product deleted', description: `${name} has been removed.` });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-12">
        <div className="container-wide">
          {/* Welcome */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl font-medium text-foreground mb-1">
                Seller Dashboard
              </h1>
              <p className="text-muted-foreground">
                Welcome, {user.name}
              </p>
            </div>
            <Button onClick={handleOpenAdd} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-semibold">{myProducts.length}</p>
                  <p className="text-sm text-muted-foreground">Listed Products</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-semibold">{formatPrice(totalRevenue)}</p>
                  <p className="text-sm text-muted-foreground">Total Listing Value</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Store className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-semibold">{myProducts.filter(p => p.inStock).length}</p>
                  <p className="text-sm text-muted-foreground">In Stock</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products List */}
          <Card>
            <CardHeader>
              <CardTitle>My Products</CardTitle>
              <CardDescription>Manage your listed products</CardDescription>
            </CardHeader>
            <CardContent>
              {myProducts.length > 0 ? (
                <div className="space-y-4">
                  {myProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-4 p-4 border border-border rounded-lg"
                    >
                      <div className="h-16 w-16 rounded-md bg-secondary overflow-hidden flex-shrink-0">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.category}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-medium text-sm">{formatPrice(product.price)}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            product.inStock
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                        >
                          <Link to={`/product/${product.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEdit(product.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(product.id, product.name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">No products listed yet</p>
                  <Button onClick={handleOpenAdd}>Add Your First Product</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Add/Edit Product Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            <DialogDescription>
              {editingId ? 'Update your product details.' : 'Fill in the details to list a new product.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="product-name">Product Name *</Label>
              <Input
                id="product-name"
                placeholder="e.g. Handcrafted Leather Wallet"
                value={form.name}
                onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="product-desc">Description</Label>
              <Textarea
                id="product-desc"
                placeholder="Describe your product..."
                value={form.description}
                onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="product-price">Price ($) *</Label>
                <Input
                  id="product-price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="49.99"
                  value={form.price}
                  onChange={(e) => setForm(f => ({ ...f, price: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-original-price">Original Price ($)</Label>
                <Input
                  id="product-original-price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Optional"
                  value={form.originalPrice}
                  onChange={(e) => setForm(f => ({ ...f, originalPrice: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="product-category">Category *</Label>
              <Select
                value={form.category}
                onValueChange={(val) => setForm(f => ({ ...f, category: val }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_CATEGORIES.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="product-img1">Image URL 1</Label>
              <Input
                id="product-img1"
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={form.imageUrl}
                onChange={(e) => setForm(f => ({ ...f, imageUrl: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="product-img2">Image URL 2 (optional)</Label>
              <Input
                id="product-img2"
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={form.imageUrl2}
                onChange={(e) => setForm(f => ({ ...f, imageUrl2: e.target.value }))}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="product-stock"
                checked={form.inStock}
                onChange={(e) => setForm(f => ({ ...f, inStock: e.target.checked }))}
                className="rounded border-border"
              />
              <Label htmlFor="product-stock" className="cursor-pointer">In Stock</Label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingId ? 'Update Product' : 'Add Product'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
