import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { storeContext } from '../Context/CartContext.jsx';

export default function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate(); 
  const [product, setProduct] = useState({
    images: [],
    rating: 0,
    price: 0,
    offerPrice: 0,
    description: [],
    category: '',
    name: '',
    title: ''
  });
  const [thumbnail, setThumbnail] = useState('');

  // استخدم addToCart من Context
  const { addToCart } = useContext(storeContext);

  async function fetchProductDetails() {
    try {
      const response = await axios.get(`https://fakestoreapi.com/products/${id}`);
      const data = response.data;
      
      // تكييف البيانات مع التصميم
      const adaptedProduct = {
        ...data,
        name: data.title || data.name || 'Product',
        images: data.image ? [data.image] : [],
        description: data.description ? 
          [data.description] : 
          ['No description available'],
        offerPrice: data.price ? (data.price * 0.9).toFixed(2) : '0.00',
        rating: data.rating?.rate || 0,
        category: data.category || 'Uncategorized'
      };
      
      setProduct(adaptedProduct);
      
      // تعيين الصورة الأولى كصورة رئيسية
      if (adaptedProduct.images.length > 0) {
        setThumbnail(adaptedProduct.images[0]);
      }
      
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  }

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  // دالة الرجوع للخلف
  const handleGoBack = () => {
    navigate(-1);
  };

  // دالة إضافة المنتج للسلة
  const handleAddToCart = () => {
    addToCart(id); // ✅ استخدم addToCart من Context
    console.log('✅ Product added to cart from details page:', id);
  };

  // إذا لم يتم تحميل المنتج بعد
  if (!product || Object.keys(product).length === 0) {
    return (
      <div className="max-w-6xl w-full px-6 py-10 mx-auto">
        <button
          onClick={handleGoBack}
          className="flex items-center gap-2 text-gray-600 hover:text-red-800 transition-colors mb-6"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
          </svg>
          Back
        </button>
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-gray-500">Loading product details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl w-full px-6 mx-auto py-8">
      {/* زر الرجوع للخلف */}
      <button
        onClick={handleGoBack}
        className="flex items-center gap-2 text-gray-600 hover:text-red-800 transition-colors mb-6 group"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth={1.5} 
          stroke="currentColor" 
          className="size-6 group-hover:-translate-x-1 transition-transform"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" 
          />
        </svg>
        <span className="font-medium">Back to Previous Page</span>
      </button>

      {/* Product Images Section */}
      <div className="flex flex-col md:flex-row gap-16 mt-4">
        {/* Product Images Section */}
        <div className="flex gap-3 w-full md:w-1/2">
          {/* Thumbnails */}
          {product.images.length > 1 ? (
            <div className="flex flex-col gap-3">
              {product.images.map((image, index) => (
                <div 
                  key={index} 
                  onClick={() => setThumbnail(image)} 
                  className={`border max-w-24 border-gray-300 rounded overflow-hidden cursor-pointer hover:border-red-800 transition-colors ${thumbnail === image ? 'border-red-800' : ''}`}
                >
                  <img 
                    src={image} 
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-20 object-contain p-1"
                  />
                </div>
              ))}
            </div>
          ) : null}

          {/* Main Image */}
          <div className="flex-1 border border-gray-300 rounded-lg overflow-hidden">
            {thumbnail ? (
              <img 
                src={thumbnail} 
                alt={product.name}
                className="w-full h-full max-h-[500px] object-contain p-8"
              />
            ) : product.images[0] ? (
              <img 
                src={product.images[0]} 
                alt={product.name}
                className="w-full h-full max-h-[500px] object-contain p-8"
              />
            ) : (
              <div className="w-full h-64 flex items-center justify-center bg-gray-100">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
          </div>
        </div>

        {/* Product Details Section */}
        <div className="text-sm w-full md:w-1/2">
          <h1 className="text-3xl font-medium text-gray-900">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-0.5 mt-3">
            {Array(5).fill('').map((_, i) => (
              product.rating > i ? (
                <svg key={i} width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.049.927c.3-.921 1.603-.921 1.902 0l1.294 3.983a1 1 0 0 0 .951.69h4.188c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 0 0-.364 1.118l1.295 3.983c.299.921-.756 1.688-1.54 1.118L9.589 13.63a1 1 0 0 0-1.176 0l-3.389 2.46c-.783.57-1.838-.197-1.539-1.118L4.78 10.99a1 1 0 0 0-.363-1.118L1.028 7.41c-.783-.57-.38-1.81.588-1.81h4.188a1 1 0 0 0 .95-.69z" fill="#dc2626" />
                </svg>
              ) : (
                <svg key={i} width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.04894 0.927049C8.3483 0.00573802 9.6517 0.00574017 9.95106 0.927051L11.2451 4.90983C11.379 5.32185 11.763 5.60081 12.1962 5.60081H16.3839C17.3527 5.60081 17.7554 6.84043 16.9717 7.40983L13.5838 9.87132C13.2333 10.126 13.0866 10.5773 13.2205 10.9894L14.5146 14.9721C14.8139 15.8934 13.7595 16.6596 12.9757 16.0902L9.58778 13.6287C9.2373 13.374 8.7627 13.374 8.41221 13.6287L5.02426 16.0902C4.24054 16.6596 3.18607 15.8934 3.48542 14.9721L4.7795 10.9894C4.91338 10.5773 4.76672 10.126 4.41623 9.87132L1.02827 7.40983C0.244561 6.84043 0.647338 5.60081 1.61606 5.60081H5.8038C6.23703 5.60081 6.62099 5.32185 6.75486 4.90983L8.04894 0.927049Z" fill="#dc2626" fillOpacity="0.35" />
                </svg>
              )
            ))}
            <p className="text-base ml-2 text-gray-600">({product.rating})</p>
          </div>

          {/* Pricing */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-500 line-through text-lg">MRP: ${product.price}</p>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-3xl font-bold text-red-800">${product.offerPrice}</p>
              <span className="px-2 py-1 bg-red-100 text-red-800 text-sm font-medium rounded">
                Save ${(product.price - product.offerPrice).toFixed(2)}
              </span>
            </div>
            <span className="text-gray-500 text-sm mt-2 block">(inclusive of all taxes)</span>
          </div>

          {/* Product Description */}
          <div className="mt-8">
            <p className="text-xl font-semibold text-gray-900 mb-3">About Product</p>
            <ul className="space-y-2">
              {product.description.map((desc, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-red-800 mr-2">•</span>
                  <span className="text-gray-700">{desc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Single Button - Add to Cart */}
          <div className="mt-10">
            <button 
              onClick={handleAddToCart} // ✅ استخدم handleAddToCart الجديدة
              className="w-full py-4 font-medium bg-red-800 text-white cursor-pointer rounded-lg hover:bg-red-900 transition-all duration-200 shadow-md hover:shadow-lg text-lg"
            >
              Add to Cart
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 text-sm">Category</p>
                <p className="font-medium text-red-800">{product.category}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Rating</p>
                <p className="font-medium text-red-800">{product.rating}/5</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}