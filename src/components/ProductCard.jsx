import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { motion } from 'framer-motion';
import { Plus, ShoppingCart } from 'lucide-react';
export default function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);
  return (
    <motion.div initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} className="group bg-white rounded-[2.5rem] p-4 border border-slate-100 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500">
      <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-slate-50">
        <img src={product.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-600">{product.category}</div>
      </div>
      <div className="mt-6 px-2">
        <h3 className="font-bold text-slate-900 text-lg leading-tight">{product.name}</h3>
        <p className="text-slate-400 text-xs mt-2 line-clamp-2 leading-relaxed font-medium">{product.description}</p>
        <div className="mt-6 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Price</p>
            <p className="text-xl font-black text-slate-900">TZS {product.price.toLocaleString()}</p>
          </div>
          <motion.button whileHover={{scale:1.1}} whileTap={{scale:0.9}} onClick={() => addToCart(product)} className="bg-blue-600 text-white p-4 rounded-2xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-colors">
            <Plus className="w-6 h-6" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
