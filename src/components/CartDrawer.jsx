import { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Smartphone, CreditCard, Loader2, CheckCircle2 } from 'lucide-react';
export default function CartDrawer({ isOpen, onClose }) {
  const { cart, removeFromCart, cartTotal, clearCart } = useContext(CartContext);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const handlePay = (e) => {
    e.preventDefault();
    if (phone.length < 10) return alert("Enter valid phone number");
    setLoading(true);
    setTimeout(() => { setLoading(false); setSuccess(true); clearCart(); }, 3000);
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={onClose} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
          <motion.div initial={{x:'100%'}} animate={{x:0}} exit={{x:'100%'}} transition={{type:'spring', damping:25, stiffness:200}} className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Shopping Bag</h2>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X/></button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {success ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6"><CheckCircle2 size={40}/></div>
                  <h3 className="text-2xl font-black text-slate-900">Push Request Sent!</h3>
                  <p className="text-slate-500 mt-2">Check your phone to authorize TZS {cartTotal.toLocaleString()} for VeloCart TZ.</p>
                  <button onClick={() => {setSuccess(false); onClose();}} className="mt-8 font-bold text-blue-600 hover:underline">Keep Shopping</button>
                </div>
              ) : cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-20"><ShoppingBag size={80} strokeWidth={1}/><p className="mt-4 font-bold uppercase tracking-widest text-xs">Your bag is empty</p></div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex gap-4 group">
                    <img src={item.image} className="w-20 h-20 object-cover rounded-2xl bg-slate-100" />
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900 leading-tight">{item.name}</h4>
                      <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-tighter">Qty: {item.quantity}</p>
                      <p className="font-black text-blue-600 mt-2">TZS {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="opacity-0 group-hover:opacity-100 text-rose-500 p-2 h-fit hover:bg-rose-50 rounded-xl transition-all"><Trash2 size={18}/></button>
                  </div>
                ))
              )}
            </div>
            {!success && cart.length > 0 && (
              <div className="p-8 bg-slate-50 border-t border-slate-100 space-y-6">
                <div className="flex justify-between items-end"><span className="font-bold text-slate-400 uppercase text-xs tracking-widest">Grand Total</span><span className="text-3xl font-black text-slate-900 leading-none">TZS {cartTotal.toLocaleString()}</span></div>
                <form onSubmit={handlePay} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Mobile Money Number</label>
                    <div className="relative">
                      <Smartphone className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
                      <input type="tel" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="07XX XXX XXX" className="w-full bg-white border-2 border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 focus:border-blue-600 focus:outline-none transition-all font-bold" />
                    </div>
                  </div>
                  <button disabled={loading} type="submit" className="w-full bg-blue-600 py-4 rounded-2xl text-white font-black uppercase tracking-widest shadow-xl shadow-blue-500/30 flex items-center justify-center gap-3 hover:bg-blue-700 transition-all disabled:bg-slate-300">
                    {loading ? <Loader2 className="animate-spin" /> : <><CreditCard size={20}/> Pay with Mobile Money</>}
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
