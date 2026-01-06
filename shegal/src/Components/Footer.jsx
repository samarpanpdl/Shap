// // Footer.js
// import React from 'react';
// import {
//   FaFacebookF,
//   FaTwitter,
//   FaInstagram,
//   FaLinkedinIn,
//   FaPhone,
//   FaEnvelope,
//   FaMapMarkerAlt,
// } from 'react-icons/fa';
// import './Footer.css'; // import the CSS

// const Footer = () => {
//   const quickLinks = ["Home", "About", "Shop", "Gallery", "Message", "Blogs"];
//   const extraLinks = ["My Favorite", "My Order", "My Wishlist", "Private Policy", "Terms Of Use"];

//   return (
//     <footer className="footer">
//       <div className="footer-container">

//         <div className="footer-section">
//           <h2>Quick Links</h2>
//           {quickLinks.map(link => (
//             <p key={link}>&rsaquo; {link}</p>
//           ))}
//         </div>

//         <div className="footer-section">
//           <h2>Extra Links</h2>
//           {extraLinks.map(link => (
//             <p key={link}>&rsaquo; {link}</p>
//           ))}
//         </div>

//         <div className="footer-section contact">
//           <h2>Contact Info</h2>
//           <p><FaPhone /> 9779846022711</p>
//           <p><FaPhone /> 061-461823</p>
//           <p><FaEnvelope /> Christyppoudel@Gmail.Com</p>
//           <p><FaMapMarkerAlt /> Pokhara</p>
//           <div className="social-icons">
//             {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, idx) => (
//               <div className="icon-box" key={idx}><Icon /></div>
//             ))}
//           </div>
//         </div>

//         <div className="footer-section">
//           <h2>Newsletter</h2>
//           <p>Subscribe For Latest Updates</p>
//           <input type="email" placeholder="enter your email" className="newsletter-input" />
//           <button className="subscribe-btn">Subscribe</button>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;
import React from 'react';
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const Footer = () => {
  const quickLinks = ["Home", "About", "Shop", "Gallery", "Message", "Blogs"];
  const extraLinks = ["My Favorite", "My Order", "My Wishlist", "Private Policy", "Terms Of Use"];

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        
        {/* Quick Links */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          <h2 className="text-xl font-bold border-b-2 border-rose-500 w-fit pb-2 mb-6">Quick Links</h2>
          <div className="flex flex-col space-y-3">
            {quickLinks.map(link => (
              <a 
                key={link} 
                href={`#${link.toLowerCase()}`} 
                className="text-gray-400 hover:text-rose-500 transition-colors duration-300 flex items-center group"
              >
                <span className="mr-2 group-hover:translate-x-1 transition-transform">›</span> {link}
              </a>
            ))}
          </div>
        </motion.div>

        {/* Extra Links */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <h2 className="text-xl font-bold border-b-2 border-rose-500 w-fit pb-2 mb-6">Extra Links</h2>
          <div className="flex flex-col space-y-3">
            {extraLinks.map(link => (
              <a 
                key={link} 
                href="#" 
                className="text-gray-400 hover:text-rose-500 transition-colors duration-300 flex items-center group"
              >
                <span className="mr-2 group-hover:translate-x-1 transition-transform">›</span> {link}
              </a>
            ))}
          </div>
        </motion.div>

        {/* Contact Info */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h2 className="text-xl font-bold border-b-2 border-rose-500 w-fit pb-2 mb-6">Contact Info</h2>
          <div className="space-y-4 text-gray-400">
            <p className="flex items-center gap-3 hover:text-rose-500 transition-colors">
              <FaPhone className="text-rose-500" /> 9779846022711
            </p>
            <p className="flex items-center gap-3 hover:text-rose-500 transition-colors">
              <FaPhone className="text-rose-500" /> 061-461823
            </p>
            <p className="flex items-center gap-3 hover:text-rose-500 transition-colors break-all">
              <FaEnvelope className="text-rose-500" /> Christyppoudel@Gmail.Com
            </p>
            <p className="flex items-center gap-3 hover:text-rose-500 transition-colors">
              <FaMapMarkerAlt className="text-rose-500" /> Pokhara, Nepal
            </p>
          </div>
          
          {/* Social Icons */}
          <div className="flex gap-3 mt-6">
            {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, idx) => (
              <motion.a
                key={idx}
                href="#"
                whileHover={{ y: -5, backgroundColor: '#f43f5e' }}
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white transition-all shadow-lg"
              >
                <Icon size={18} />
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Newsletter */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <h2 className="text-xl font-bold border-b-2 border-rose-500 w-fit pb-2 mb-6">Newsletter</h2>
          <p className="text-gray-400">Subscribe For Latest Updates</p>
          <form className="flex flex-col gap-3 mt-4" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-rose-500 transition-colors"
            />
            <button className="bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 rounded-lg transition-all active:scale-95 shadow-lg shadow-rose-500/20">
              Subscribe
            </button>
          </form>
        </motion.div>
      </div>

      {/* Copyright Bar */}
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} <span className="text-rose-500 font-semibold">SHEGAL</span> Beauty and Skin Care. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;