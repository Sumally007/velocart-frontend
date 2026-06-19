import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

function App() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');

  const [view, setView] = useState('home');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = searchTerm.trim()
          ? `${API_BASE_URL}/api/products?search=${encodeURIComponent(searchTerm)}`
          : `${API_BASE_URL}/api/products`;
        const res = await fetch(url);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const totalPrice = cart.reduce((sum, item) => sum + Number(item.price), 0);

  const handlePayment = async () => {
    if (!phoneNumber) return alert("Please enter your phone number!");
    setPaymentStatus("sending");
    try {
      setTimeout(() => {
        setPaymentStatus("sent");
        setTimeout(() => {
          setPaymentStatus("success");
        }, 3000);
      }, 1500);
    } catch (err) {
      setPaymentStatus("error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    alert('Logged out successfully!');
  };

  if (view === 'login') {
    return <Login onNavigate={setView} onLoginSuccess={(userData) => { setUser(userData); setView('home'); }} API_BASE_URL={API_BASE_URL} />;
  }

  if (view === 'register') {
    return <Register onNavigate={setView} API_BASE_URL={API_BASE_URL} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-12">
      {/* NAVBAR */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span onClick={() => setView('home')} className="text-xl font-black tracking-tight cursor-pointer text-gray-900">
              Velo<span className="text-blue-600">Cart</span>
            </span>
            <input 
              type="text" 
              placeholder="Search marketplace..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="hidden sm:block w-64 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 font-medium"
            />
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-gray-700">Hi, {user.name}</span>
                <button onClick={handleLogout} className="text-xs font-bold text-red-600 hover:text-red-700">Logout</button>
              </div>
            ) : (
              <button onClick={() => setView('login')} className="text-sm font-bold text-gray-700 hover:text-blue-600">Login / Sign Up</button>
            )}
            <button 
              onClick={() => setIsCartOpen(true)} 
              className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all"
            >
              Bag <span>({cart.length})</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        {/* BRAND BANNER */}
        <div className="bg-[#0f172a] rounded-[2rem] p-12 md:p-20 mb-12 text-left shadow-2xl relative overflow-hidden border border-slate-800">
          <div className="relative z-10">
            <h1 className="text-5xl md:text-8xl font-extrabold text-white mb-6 tracking-tighter">
              VeloCart <span className="text-cyan-400">Tanzania</span>
            </h1>
            <p className="text-slate-400 text-sm md:text-xl font-medium tracking-[0.1em] md:tracking-[0.25em] uppercase">
              Lightning-Fast • Locally Integrated • Mobile-First E-Commerce
            </p>
          </div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full"></div>
        </div>

        {/* ACTIVE CATALOG */}
        <h2 className="text-2xl font-black tracking-tight mb-8">📦 Active Catalog</h2>
        {products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed text-gray-400 font-medium">
            Sorry, no products match "{searchTerm}"
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-xs hover:shadow-md transition-all flex flex-col group">
                <div className="relative pt-[100%] bg-gray-50 overflow-hidden">
                  <img src={item.image || item.image_url} alt={item.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-300" />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="font-bold text-gray-900 mb-1 tracking-tight group-hover:text-blue-600 transition-colors">{item.name}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-4 flex-grow">{item.description}</p>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                    <span className="text-base font-black text-gray-900">TZS {Number(item.price).toLocaleString()}</span>
                    <button onClick={() => addToCart(item)} className="bg-blue-600 hover:bg-blue-700 text-white w-10 h-10 rounded-xl font-bold flex items-center justify-center transition-all shadow-xs">+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SHOPPING CART DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white h-full p-6 flex flex-col shadow-2xl">
            <div className="flex justify-between items-center pb-4 border-b">
              <h3 className="text-lg font-black tracking-tight">Shopping Bag</h3>
              <button onClick={() => { setIsCartOpen(false); if (paymentStatus === 'success') { setCart([]); setPaymentStatus(''); } }} className="text-xl text-gray-400 hover:text-gray-600">✕</button>
            </div>

            {paymentStatus === 'sent' ? (
              <div className="flex-grow flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl font-bold mb-4">✓</div>
                <h4 className="text-xl font-black text-gray-900 mb-1">Push Request Sent!</h4>
                <p className="text-xs text-gray-500">Check your phone to authorize TZS {totalPrice.toLocaleString()} for VeloCart TZ.</p>
              </div>
            ) : paymentStatus === 'success' ? (
              <div className="flex-grow flex flex-col justify-between p-4">
                <div className="space-y-6 mt-8">
                  <div className="text-center">
                    <div className="inline-block p-3 bg-blue-100 text-blue-600 rounded-full text-2xl mb-2">💳</div>
                    <h4 className="text-xl font-black text-gray-900">Payment Successful!</h4>
                    <p className="text-xs text-gray-400">Thank you for shopping with VeloCart</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Customer:</span>
                      <span className="font-bold text-gray-800">{user ? user.name : 'Guest Customer'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Phone Number:</span>
                      <span className="font-mono font-bold text-gray-800">{phoneNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status:</span>
                      <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Paid</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between text-base font-black">
                      <span>Amount Paid:</span>
                      <span>TZS {totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => { setCart([]); setPaymentStatus(''); setIsCartOpen(false); }} className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3 rounded-xl transition-all text-sm">Keep Shopping</button>
              </div>
            ) : (
              <>
                <div className="flex-grow overflow-y-auto py-4 space-y-4">
                  {cart.length === 0 ? <p className="text-center py-10 text-gray-400 text-sm">Your bag is empty.</p> : cart.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 border-b pb-4">
                      <img src={item.image || item.image_url} alt={item.name} className="w-16 h-16 object-cover rounded-xl" />
                      <div className="flex-grow">
                        <h4 className="font-bold text-sm text-gray-900">{item.name}</h4>
                        <span className="text-xs font-black text-blue-600">TZS {Number(item.price).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
                {cart.length > 0 && (
                  <div className="pt-4 border-t space-y-4">
                    <div className="flex justify-between font-black text-lg">
                      <span>Total:</span>
                      <span>TZS {totalPrice.toLocaleString()}</span>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Phone Number</label>
                      <input type="text" placeholder="07xxxxxxxx" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:border-blue-500 text-sm font-medium" />
                    </div>
                    <button onClick={handlePayment} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all text-sm">
                      {paymentStatus === 'sending' ? 'Sending Push...' : `Pay TZS ${totalPrice.toLocaleString()}`}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
