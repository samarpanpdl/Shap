// import './Login.css'
// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// const Login = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//   e.preventDefault();
//   try {
//     const response = await axios.post('http://127.0.0.1:8000/user/api/token/', {
//       username,
//       password,
//     });

//     const { access, refresh } = response.data;

//     // Save only access in memory (safer) or localStorage (simpler)
//     localStorage.setItem('access_token', access);
//     localStorage.setItem('refresh_token', refresh);

//     // Set default header for future requests
//     axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;

//     // Navigate to home page
//     navigate('/');
//   } catch (err) {
//     console.error('Login failed:', err);
//     setError('Invalid credentials');
//   }
// };
//   return (
//     <>
//     <div className="wrapper">
//     <h2>Login</h2><br/>

    
//     <form onSubmit={handleLogin} className='formbox'>
//       <div className="input-box">
//         <input type="text" placeholder="Enter your username" required name="username" value={username} onChange={(e)=> setUsername(e.target.value)}/>
//       </div>
//       <div className="input-box">
//         <input type="password" placeholder="Enter your password" required name="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
//       </div>
//       <div className="policy">
//       </div>
//       <div className="input-box button">
//         <button type="submit">Login</button>

//       </div>
//       <div className="text">
//         <h3>Don't have an account? <a href="/register">Register now</a></h3>
//       </div>
//       <div className="text">
//         <h3>Forgot Password? <a href="#">Reset</a></h3>
//       </div>
//     </form>
//   </div>
  
    
//     </>
//   )
// }

// export default Login

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaLock, FaArrowRight } from 'react-icons/fa';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://127.0.0.1:8000/user/api/token/', {
        username,
        password,
      });

      const { access, refresh } = response.data;

      // Token Storage
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      // Set global header for immediate use
      axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;

      // Smooth transition to home
      navigate('/');
    } catch (err) {
      console.error('Login failed:', err);
      setError(err.response?.data?.detail || 'Invalid username or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 bg-[url('https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?q=80&w=2080&auto=format&fit=crop')] bg-cover bg-center">
      {/* Dark Overlay for background image */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative max-w-md w-full space-y-8 bg-white/90 backdrop-blur-lg p-10 rounded-3xl shadow-2xl border border-white/20"
      >
        <div>
          <h2 className="text-center text-4xl font-serif font-bold text-gray-900 tracking-tight">
            Welcome <span className="text-rose-600 italic">Back</span>
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Login to access your beauty profile
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-rose-50 border-l-4 border-rose-500 p-4 text-rose-700 text-sm"
            >
              {error}
            </motion.div>
          )}

          <div className="rounded-md space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <FaUser size={16} />
              </div>
              <input
                type="text"
                required
                className="appearance-none relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-rose-500 focus:border-rose-500 focus:z-10 sm:text-sm transition-all"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <FaLock size={16} />
              </div>
              <input
                type="password"
                required
                className="appearance-none relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-rose-500 focus:border-rose-500 focus:z-10 sm:text-sm transition-all"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              
              <a href="/forgot-password" className="ml-2 font-medium text-rose-600 hover:text-rose-500 transition-colors">
                Forgot Password
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white transition-all active:scale-95 shadow-lg ${
                loading ? 'bg-rose-400 cursor-not-allowed' : 'bg-rose-600 hover:bg-rose-700 shadow-rose-200'
              }`}
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  Login <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </div>

          <div className="text-center text-sm">
            <p className="text-gray-600 font-medium">
              Don't have an account?{' '}
              <Link to="/register" className="text-rose-600 hover:text-rose-500 font-bold transition-all">
                Register now
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;