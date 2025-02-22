import React from 'react';
import { motion } from 'framer-motion';

const offerItems = [
  {
    title: "Planned Itinerary",
    description: "A ready-made itinerary with set destinations and activities",
    icon: "🗺️"
  },
  {
    title: "Destinations",
    description: "Shows destinations based on your preferences and interests",
    icon: "📍"
  },
  {
    title: "Genuine Reviews",
    description: "Read authentic reviews from our satisfied customers",
    icon: "⭐"
  },
  {
    title: "Quick Service",
    description: "Fast and efficient booking with instant confirmation",
    icon: "⚡"
  }
];

const WhatWeOffer = () => {
  return (
    <div className="py-12 ">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-teal-700 mb-8 text-center">
          What We Offer
        </h2>
        <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {offerItems.map((item, index) => (
            <motion.div 
              key={index}
              className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center text-center text-sm min-h-[225px]" // Increased height
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.5, duration: 1 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhatWeOffer;
