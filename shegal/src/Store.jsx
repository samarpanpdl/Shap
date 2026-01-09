import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import debounce from 'lodash/debounce';
import { FaSearch, FaRobot, FaShoppingCart, FaFilter, FaMagic, FaTimes } from 'react-icons/fa';
import { CartContext } from './Components/CartContext';
import FilterSidebar from './FilterSidebar';

const Store = () => {
  const { fetchCart } = useContext(CartContext);

  // --- Product & Fetch State ---
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  
  // Search States
  const [searchTerm, setSearchTerm] = useState(''); // What user types
  const [query, setQuery] = useState('');           // What actually hits the API

  // UI States
  const [showAIModal, setShowAIModal] = useState(false);

  // Filter States
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSkinTypes, setSelectedSkinTypes] = useState([]);
  const [selectedbrand, setSelectedbrand] = useState([]);
  const [selectedWarranties, setSelectedWarranties] = useState([]);

  // Skin Analysis State
  const [image, setImage] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  // --- Search Logic (Live & Simultaneous) ---
  
  // Debounce function: Updates 'query' 500ms after user stops typing
  const debouncedSearch = useCallback(
    debounce((nextValue) => {
      setQuery(nextValue);
      setPage(1); // Reset to page 1 on new search
    }, 500),
    []
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);    // UI stays responsive
    debouncedSearch(value);  // Backend fetch is delayed
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault(); // This stops the browser from reloading the page
    debouncedSearch.cancel(); // Cancel any pending debounces
    setQuery(searchTerm);
    setPage(1);
  };
  //skin analysis handler
  const handleSkinAnalysis = async () => {
    if (!image) return;
    setLoadingAnalysis(true);
    const formData = new FormData();
    formData.append("image", image);
    
    try {
      const res = await axios.post("http://localhost:8000/store/skin-analysis/", formData, {
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem("access_token")}`,
          'Content-Type': 'multipart/form-data' 
        }
      });
      setAnalysisResult(res.data); // This stores the "Skin Type: Oily" etc.
      
      // OPTIONAL: Automatically check the filter for the user!
      if(res.data.skin_type) {
          setSelectedSkinTypes([res.data.skin_type.toLowerCase()]);
      }
    } catch (err) {
      console.error("Analysis Failed", err);
    } finally {
      setLoadingAnalysis(false);
    }
};
  // --- Filter Handlers ---
  const createToggleHandler = (setState) => (value) => {
    setState(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
    setPage(1);
  };

  // --- API Functions ---
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const offset = (page - 1) * 12;
        const response = await axios.get('http://127.0.0.1:8000/store/search/', {
          params: { 
            offset, 
            limit: 12, 
            search: query // This hits the icontains logic in Django
          }
        });
        setProducts(response.data);
        setError(null);
      } catch (err) {
        setError('Unable to reach the gallery. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [page, query]);

  const AddToCart = async (productId) => {
    const token = localStorage.getItem('access_token');
    try {
      await axios.post('http://127.0.0.1:8000/store/add-to-cart/', 
        { product_id: productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart();
    } catch (err) { console.error(err); }
  };

  // Client-side Filter logic for secondary refinement
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      return (
        (selectedCategories.length === 0 || selectedCategories.includes(product.category)) &&
        (selectedSkinTypes.length === 0 || selectedSkinTypes.includes(product.for_type)) &&
        (selectedbrand.length === 0 || selectedbrand.includes(product.brand))
      );
    });
  }, [products, selectedCategories, selectedSkinTypes, selectedbrand]);

  return (
    <div className="bg-[#fafafa] min-h-screen pt-24 pb-12">
      
      {/* Header & Search Area */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
          <div>
            <h1 className="text-3xl font-serif font-bold text-gray-900">SHEGAL Collections</h1>
            <p className="text-gray-400 text-sm mt-1">Discover your glow with AI-powered curation.</p>
          </div>

          <div className="flex flex-1 max-w-2xl gap-3">
            <form onSubmit={handleSearchSubmit} className="relative flex-1">
              <input 
                type="text"
                placeholder="Search for products, brands..."
                value={searchTerm}
                onChange={handleInputChange}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-rose-200 transition-all"
              />
              <FaSearch className="absolute left-4 top-4 text-gray-300" />
            </form>
            <button 
              onClick={() => setShowAIModal(true)}
              className="px-6 py-3 bg-rose-500 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-rose-600 transition-all shadow-lg shadow-rose-100"
            >
              <FaMagic className="hidden sm:block" /> Skin AI
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-8">
        {/* Left Sidebar */}
        <FilterSidebar
          selectedCategories={selectedCategories}
          selectedSkinTypes={selectedSkinTypes}
          selectedbrand={selectedbrand}
          selectedWarranties={selectedWarranties}
          handleCategoryChange={createToggleHandler(setSelectedCategories)}
          handleSkinTypeChange={createToggleHandler(setSelectedSkinTypes)}
          handleBrandChange={createToggleHandler(setSelectedbrand)}
          handleWarrantyChange={createToggleHandler(setSelectedWarranties)}
          image={image} 
          setImage={setImage}
          handleSkinAnalysis={handleSkinAnalysis} // Pass the function
          loadingAnalysis={loadingAnalysis}       // Pass loading state
          analysisResult={analysisResult}
        />

        {/* Main Content */}
        <main className="flex-1">
          {loading ? (
             <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-80 bg-gray-200 animate-pulse rounded-[2rem]" />
                ))}
             </div>
          ) : filteredProducts.length > 0 ? (
            <motion.div layout className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredProducts.map(product => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="group bg-white rounded-[2rem] overflow-hidden border border-gray-100 hover:shadow-2xl hover:shadow-rose-100 transition-all duration-500"
                  >
                    <div className="aspect-[4/5] overflow-hidden relative">
                      <img 
                        src={`http://127.0.0.1:8000${product.image}`} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        alt={product.name}
                      />
                      <button 
                        onClick={() => AddToCart(product.id)}
                        className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl text-rose-500 hover:bg-rose-500 hover:text-white transition-all transform translate-y-12 group-hover:translate-y-0"
                      >
                        <FaShoppingCart />
                      </button>
                    </div>
                    <div className="p-5">
                      <p className="text-[10px] font-bold text-rose-400 uppercase tracking-tighter mb-1">{product.brand || 'Exclusive'}</p>
                      <h3 className="font-bold text-gray-900 truncate text-lg">{product.name}</h3>
                      <p className="text-gray-900 font-serif text-xl mt-2">${product.price}</p>
                      <Link to={`/products/${product.id}`} className="text-xs text-gray-400 mt-4 block hover:text-rose-500">View Details →</Link>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-gray-200">
              <div className="text-5xl mb-4">✨</div>
              <h2 className="text-xl font-bold text-gray-800">No matches found</h2>
              <p className="text-gray-400 mt-2">Try adjusting your search or filters.</p>
              <button 
                onClick={() => {setQuery(''); setSearchTerm('');}}
                className="mt-6 px-6 py-2 border border-rose-200 text-rose-500 rounded-full hover:bg-rose-50 transition-colors"
              >
                Reset Everything
              </button>
            </div>
          )}

          {/* Pagination */}
          {filteredProducts.length > 0 && (
            <div className="flex justify-center items-center gap-6 mt-16">
              <button 
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-white border border-gray-200 disabled:opacity-30 hover:border-rose-300 transition-all"
              > ← </button>
              <span className="font-bold text-gray-900">Page {page}</span>
              <button 
                disabled={products.length < 12}
                onClick={() => setPage(p => p + 1)}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-white border border-gray-200 disabled:opacity-30 hover:border-rose-300 transition-all"
              > → </button>
            </div>
          )}
        </main>
      </div>

      {/* AI Modal Integration */}
      <AnimatePresence>
        {showAIModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ y: 50 }} animate={{ y: 0 }} exit={{ y: 50 }}
              className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 relative shadow-2xl"
            >
              <button onClick={() => setShowAIModal(false)} className="absolute top-6 right-6 text-gray-300 hover:text-gray-600"><FaTimes /></button>
              <h2 className="text-2xl font-serif font-bold mb-2">Skin Analysis AI</h2>
              <p className="text-gray-400 text-sm mb-8">Let our AI analyze your skin type for personalized picks.</p>
              
              <div className="border-2 border-dashed border-rose-100 rounded-[2rem] p-10 text-center bg-rose-50/30 mb-6">
                <input type="file" id="modal-upload" className="hidden" onChange={(e) => setImage(e.target.files[0])} />
                <label htmlFor="modal-upload" className="cursor-pointer">
                  <FaRobot className="mx-auto text-4xl text-rose-300 mb-4" />
                  <p className="font-bold text-gray-700">{image ? image.name : "Tap to upload photo"}</p>
                </label>
              </div>

              <button className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-xl shadow-gray-200" onClick={handleSkinAnalysis}>
                Start Expert Analysis
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Store;