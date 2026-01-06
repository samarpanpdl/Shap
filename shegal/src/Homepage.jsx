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
import React, { useEffect, useState,useRef,useLayoutEffect } from 'react';
import './Home.css';
import axios from 'axios';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Component Imports
import AboutSection from './Aboutsection';
import BlogSection from './Blogsection';
import ShopSection from './ShopSection';
import Footer from './Components/Footer'; // Assuming you have a Footer component

gsap.registerPlugin(ScrollTrigger)
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


  const heroRef = useRef(null)
  const heroImgRef = useRef(null)
  const productsRef = useRef(null)
  const m6Ref = useRef(null)
  const serumRef = useRef(null)
  
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      setTimeout(() => {
        gsap.to(heroImgRef.current, {
          scrollTrigger: {
            trigger: productsRef.current,
            start: 'top center',
            end: 'top 100px',
            scrub: true,
          },
          x: -10,
          y: 660,
          scale: 0.4,
          rotate: 0,
          ease: 'power2.out',
        })
      }, 1300)
  
      gsap.to(m6Ref.current, {
        scrollTrigger: {
          trigger: serumRef.current, 
          start: 'top bottom',      
          end: 'top center',        
          scrub: true,
        },
        x: 450,   
        y: 500,  
        scale: 1.5,
        rotate:10,
        ease: 'power2.out',
      })
    }, heroRef)
  
    return () => ctx.revert()
  }, [])
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
  const heroImages = [
  'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=2000', // Creamy Texture
  'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=2000', // Minimalist Shadow
  'https://images.unsplash.com/photo-1516962215378-7fa2e1372cd6?auto=format&fit=crop&q=80&w=2000'  // Neutral Stone
];

  return (
    <main className="bg-white">
      {/* Hero Section */}
      {/* <section>
         <div className="hero" ref={heroRef}>
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
        </motion.div>

        <div className="hero-content">
          <motion.h1
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
          >
            Minimalist
          </motion.h1>

          <motion.p
            initial={{ y: 300, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.8 }}
          >
            <span className="span1">Clean skincare made simple</span>{' '}
            <span className="span2">
              effective, honest, and gentle on your skin.
            </span>
          </motion.p>

          <motion.img
            ref={heroImgRef}
            src="./static/images/hero.png"
            alt="hero"
            className="hero-img"
            initial={{ y: 300, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.5 }}
            style={{ rotate: 20 }}
          />
        </div>

        <motion.div
          className="hero-left"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 1 }}
        >
          <p>
            Discover the power of simplicity in skincare. Formulas designed to
            nourish, balance, and let your natural glow shine. Because true
            beauty begins with healthy, cared-for skin.
          </p>
          <button className="hero-btn">Shop Now</button>
        </motion.div>

        <motion.div
          className="hero-right"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 1.2 }}
        >
          <div className="hero-card">
            <h1>Glow Naturally</h1>
            <p>
              Experience minimal skincare crafted to bring balance, hydration,
              and confidence to your everyday routine.
            </p>
            <button className="hero-card-btn">Learn More</button>
          </div>
        </motion.div>
      </div>

      <div className="products" ref={productsRef}>
        <h2>Our Products</h2>
        <div className="product-grid">
          <div className="product-item">
            <div className="product-img">
              <img src="./static/images/m2.png" alt="product 1" />
            </div>
            <p>Daily Sunscreen</p>
          </div>
          <div className="product-item">
            <div className="product-img">
            </div>
            <p>Hair Serum</p>
          </div>
          <div className="product-item">
            <div className="product-img">
              <img src="./static/images/m3.png" alt="product 3" />
            </div>
            <p>Face Expholiator</p>
          </div>

          <div className="product-item">
            <div className="product-img">
              <img src="./static/images/m4.png" alt="product 4" />
            </div>
            <p>Alpha Cleanser</p>
          </div>
          <div className="product-item">
            <div className="product-img">
            <img ref={m6Ref} src="./static/images/m6.png" alt="product 5" />
            </div>
            <p>Hair Repair Serum</p>
          </div>
          <div className="product-item">
            <div className="product-img">
              <img src="./static/images/m5.png" alt="product 6" />
            </div>
            <p>Radiance Oil</p>
          </div>
        </div>
      </div>
   <div className="s">
   <div className="serum" ref={serumRef}>

  <div className="serum-text">
    <img src="./static/images/drop.png" alt="" className='drop' />
    <h1>Hydrating Serum</h1>
    <p>
      Our Hydrating Serum is formulated to deeply nourish and restore your skin’s natural balance. 
      Enriched with essential vitamins and antioxidants, it helps retain moisture, improves elasticity, 
      and gives your skin a dewy, radiant glow. Perfect for daily use and suitable for all skin types — 
      because healthy skin never goes out of style.
    </p>
    <button className="serum-btn">Shop Now</button>
  </div>

  <div className="serum-img">
    <img src="/images/serum.png" alt="Hydrating Serum" />
  </div>
</div>

   </div>
      </section> */}
      <section className="relative h-screen w-full flex items-center overflow-hidden">
        {/* Background Layer */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 z-0"
          >
            <img 
              src={heroImages[currentImageIndex]} 
              className="w-full h-full object-cover" 
              alt="Luxury Background" 
            />
            {/* Soft Overlay for text contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          {/* Glassmorphism Text Card */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            className="p-8 md:p-12 rounded-3xl backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl"
          >
            <h1 className="text-5xl md:text-7xl font-serif leading-tight text-white">
              EFFORTLESS<br />
              <span className="text-rose-200 italic font-light">ELEGANCE</span>
            </h1>
            <p className="mt-6 text-lg text-gray-100 font-light leading-relaxed max-w-sm">
              Premium skincare curated for your natural glow. Simple, honest, and effective.
            </p>
            <div className="mt-8 flex gap-4">
              <button className="px-8 py-3 bg-white text-gray-900 rounded-full font-medium hover:bg-rose-500 hover:text-white transition-all transform hover:scale-105">
                Shop Now
              </button>
            </div>
          </motion.div>

          {/* Floating Product (GSAP Target) */}
          
        </div>

        {/* Carousel Controls */}
        <div className="absolute bottom-12 right-12 flex gap-4 z-20">
          <button onClick={() => setCurrentImageIndex((p) => (p - 1 + heroImages.length) % heroImages.length)} 
            className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/30 text-white backdrop-blur-md transition-all">
            <FaArrowLeft />
          </button>
          <button onClick={() => setCurrentImageIndex((p) => (p + 1) % heroImages.length)} 
            className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/30 text-white backdrop-blur-md transition-all">
            <FaArrowRight />
          </button>
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
    
    </main>
  );
};

export default Home;