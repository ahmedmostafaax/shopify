import { Card, CardBody, CardFooter, Image } from '@heroui/react'
import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { storeContext } from '../Context/CartContext.jsx';
import axios from 'axios';

export default function FeedPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useContext(storeContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://fakestoreapi.com/products');
        setProducts(response.data);
        setError(null);
      } catch (error) {
        console.error('Error:', error);
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  const handleAddToCart = (productId) => {
    addToCart(productId);
    console.log('✅ Product added to cart:', productId);
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-8 min-h-screen flex flex-col items-center justify-center">
        <div className="relative">
          {/* Spinner رئيسي */}
          <div className="animate-spin rounded-full h-24 w-24 border-b-4 border-red-800"></div>
          
          {/* Spinner داخلي أصغر */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-red-600"></div>
          </div>
        </div>
        
        <p className="mt-6 text-lg font-medium text-gray-700">Loading products...</p>
        <p className="mt-2 text-sm text-gray-500">Please wait a moment</p>
      </div>
    );
  }


  return (
    <div className="p-4">
           {/* الهدر */}
      <div className="w-full overflow-hidden mb-8">
        <div className="relative">
          {/* الشريط المتحرك */}
          <div className="flex animate-marquee whitespace-nowrap py-3 bg-gradient-to-r from-red-800 via-red-900 to-red-950 text-white rounded-lg">
            {/* تكرار المحتوى عشان يبقى في حركة مستمرة */}
            {[...Array(3)].map((_, index) => (
              <div key={index} className="inline-flex items-center mx-8">
                <span className="font-medium">🚚 Free Shipping on Orders Above $50</span>
                <span className="mx-8 text-red-300">•</span>
                <span className="font-medium">🎁 20% OFF on First Purchase</span>
                <span className="mx-8 text-red-300">•</span>
                <span className="font-medium">🔐 Use Code: <strong className="text-yellow-300">GODZ</strong></span>
                <span className="mx-8 text-red-300">•</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* المنتجات */}
      <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
        {products.map((product) => (
          <div 
            key={product.id} 
            className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-red-100"
          >
            
            <Link to={'/post/' + product.id} className="block">
              <Card 
                shadow="none"
                className="border-none"
              >
                <CardBody className="p-0">
                  <div className="w-full h-56 bg-gray-50 flex items-center justify-center p-4 group-hover:bg-gray-100 transition-colors">
                    <Image
                      alt={product.title}
                      className="max-h-full max-w-full object-contain transition-transform group-hover:scale-105 duration-300"
                      src={product.image}
                      removeWrapper
                    />
                  </div>
                </CardBody>
                
                <CardFooter className="flex-col items-start p-5">
                  <div className="w-full">
                    <div className="flex items-center mb-1">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(product.rating?.rate || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="ml-2 text-sm text-gray-600">
                          {product.rating?.rate || 0}
                        </span>
                      </div>
                    </div>
                    
                    <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-red-800 transition-colors">
                      {product.title}
                    </h4>
                    
                    <div className="flex justify-between items-center mt-4">
                      <span className="font-bold text-red-800 text-lg">${product.price}</span>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </Link>
            
            {/* زر Add to Cart */}
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleAddToCart(product.id);
              }}
              className="absolute bottom-4 right-4 bg-red-800 text-white px-4 py-2 rounded-lg hover:bg-red-900 cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-lg z-10 font-medium text-sm"
            >
              Add to Cart
            </button>
            
          </div>
        ))}
      </div>

      {/* Footer info */}
      <div className="mt-12 pt-8 border-t border-gray-200 text-center">
        <p className="text-sm text-gray-500 mt-2">
          Browse our collection and add your favorites to cart
        </p>
      </div>
    </div>
  );
}