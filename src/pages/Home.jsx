import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, Loader2, Search } from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Kuvuta data kutoka Backend ( API ) ikisoma Category na Search Term
  useEffect(() => {
    setLoading(true);
    // Tunatengeneza URL inayosafiri kwenda Backend Port 5001
    let url = `http://localhost:5001/api/products`;
    if (searchTerm.trim()) {
      url += `?search=${encodeURIComponent(searchTerm)}`;
    }

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, [searchTerm]); // Kila mteja anapochapa, API inapigwa live

  // Kuchuja kwa kutumia Category za pale juu
  const filtered = products.filter(p => category === 'All' || p.category === category);

  return (
    <div className="min-h-screen pb-20 bg-gray-50 text-gray-800">
      <header className="max-w-7xl mx-auto px-4 pt-12 pb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-blue-600 rounded-[3rem] p-10 md:p-20 text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <span className="bg-white/20 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-8 inline-block">Live Inventory System</span>
            <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tighter mb-6">REAL-TIME COMMERCE./THE DIGITAL HUB.PREMIUM PRODUCTS.</h1>
            <p className="text-blue-100 text-lg max-w-lg mb-8 leading-relaxed">Connected to PostgreSQL. Serving local assets at lightning speed./Order your favorite items today. Fast delivery across Tanzania directly to your doorstep.</p>
          </div>
        </motion.div>
      </header>

      <section className="max-w-7xl mx-auto px-4">
        {/* UTANGULIZI WA SEARCH BAR MPYA NDANI YA HOME */}
        <div className="w-full max-w-xl mx-auto mb-12 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
            <Search size={20} />
          </div>
          <input
            type="text"
            placeholder="Search products, brands (e.g. hoodie, backpack)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm font-medium"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 text-xs font-bold">✕</button>
          )}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg"><LayoutGrid size={24} /></div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Active Catalog</h2>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {['All', 'Fashion', 'Tech', 'Utilities'].map(c => (
              <button key={c} onClick={() => setCategory(c)} className={`px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${category === c ? 'bg-blue-600 text-white shadow-xl' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}>{c}</button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-blue-600">
            <Loader2 className="animate-spin" size={48} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed text-gray-400 font-bold">
            Samahani! Hakuna bidhaa inayolingana na utafutaji wako.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode='popLayout'>
              {filtered.map(p => <ProductCard key={p.id} product={p} />)}
            </AnimatePresence>
          </div>
        )}
      </section>
    </div>
  );
}
