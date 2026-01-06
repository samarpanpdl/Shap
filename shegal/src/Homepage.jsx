// // Home.js
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import './Home.css';
// import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
// import AboutSection from './Aboutsection';
// import BlogSection from './Blogsection';
// import './Store.css'
// import ShopSection from './ShopSection';
// const Home = () => {  
//     const [products, setProducts] = useState([]);
//       const [loading, setLoading] = useState(true);
//       const [error, setError] = useState(null);
    
//       useEffect(() => {
//         const fetchProducts = async () => {
//           try {
//             const response = await axios.get('http://127.0.0.1:8000/store/products/');
//             setProducts(response.data);
//           } catch (err) {
//             setError('Failed to fetch products');
//           } finally {
//             setLoading(false);
//           }
//         };
    
//         fetchProducts();
//       }, []);
    
//       if (loading) return <p>Loading products...</p>;
//       if (error) return <p>{error}</p>;
//   return (<>
//     <section className="hero">
//       <div className="overlay">
//         <div className="hero-text">
//           <h1>EFFORTLESS<br />ELEGANCE</h1>
//           <button className="hero-btn">Read More</button>
//         </div>

//         <div className="hero-nav">
//           <button className="nav-btn"><FaArrowLeft /></button>
//           <button className="nav-btn"><FaArrowRight /></button>
//         </div>
//       </div>
//     </section>
//     <section id='about' className='about'>
//       <AboutSection/>
//     </section>
//     <hr/>
    
//     <ShopSection/>
//     <section id='blog' className='blogs'>
//       <BlogSection/>
//     </section>
//     </>
//   );
// };

// export default Home;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

// Component Imports
import AboutSection from './Aboutsection';
import BlogSection from './Blogsection';
import ShopSection from './ShopSection';
import Footer from './Components/Footer'; // Assuming you have a Footer component

const heroImages = [
  './static/images/skincare.jpg', // Replace with your actual image paths
  './static/images/theeye.jpg',
  './static/images/facecream.jpg',
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/store/products/');
        setProducts(response.data);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError('Unable to load our latest collection. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Hero image auto-carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % heroImages.length
      );
    }, 7000); // Change image every 7 seconds
    return () => clearInterval(interval);
  }, []);

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      (prevIndex - 1 + heroImages.length) % heroImages.length
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      (prevIndex + 1) % heroImages.length
    );
  };

  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden">
        <AnimatePresence>
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImages[currentImageIndex]})` }}
          >
            <div className="absolute inset-0 bg-black/50" /> {/* Darker overlay */}
          </motion.div>
        </AnimatePresence>

        <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-center text-left">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            className="text-white space-y-6 max-w-2xl"
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-extralight tracking-tighter leading-tight drop-shadow-lg">
              EFFORTLESS<br />
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 1, ease: "easeOut" }}
                className="font-bold text-rose-300 italic block mt-2 md:mt-4"
              >
                ELEGANCE
              </motion.span>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.5, ease: "easeOut" }}
              className="text-gray-100 max-w-md text-lg md:text-xl font-light tracking-wide leading-relaxed drop-shadow-md"
            >
              Discover the secret to timeless beauty with our curated premium skincare and luxury cosmetics.
            </motion.p>
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 2, ease: "easeOut" }}
              whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}
              whileTap={{ scale: 0.95 }}
              className="mt-8 px-12 py-4 bg-white text-gray-900 font-bold rounded-full hover:bg-rose-500 hover:text-white transition-all duration-300 shadow-xl"
            >
              Shop the Collection
            </motion.button>
          </motion.div>

          {/* Hero Navigation Buttons */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4 z-10">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePrevImage}
              className="p-4 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white hover:text-gray-900 transition-all duration-300 shadow-lg"
            >
              <FaArrowLeft />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleNextImage}
              className="p-4 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white hover:text-gray-900 transition-all duration-300 shadow-lg"
            >
              <FaArrowRight />
            </motion.button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 md:py-24">
        <AboutSection />
      </section>

      <hr className="border-gray-100" />

      {/* Shop Section with Props Handling */}
      <section id="shop" className="py-16 md:py-24">
        {loading ? (
          <div className="py-20 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-rose-500 mx-auto mb-4"></div>
            <p className="text-gray-500 animate-pulse text-lg">Fetching our latest products...</p>
          </div>
        ) : error ? (
          <div className="py-20 text-center text-rose-500 text-lg font-medium">
            <p>{error}</p>
          </div>
        ) : (
          <ShopSection products={products} />
        )}
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-16 md:py-24">
        <BlogSection />
      </section>

      {/* Footer (if you have one) */}
      <Footer />
    </main>
  );
};

export default Home;