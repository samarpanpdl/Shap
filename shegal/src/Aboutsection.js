// // AboutSection.js
// import React from 'react';
// import './Aboutsection.css';
// import { FaIdBadge, FaAward, FaGift } from 'react-icons/fa';

// const AboutSection = () => {
//   return (
//     <section className="about-section">
//       <div className="about-container">
//         {/* Left Card */}
//         <div className="promo-card">
//           <h4 className="promo-title">Special Offer</h4>
//           <h2 className="promo-offer">Upto 50% Off</h2>
//           <p className="promo-description">
//             BIG WINTER SAVING. GRAB BEAUTY PRODUCT IN JUST 999. Forever Beauty
//           </p>
//           <button className="promo-btn">Shop Now</button>
//         </div>

//         {/* Right About Text */}
//         <div className="about-card">
//           <h2 className="about-title">About <span className="highlight">Us...</span></h2>
//           <p className="about-description">
//             Welcome to SHEGAL!! Where your beauty journey begins! At [SHEGAL Beauty and Skin Care],
//             we believe beauty is more than skin deep. Our mission is to empower you to look and feel
//             your best by offering premium products, expert advice, and the latest trends in beauty.
//             Whether you're looking for skincare solutions, makeup inspiration, or wellness tips, we’ve
//             got you covered. SHEGAL Products is the leading online beauty studio in Nepal. We provide
//             wide range of beauty brands and all top branded skin care products online. Our platform is
//             designed to provide expert beauty tips, the latest trends, honest product reviews to help
//             you make informed choices. Whether you're a beauty enthusiast or just starting your journey,
//             we are here to guide you every step of the way.
//           </p>
//           <button className="readmore-btn">Read More</button>
//         </div>
//       </div>

//       {/* Bottom Icons */}
//       <div className="about-icons">
//         <div className="icon-card">
//           <FaIdBadge size={30} className="icon" />
//           <p>Address Card</p>
//         </div>
//         <div className="icon-card">
//           <FaAward size={30} className="icon" />
//           <p>Award Cards</p>
//         </div>
//         <div className="icon-card">
//           <FaGift size={30} className="icon" />
//           <p>Gift Cards</p>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default AboutSection;

import React from 'react';
import { FaIdBadge, FaAward, FaGift } from 'react-icons/fa';
import { motion } from 'framer-motion';

const AboutSection = () => {
  // Animation Variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <section className="bg-gray-50 py-16 px-4 md:px-8 lg:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
          
          {/* Left Card - Special Offer */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 p-8 md:p-12 text-white shadow-xl flex flex-col justify-center items-start"
          >
            {/* Decorative Background Circle */}
            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"></div>
            
            <h4 className="uppercase tracking-widest font-semibold text-rose-100 mb-2">Special Offer</h4>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Upto 50% Off</h2>
            <p className="text-lg text-rose-50 mb-8 leading-relaxed">
              BIG WINTER SAVING. GRAB BEAUTY PRODUCT IN JUST <span className="font-bold underline">Rs. 999</span>. 
              Forever Beauty starts here.
            </p>
            <button className="bg-white text-rose-600 px-8 py-3 rounded-full font-bold hover:bg-rose-50 transition-colors duration-300 shadow-lg active:scale-95">
              Shop Now
            </button>
          </motion.div>

          {/* Right Text - About Us */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="flex flex-col justify-center p-4"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              About <span className="text-rose-500 italic">Us...</span>
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed text-sm md:text-base">
              <p>
                Welcome to <span className="font-bold text-gray-900">SHEGAL</span>! Where your beauty journey begins! 
                At SHEGAL Beauty and Skin Care, we believe beauty is more than skin deep.
              </p>
              <p>
                Our mission is to empower you to look and feel your best by offering premium products, 
                expert advice, and the latest trends in beauty. SHEGAL Products is the leading online 
                beauty studio in Nepal, providing a wide range of top-branded skincare products.
              </p>
            </div>
            <button className="mt-8 self-start border-2 border-rose-500 text-rose-500 px-6 py-2 rounded-lg font-semibold hover:bg-rose-500 hover:text-white transition-all duration-300">
              Read More
            </button>
          </motion.div>
        </div>

        {/* Bottom Icons Section */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16"
        >
          {[
            { icon: <FaIdBadge />, label: "Address Card" },
            { icon: <FaAward />, label: "Award Cards" },
            { icon: <FaGift />, label: "Gift Cards" }
          ].map((item, index) => (
            <motion.div 
              key={index}
              variants={fadeIn}
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center space-y-3 hover:shadow-md transition-shadow"
            >
              <div className="text-rose-500 text-3xl">
                {item.icon}
              </div>
              <p className="font-medium text-gray-700">{item.label}</p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default AboutSection;