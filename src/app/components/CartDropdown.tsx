import { useState } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, X, ChevronRight } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export function CartDropdown({
  onClose,
  onNavigate,
}: {
  onClose: () => void;
  onNavigate?: (route: string) => void;
}) {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      name: 'Tomates Bio',
      image: '🍅',
      price: 4.5,
      quantity: 2,
    },
    {
      id: '2',
      name: 'Pommes Golden',
      image: '🍎',
      price: 3.8,
      quantity: 3,
    },
    {
      id: '3',
      name: 'Fromage de Chèvre',
      image: '🧀',
      price: 6.5,
      quantity: 1,
    },
  ]);

  const recommendedProducts = [
    { id: '4', name: 'Laitue Batavia', image: '🥬', price: 2.2 },
    { id: '5', name: 'Œufs Fermiers', image: '🥚', price: 4.2 },
  ];

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(
      cartItems
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 50 ? 0 : 4.99;
  const savings = 15.0;
  const total = subtotal + shipping - savings;

  return (
    <div className="absolute right-0 top-full mt-2 w-96 bg-card border rounded-lg shadow-2xl z-50">
      {/* Header */}
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">Mon panier</h3>
          <span className="px-2 py-0.5 bg-[#0B7A4B] text-white text-xs rounded-full">
            {cartItems.length}
          </span>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-muted rounded transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Cart Items */}
      <div className="max-h-[400px] overflow-y-auto">
        {cartItems.length === 0 ? (
          <div className="p-12 text-center">
            <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-semibold mb-2">Votre panier est vide</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Ajoutez des produits pour commencer vos achats
            </p>
            <button
              onClick={() => {
                onNavigate?.('/market');
                onClose();
              }}
              className="px-4 py-2 bg-[#0B7A4B] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors"
            >
              Explorer le marketplace
            </button>
          </div>
        ) : (
          <>
            <div className="p-4 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-3">
                  {/* Image */}
                  <div className="h-16 w-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-lg flex items-center justify-center text-3xl flex-shrink-0">
                    {item.image}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{item.name}</h4>
                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 border rounded">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 hover:bg-muted transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 hover:bg-muted transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-sm font-semibold text-[#0B7A4B]">
                        {(item.price * item.quantity).toFixed(2)}€
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{item.price}€ / unité</div>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-red-600 transition-colors self-start"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="px-4 py-3 border-t space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Sous-total</span>
                <span className="font-medium">{subtotal.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Livraison</span>
                <span className={shipping === 0 ? 'text-green-600 font-medium' : 'font-medium'}>
                  {shipping === 0 ? 'Gratuite' : `${shipping.toFixed(2)}€`}
                </span>
              </div>
              {savings > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Économies</span>
                  <span className="text-green-600 font-medium">-{savings.toFixed(2)}€</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t">
                <span className="font-bold">TOTAL</span>
                <span className="font-bold text-lg text-[#0B7A4B]">{total.toFixed(2)}€</span>
              </div>
            </div>

            {/* Recommended Products */}
            <div className="px-4 py-3 border-t">
              <h4 className="text-sm font-medium mb-3">À ajouter à votre commande</h4>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {recommendedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex-shrink-0 w-32 border rounded-lg p-3 hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="text-4xl mb-2 text-center">{product.image}</div>
                    <div className="text-xs font-medium truncate">{product.name}</div>
                    <div className="text-sm font-bold text-[#0B7A4B] mt-1">{product.price}€</div>
                    <button className="w-full mt-2 px-2 py-1 bg-muted hover:bg-muted/80 rounded text-xs transition-colors">
                      Ajouter
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 border-t space-y-2">
              <button
                onClick={() => {
                  onNavigate?.('/cart');
                  onClose();
                }}
                className="w-full px-4 py-2 border rounded-lg hover:bg-muted transition-colors font-medium flex items-center justify-center gap-2"
              >
                Voir le panier complet
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  onNavigate?.('/checkout');
                  onClose();
                }}
                className="w-full px-4 py-3 bg-[#0B7A4B] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors font-semibold"
              >
                Passer la commande
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
