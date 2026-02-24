import './index.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SequenceSection from './components/SequenceSection';
import Shop from './components/Shop';
import About from './components/About';
import Footer from './components/Footer';
import Cart from './components/Cart';
import Toast from './components/Toast';
import JourneyRail from './components/JourneyRail';
import { useCart } from './hooks/useCart';
import { useToast } from './hooks/useToast';
import { useState } from 'react';
import Checkout from './components/Checkout';

export default function App() {
  const { cart, cartOpen, setCartOpen, addToCart, removeFromCart, changeQty, totalItems, subtotal, clearCart } = useCart();
  const { toasts, showToast } = useToast();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const handleAddToCart = (product) => {
    addToCart(product);
    showToast('🛒', `${product.name} added to cart`);
  };

  const handleCheckout = () => {
    setCheckoutOpen(true);
    setCartOpen(false);
  };

  return (
    <>
      <JourneyRail />
      <Navbar totalItems={totalItems} onCartOpen={() => setCartOpen(true)} />

      <main>
        <Hero />

        {/* Section divider */}
        <SequenceSection onShopClick={() => { }} />

        <div className="section-divider">
          <div className="divider-line" />
          <div className="divider-text">The Collection</div>
          <div className="divider-line" />
        </div>

        <Shop onAddToCart={handleAddToCart} />
        <About />
      </main>

      <Footer />

      <Cart
        cart={cart}
        cartOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onChangeQty={changeQty}
        onRemove={removeFromCart}
        subtotal={subtotal}
        onCheckout={handleCheckout}
      />

      <Toast toasts={toasts} />

      {checkoutOpen && (
        <Checkout
          cart={cart}
          subtotal={subtotal}
          onClose={() => setCheckoutOpen(false)}
          onClearCart={clearCart}
        />
      )}
    </>
  );
}
