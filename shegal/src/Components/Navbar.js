// // Navbar.js
// import React, { useEffect, useState, useRef} from 'react';
// import axios from 'axios';
// import { useNavigate,useLocation } from 'react-router-dom';
// import { FaShoppingCart } from 'react-icons/fa';
// import './Navbar.css'; // import the CSS
// import { CartContext } from './CartContext';
// import { FaBars, FaTimes} from "react-icons/fa";
// import { useContext } from 'react';
// const Navbar = () => {
//   const navigate = useNavigate();
//   const { getCount } = useContext(CartContext);
//   const { clearCart} = useContext(CartContext);
//   const [showSidebar, setShowSidebar] = useState(false);
//   const [userData, setUserData] = useState(null);
  
//   const location = useLocation();
  

//   const handleShowSidebar = () => {
//     setShowSidebar(true);
//   };
//   const handleHideSidebar = () => {
//     setShowSidebar(false);
//   };

//   useEffect(() => {
//     if (location.pathname === '/login' || location.pathname === '/register') {
//       return; 
//     }
//     const fetchUserInfo = async () => {
//       const token = localStorage.getItem('access_token');

//       if (!token) {
//         console.log("No token found, redirecting to login");
//         navigate('/login');
//         return;
//       }

//       try {
//         const response = await axios.get('http://127.0.0.1:8000/user/api/user-info/', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setUserData(response.data);
//       } catch (error) {
//         console.error('Error fetching user info:', error);
//         if (error.response?.status === 401) {
//           navigate('/login');
//         }
//       }
//     };
     


//     fetchUserInfo();
    
//   }, [navigate]);

//   const handleLogout = () => {
//     localStorage.removeItem('access_token');
//     localStorage.removeItem('refresh_token');
//     setUserData(null);
//     clearCart();
//     navigate('/login');
//   };

//   const goToLogin = () => navigate('/login');
//   const goToRegister = () => navigate('/register');
//   const navRef = useRef();
 
//   return (
//     <nav className="navbar">
      
//       <div className="logo">
//         <span className="icon">♀</span>
//         <span className="text">SHEGAL</span>
//       </div>    

//       <ul className="nav-links slidelinks">
//         <li><a href="/">Home</a></li>
//         <li><a href="#about">About</a></li>
//         <li><a href="/store">Shop</a></li>
//         <li><a href="#">Gallery</a></li>
//         <li><a href="/#blog">Blogs</a></li>
//       </ul>
     

//       <div className="nav-right rightlinks">
//          <div className="cart">
//           <a href='/cart' ><FaShoppingCart className="cart-icon" /></a>
//           <span className="cart-count">{getCount()}</span>
//         </div>
//         {userData ? (
//         <>
//           <span>Welcome, {userData.username}</span>
//           <button className="logout-btn" onClick={handleLogout}>Logout</button>
//         </>
//       ) : (
//         <>
//           <button className="logout-btn" onClick={goToLogin}>Log In</button>
//           <button className="logout-btn" onClick={goToRegister}>Register</button>
//         </>
//       )}
      
//       </div>
      
//       <button onClick={handleShowSidebar} className='bars'><FaBars/></button>
      
      
//       <div className='sidebare' style={{ display: showSidebar ? "flex" : "none" }}>
//         <button className='cross' onClick={handleHideSidebar} ><FaTimes/></button>
//         <div className="nav-right">
//         {userData ? (
//         <>
//           <span>Welcome, {userData.username}</span>
//           <button className="logout-btn" onClick={handleLogout}>Logout</button>
//         </>
//       ) : (
//         <>
//           <button className="logout-btn" onClick={goToLogin}>Log In</button>
//           <button className="logout-btn" onClick={goToRegister}>Register</button>
//         </>
//       )}
//       </div>
//       <div className="cart">
//           <a href='/cart' ><FaShoppingCart className="cart-icon" /></a>
//           <span className="cart-count">{getCount()}</span>
//         </div>
//         <ul className="nav-links">
//         <li><a href="/">Home</a></li>
//         <li><a href="#about">About</a></li>
//         <li><a href="/store">Shop</a></li>
//         <li><a href="#">Gallery</a></li>
//         <li><a href="/#blog">Blogs</a></li>
//       </ul>
    
