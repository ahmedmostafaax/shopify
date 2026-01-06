import axios from "axios";
import { createContext, useState, useEffect } from "react";

export let storeContext = createContext();

export function StoreContextProvider({ children }) {
    // تحميل cart من localStorage
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('userCart');
        return savedCart 
            ? JSON.parse(savedCart)
            : {
                id: Date.now(),
                userId: 1,
                date: new Date().toISOString().split('T')[0],
                products: [] // سلة فارغة
            };
    });

    // حفظ في localStorage عند كل تغيير
    useEffect(() => {
        localStorage.setItem('userCart', JSON.stringify(cart));
    }, [cart]);

    //  إضافة منتج للسلة
    const addToCart = async (productId) => {
        try {
            const productToAdd = {
                productId: productId,
                quantity: 1
            };

            setCart(prev => {
                const existingProduct = prev.products.find(
                    item => item.productId === productId
                );

                let updatedProducts;
                
                if (existingProduct) {
                    updatedProducts = prev.products.map(item =>
                        item.productId === productId
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    );
                } else {
                    updatedProducts = [...prev.products, productToAdd];
                }

                return {
                    ...prev,
                    products: updatedProducts
                };
            });

            // أرسل للـ API
            const cartData = {
                userId: 1,
                date: new Date().toISOString().split('T')[0],
                products: [productToAdd]
            };

            const response = await axios.post('https://fakestoreapi.com/carts', cartData);
            console.log('✅ Product added to cart:', productId);
            
            return response.data;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    };

    
    
    // 1.  حذف منتج
    const removeFromCart = (productId) => {
        setCart(prev => ({
            ...prev,
            products: prev.products.filter(item => item.productId !== productId)
        }));
        console.log('🗑️ Product removed:', productId);
    };

    // 2.  تحديث الكمية
    const updateQuantity = (productId, quantity) => {
        setCart(prev => ({
            ...prev,
            products: prev.products.map(item =>
                item.productId === productId
                    ? { ...item, quantity: Math.max(1, quantity) }
                    : item
            )
        }));
        console.log('📊 Quantity updated:', productId, 'to', quantity);
    };

    // 3.  تفريغ السلة
    const clearCart = () => {
        setCart({
            id: Date.now(),
            userId: 1,
            date: new Date().toISOString().split('T')[0],
            products: []
        });
        console.log('🧹 Cart cleared');
    };

    // حساب العداد
    const counter = cart.products.reduce((total, item) => total + item.quantity, 0);

    const value = {
        counter,
        setCounter: () => {},
        cart,
        addToCart,
        removeFromCart, 
        updateQuantity, 
        clearCart 
    };

    console.log('📤 Context value:', value);

    return (
        <storeContext.Provider value={value}>
            {children}
        </storeContext.Provider>
    );
}