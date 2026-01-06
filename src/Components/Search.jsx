import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  // دالة للبحث الفوري عن منتجات (autocomplete)
  const fetchSuggestions = async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(`https://fakestoreapi.com/products`);
      const products = await response.json();
      
      const filtered = products
        .filter(product => 
          product.title.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5); // عرض أول 5 اقتراحات فقط
      
      setSuggestions(filtered);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchSuggestions(value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setShowSuggestions(false);
      
      // البحث عن أول منتج مطابق والذهاب إليه
      findAndNavigateToProduct(searchTerm);
    }
  };

  // دالة للبحث عن منتج والذهاب إلى صفحته
  const findAndNavigateToProduct = async (searchQuery) => {
    try {
      const response = await fetch('https://fakestoreapi.com/products');
      const products = await response.json();
      
      // البحث عن أول منتج مطابق
      const foundProduct = products.find(product => 
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      if (foundProduct) {
        // الانتقال إلى صفحة المنتج
        navigate(`/post/${foundProduct.id}`);
      } else {
        // إذا لم يتم العثور على منتج، عرض رسالة
        alert(`No product found for "${searchQuery}"`);
        // أو يمكنك الانتقال إلى صفحة البحث العام
        // navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      }
    } catch (error) {
      console.error('Error finding product:', error);
    }
  };

  const handleSuggestionClick = (product) => {
    setSearchTerm(product.title);
    setShowSuggestions(false);
    // الانتقال المباشر إلى صفحة المنتج عند النقر على الاقتراح
    navigate(`/post/${product.id}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  return (
    <div className="relative max-w-md w-full">
      <form onSubmit={handleSearch} className="flex items-center border-b gap-2 border-gray-500/30 h-[46px] overflow-hidden w-full">
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="#6B7280">
          <path d="M13 3C7.489 3 3 7.489 3 13s4.489 10 10 10a9.95 9.95 0 0 0 6.322-2.264l5.971 5.971a1 1 0 1 0 1.414-1.414l-5.97-5.97A9.95 9.95 0 0 0 23 13c0-5.511-4.489-10-10-10m0 2c4.43 0 8 3.57 8 8s-3.57 8-8 8-8-3.57-8-8 3.57-8 8-8"/>
        </svg>
        <input 
          type="text" 
          placeholder="Find products (e.g., electronics, clothing)" 
          value={searchTerm}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          onBlur={handleBlur}
          onFocus={() => searchTerm.length >= 2 && setShowSuggestions(true)}
          className="w-full h-full outline-none placeholder-gray-500 text-gray-500 bg-transparent text-sm" 
        />
        <button 
          type="submit" 
          className="bg-red-900 w-32 h-9 rounded-full text-sm text-white cursor-pointer hover:bg-red-900 transition-colors"
        >
          Search
        </button>
      </form>

      {/* قائمة الاقتراحات */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-50 max-h-80 overflow-y-auto">
          {suggestions.map(product => (
            <div
              key={product.id}
              onClick={() => handleSuggestionClick(product)}
              className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors hover:bg-red-50 group"
            >
              <img 
                src={product.image} 
                alt={product.title}
                className="w-10 h-10 object-contain group-hover:scale-105 transition-transform"
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800 truncate group-hover:text-red-800">
                  {product.title}
                </p>
                <p className="text-xs text-gray-500 capitalize">{product.category}</p>
              </div>
              <span className="text-red-800 font-bold text-sm">
                ${product.price}
              </span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                fill="currentColor" 
                className="text-gray-400 group-hover:text-red-800" 
                viewBox="0 0 16 16"
              >
                <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"/>
              </svg>
            </div>
          ))}
        </div>
      )}

      {showSuggestions && searchTerm.length < 2 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 p-3 text-sm text-gray-500">
          Type at least 2 characters to see suggestions
        </div>
      )}
    </div>
  );
}