import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { ShoppingBag, Zap, Search } from 'lucide-react';
import { motion } from 'framer-motion';
export default function Navbar({ onCartOpen }) {
  const { cart } = useContext(CartContext);
  const total = cart.reduce((s, i) => s + i.quantity, 0);
  return (
    <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-xl"><Zap className="text-white w-6 h-6 fill-white" /></div>
          <span className="text-2xl font-black tracking-tighter text-slate-900">Velo<span className="text-blue-600">Cart</span></span>
        </div>
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
            <input type="text" placeholder="Search products, brands..." className="w-full bg-slate-100 border-none rounded-2xl py-2.5 pl-11 pr-4 focus:ring-2 focus:ring-blue-500/20 transition-all" />
          </div>
        </div>
        <button onClick={onCartOpen} className="relative p-3 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-all group">
          <ShoppingBag className="w-6 h-6 text-slate-700 group-hover:scale-110 transition-transform" />
          {total > 0 && (
            <motion.span initial={{scale:0}} animate={{scale:1}} className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold w-6 h-6 rounded-full border-4 border-white flex items-center justify-center">
              {total}
            </motion.span>
          )}
        </button>
      </div>
    </nav>
  );
}