//       </div>

//     </nav>
//   );
// };

// export default Navbar;
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FaShoppingCart, FaBars, FaTimes, FaUserCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { CartContext } from './CartContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getCount, clearCart } = useContext(CartContext);
  
  const [showSidebar, setShowSidebar] = useState(false);
  const [userData, setUserData] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  // Handle Navbar Background change on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (location.pathname === '/login' || location.pathname === '/register') return;

    const fetchUserInfo = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      try {
        const response = await axios.get('http://127.0.0.1:8000/user/api/user-info/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data);
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem('access_token');
          setUserData(null);
        }
      }
    };
    fetchUserInfo();
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUserData(null);
    clearCart();
    navigate('/login');
    setShowSidebar(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/#about' },
    { name: 'Shop', path: '/store' },
    { name: 'Gallery', path: '#' },
    { name: 'Blogs', path: '/#blog' },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 
      bg-white/80 backdrop-blur-md shadow-md py-3 ${scrolled ? 'shadow-lg' : 'shadow-none'
    }`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-2xl text-rose-500 group-hover:rotate-12 transition-transform">♀</span>
          <span className="text-xl font-bold tracking-widest text-gray-800">SHEGAL</span>
        </Link>

        {/* Desktop Links */}
        <ul className="hidden lg:flex items-center gap-8 font-medium text-gray-600">
          {navLinks.map((link) => (
            <li key={link.name}>
              <a href={link.path} className="hover:text-rose-500 transition-colors relative group">
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-rose-500 transition-all group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>

        {/* Right Side Actions */}
        <div className="hidden lg:flex items-center gap-6">
          <Link to="/cart" className="relative p-2 text-gray-700 hover:text-rose-500 transition-colors">
            <FaShoppingCart size={22} />
            <span className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
              {getCount()}
            </span>
          </Link>

          {userData ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FaUserCircle className="text-rose-500" size={20} />
                <span>{userData.username}</span>
              </div>
              <button onClick={handleLogout} className="text-sm font-bold text-gray-500 hover:text-rose-500 transition-colors">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" className="px-5 py-2 rounded-full text-sm font-bold text-gray-700 hover:bg-gray-100 transition-all">Login</Link>
              <Link to="/register" className="px-5 py-2 bg-rose-500 text-white rounded-full text-sm font-bold hover:bg-rose-600 transition-all shadow-lg shadow-rose-200">Register</Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button onClick={() => setShowSidebar(true)} className="lg:hidden p-2 text-gray-800">
          <FaBars size={24} />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {showSidebar && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSidebar(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[80%] max-w-sm bg-white z-[70] p-8 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-10">
                <span className="font-bold text-xl tracking-widest text-rose-500">SHEGAL</span>
                <button onClick={() => setShowSidebar(false)}><FaTimes size={24} /></button>
              </div>

              <div className="space-y-8">
                <ul className="space-y-6 text-lg font-semibold text-gray-800">
                  {navLinks.map((link) => (
                    <li key={link.name} onClick={() => setShowSidebar(false)}>
                      <a href={link.path}>{link.name}</a>
                    </li>
                  ))}
                  <li onClick={() => setShowSidebar(false)}>
                    <Link to="/cart" className="flex items-center gap-2 text-rose-500">
                      Cart ({getCount()})
                    </Link>
                  </li>
                </ul>

                <hr className="border-gray-100" />

                <div className="flex flex-col gap-4">
                  {userData ? (
                    <>
                      <p className="text-gray-500">Welcome, <span className="text-gray-900 font-bold">{userData.username}</span></p>
                      <button onClick={handleLogout} className="w-full py-3 bg-gray-100 text-gray-800 rounded-xl font-bold">Logout</button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" onClick={() => setShowSidebar(false)} className="w-full py-3 border-2 border-rose-500 text-rose-500 rounded-xl font-bold text-center">Login</Link>
                      <Link to="/register" onClick={() => setShowSidebar(false)} className="w-full py-3 bg-rose-500 text-white rounded-xl font-bold text-center">Register</Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;