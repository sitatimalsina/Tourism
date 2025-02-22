import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ExploreNepalImage from '../Images/Explore nepal.jpg';


const AboutUs = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-teal-700 mb-8 text-center">About Us</h1>
          
          <div className="grid md:grid-cols-2 gap-8 h-full">
            <div className="h-full">
              <img 
                src={ExploreNepalImage}
                alt="About Us" 
                className="rounded-lg shadow-lg w-full h-full object-cover"
              />
            </div>

            
            <div className="space-y-4 h-full flex flex-col justify-center">

              <p className="text-gray-700 text-justify">
              Welcome to ExploreNepal, your ultimate travel companion in Nepal! We are passionate about creating unforgettable experiences and helping you discover the breathtaking beauty, rich culture, and hidden gems of Nepal.
              </p>
              <p className="text-gray-700 text-justify">
              Our mission is to make travel planning effortless and enjoyable by offering a wide range of carefully curated destinations, customized travel packages, and top-notch services tailored to your unique preferences. Whether you're seeking thrilling adventures, serene escapes, or cultural immersions, we are here to turn your dreams into reality.
              </p>
              <p className="text-gray-700 text-justify">
              With our dedicated team of travel experts and deep local knowledge, we ensure that every journey with us is not only exciting but also safe, comfortable, and truly memorable. Let us be your guide as you embark on an incredible journey through Nepal, creating stories and memories that will last a lifetime! 🌿🏔️✨.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};


export default AboutUs;
