import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { storeContext } from '../Context/CartContext.jsx';

export default function Profile() {
  // 🔄 **استخدام cart من context**
  const { cart, removeFromCart, updateQuantity, clearCart } = useContext(storeContext);
  
  const [showAddress, setShowAddress] = useState(false);
  const [productsDetails, setProductsDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  // جلب تفاصيل المنتجات من الـ API
  useEffect(() => {
    const fetchProductsDetails = async () => {
      setLoading(true);
      try {
        // 🔄 **استخدام cart.products من context**
        if (cart.products.length === 0) {
          setProductsDetails([]);
          setLoading(false);
          return;
        }

        const promises = cart.products.map(item => 
          axios.get(`https://fakestoreapi.com/products/${item.productId}`)
        );
        const responses = await Promise.all(promises);
        const productsWithDetails = responses.map((res, index) => ({
          ...res.data,
          quantity: cart.products[index].quantity
        }));
        setProductsDetails(productsWithDetails);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsDetails();
  }, [cart.products]);

  //  removeFromCart من context**
  const handleDelete = (productId) => {
    removeFromCart(productId);
  };

  //  updateQuantity من context**
  const handleUpdateQuantity = (productId, newQuantity) => {
    updateQuantity(productId, parseInt(newQuantity) || 1);
  };

  //  clearCart من context**
  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  };

  // الحساب الكلي  
  const calculateTotal = () => {
    return productsDetails.reduce((total, product) => {
      return total + (product.price * product.quantity);
    }, 0).toFixed(2);
  };

  //  الضريبة (2%)
  const calculateTax = () => {
    return (parseFloat(calculateTotal()) * 0.02).toFixed(2);
  };

  // الحساب النهائي مع الضريبة
  const calculateFinalTotal = () => {
    const total = parseFloat(calculateTotal());
    const tax = parseFloat(calculateTax());
    return (total + tax).toFixed(2);
  };

  if (loading) {
    return (
      <div className="max-w-6xl w-full px-6 mx-auto py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-800 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  // إذا كانت السلة فارغة
  if (cart.products.length === 0) {
    return (
      <div className="max-w-6xl w-full px-6 mx-auto py-16">
        <div className="text-center py-10">
          <svg className="w-20 h-20 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some products to your cart and they will appear here.</p>
          <Link to="/">
            <button className="bg-red-800 text-white px-6 py-3 rounded-lg hover:bg-red-900 transition-colors font-medium">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row py-16 max-w-6xl w-full px-6 mx-auto">
      <div className='flex-1 max-w-4xl'>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-medium text-red-800 ">
            Shopping Cart <span className="text-sm text-red-800">{cart.products.length} Items</span>
          </h1>
          <button
            onClick={handleClearCart}
            className="m-1 text-sm text-red-800 hover:text-red-900 font-medium underline"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
          <p className="text-left">Product Details</p>
          <p className="text-center">Subtotal</p>
          <p className="text-center">Action</p>
        </div>

        {productsDetails.map((product) => (
          <div key={product.id} className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3 border-t border-gray-200">
            <div className="flex items-center md:gap-6 gap-3">
              <Link to={`/post/${product.id}`} className="cursor-pointer">
                <div className="w-24 h-24 flex items-center justify-center border border-gray-300 rounded overflow-hidden">
                  <img 
                    className="max-w-full h-full object-contain p-2" 
                    src={product.image} 
                    alt={product.title} 
                  />
                </div>
              </Link>
              <div>
                <Link to={`/post/${product.id}`}>
                  <p className="font-semibold text-gray-800 line-clamp-1 hover:text-red-800 transition-colors">
                    {product.title}
                  </p>
                </Link>
                <div className="font-normal text-gray-500/70 mt-2">
                  <p>Category: <span className="capitalize">{product.category}</span></p>
                  <div className='flex items-center mt-1'>
                    <p className="mr-2">Qty:</p>
                    <select 
                      className='outline-none border border-gray-300 rounded px-2 py-1'
                      value={product.quantity}
                      onChange={(e) => handleUpdateQuantity(product.id, e.target.value)}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center font-bold text-gray-800">
              ${(product.price * product.quantity).toFixed(2)}
            </p>
            <div className="text-center">
              <button 
                onClick={() => handleDelete(product.id)}
                className="cursor-pointer mx-auto p-2 hover:bg-red-50 rounded-full transition-colors"
                title="Remove item"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="m12.5 7.5-5 5m0-5 5 5m5.833-2.5a8.333 8.333 0 1 1-16.667 0 8.333 8.333 0 0 1 16.667 0" stroke="#FF532E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        ))}

        <Link to={'/'}>
          <button className="group cursor-pointer flex items-center mt-8 gap-2 text-red-800 font-medium">
            <svg width="15" height="11" viewBox="0 0 15 11" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.09 5.5H1M6.143 10 1 5.5 6.143 1" stroke="#7b1717ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Continue Shopping
          </button>
        </Link>
      </div>

      <div className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70">
        <h2 className="text-xl md:text-xl font-medium text-red-800">Order Summary</h2>
        <hr className="border-gray-300 my-5" />

        <div className="mb-6">
          <p className="text-sm font-medium uppercase text-gray-600">Delivery Address</p>
          <div className="relative flex justify-between items-start mt-2">
            <p className="text-gray-500">No address found</p>
            <button 
              onClick={() => setShowAddress(!showAddress)} 
              className="text-red-800 hover:underline cursor-pointer"
            >
              Change
            </button>
            {showAddress && (
              <div className="absolute top-12 py-1 bg-white border border-gray-300 text-sm w-full shadow-lg z-10">
                <p 
                  onClick={() => setShowAddress(false)} 
                  className="text-gray-500 p-2 hover:bg-gray-100 cursor-pointer"
                >
                   zagazig, egypt
                </p>
                <p 
                  onClick={() => setShowAddress(false)} 
                  className="text-red-800 text-center cursor-pointer p-2 hover:bg-red-50"
                >
                  Add address
                </p>
              </div>
            )}
          </div>

          <p className="text-sm font-medium uppercase text-gray-600 mt-6">Payment Method</p>

          <select className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none rounded">
            <option value="COD">Cash On Delivery</option>
            <option value="Online">Online Payment</option>
          </select>
        </div>

        <hr className="border-gray-300" />

        <div className="text-gray-500 mt-4 space-y-2">
          <p className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-medium">${calculateTotal()}</span>
          </p>
          <p className="flex justify-between">
            <span>Shipping Fee</span>
            <span className="text-green-600 font-medium">Free</span>
          </p>
          <p className="flex justify-between">
            <span>Tax (2%)</span>
            <span className="font-medium">${calculateTax()}</span>
          </p>
          <hr className="border-gray-300 my-2" />
          <p className="flex justify-between text-lg font-bold text-gray-800 mt-3">
            <span>Total Amount:</span>
            <span>${calculateFinalTotal()}</span>
          </p>
        </div>

        <button className="w-full py-3 mt-6 cursor-pointer bg-red-700 text-white font-medium hover:bg-red-900 transition rounded-lg shadow">
          Checkout
        </button>
      </div>
    </div>
  );
}