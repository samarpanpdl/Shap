
import React from 'react';
import { FaUser } from 'react-icons/fa';
import { motion } from 'framer-motion';

const blogs = [
  {
    id: 1,
    author: 'Shristi Poudel',
    date: '12',
    month: 'Jan',
    image: '/static/images/IMG_2048.png',
    content: 'SHEGAL is a leading beauty ecommerce platform in Nepal dedicated to providing high-quality products and a seamless shopping experience...',
  },
  {
    id: 2,
    author: 'Sagun Chhetri',
    date: '19',
    month: 'Jan',
    image: '/static/images/IMG_2051.png',
    content: 'Who we are: SHEGAL is the exclusive importer, distributor, and retailer for leading American and European beauty brands in Nepal...',
  },
  {
    id: 3,
    author: 'Manisha Chhetri',
    date: '02',
    month: 'Jan',
    image: '/static/images/Adobe Express - file.png',
    content: 'Welcome to SHEGAL Beauty and Skin Care – your ultimate destination for authentic international beauty. Our mission is to curate...',
  },
];

const BlogSection = () => {
  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="bg-white py-20 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-gray-800"
          >
            Our Daily <span className="text-rose-500">Blogs</span>
          </motion.h2>
          <div className="h-1 w-20 bg-rose-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Blog Cards Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {blogs.map((blog) => (
            <motion.div 
              key={blog.id} 
              variants={cardVariants}
              whileHover={{ y: -10 }}
              className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100"
            >
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={blog.image} 
                  alt="blog" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Date Badge */}
                <div className="absolute top-4 left-4 bg-rose-500 text-white px-4 py-2 rounded-xl text-center shadow-lg">
                  <span className="block text-xl font-bold leading-none">{blog.date}</span>
                  <p className="text-xs uppercase font-medium">{blog.month}</p>
                </div>
              </div>

              {/* Content Container */}
              <div className="p-6">
                <div className="flex items-center text-rose-500 mb-4 text-sm font-semibold">
                  <FaUser className="mr-2" />
                  <span className="text-gray-500">Admin:</span>
                  <span className="ml-1 text-gray-800">{blog.author}</span>
                </div>
                
                <p className="text-gray-600 line-clamp-3 mb-6 leading-relaxed">
                  {blog.content}
                </p>

                <button className="text-rose-500 font-bold flex items-center group-hover:underline transition-all">
                  Read Full Story 
                  <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default BlogSection;