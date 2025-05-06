import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [data, setData] = useState(null);
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const [searchTab, setSearchTab] = useState('Flights');
  const [tripType, setTripType] = useState('roundTrip');
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    departDate: '',
    returnDate: '',
    passengers: '1',
    class: 'economy',
    promoCode: ''
  });
  const destRef = useRef(null);
  const offerRef = useRef(null);
  const fleetRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    import('../data.json').then((module) => setData(module.default || module));
  }, []);

  useEffect(() => {
    if (data?.hero?.images?.length) {
      const interval = setInterval(() => {
        setCurrentHeroImage((prev) => (prev + 1) % data.hero.images.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [data]);

  if (!data) return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bimanRed"></div>
    </div>
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would dispatch this to a booking flow
    navigate('/book', { state: { formData } });
  };

  const scrollTo = (ref) => {
    ref.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-white">
      {/* Hero Section with Carousel */}
      <section className="relative h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentHeroImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{ 
              // backgroundImage: `url(${data.hero.images[currentHeroImage]})`,
              // Fallback image if the image doesn't exist
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${data.hero.images[currentHeroImage]}), linear-gradient(to right, #006A4E, #006A4E)`  
            }}
          />
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent">
          <div className="container mx-auto h-full flex flex-col justify-center px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="max-w-2xl text-white"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-4">
                {data.hero.headline}
              </h1>
              <p className="text-lg sm:text-xl mb-8 text-white/90">
                {data.hero.subheadline}
              </p>
              <div className="flex space-x-4">
                <button 
                  onClick={() => scrollTo(destRef)}
                  className="px-6 py-3 bg-bimanRed hover:bg-red-700 text-white rounded-lg font-semibold transition shadow-lg hover:shadow-xl"
                >
                  {data.hero.cta}
                </button>
                <button 
                  onClick={() => scrollTo(offerRef)}
                  className="px-6 py-3 border-2 border-white hover:bg-white/20 text-white rounded-lg font-semibold transition"
                >
                  View Offers
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Flight Search Widget */}
      <section className="relative z-10">
        <div className="container mx-auto px-4 -mt-24 lg:px-0 lg:-mt-32">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-2xl p-6 lg:p-8"
          >
            {/* Search Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
              {data.quickSearch.tabs.map((tab) => (
                <button
                  key={tab}
                  className={`px-4 py-2 font-medium text-sm sm:text-base ${
                    searchTab === tab
                      ? 'text-bimanGreen border-b-2 border-bimanGreen'
                      : 'text-gray-500 hover:text-bimanGreen'
                  }`}
                  onClick={() => setSearchTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Flight Search Form */}
            {searchTab === 'Flights' && (
              <div>
                <div className="flex space-x-4 mb-6">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      className="form-radio text-bimanGreen h-4 w-4"
                      name="tripType"
                      value="roundTrip"
                      checked={tripType === 'roundTrip'}
                      onChange={() => setTripType('roundTrip')}
                    />
                    <span className="ml-2 text-gray-700">Round Trip</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      className="form-radio text-bimanGreen h-4 w-4"
                      name="tripType"
                      value="oneWay"
                      checked={tripType === 'oneWay'}
                      onChange={() => setTripType('oneWay')}
                    />
                    <span className="ml-2 text-gray-700">One Way</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      className="form-radio text-bimanGreen h-4 w-4"
                      name="tripType"
                      value="multiCity"
                      checked={tripType === 'multiCity'}
                      onChange={() => setTripType('multiCity')}
                    />
                    <span className="ml-2 text-gray-700">Multi-City</span>
                  </label>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    {/* From */}
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                      <select
                        name="from"
                        value={formData.from}
                        onChange={handleInputChange}
                        className="form-select w-full rounded-lg border-gray-300 shadow-sm focus:border-bimanGreen focus:ring focus:ring-bimanGreen/20 transition"
                        required
                      >
                        <option value="">Select Origin</option>
                        {data.destinations.map(dest => (
                          <option key={dest.id} value={dest.code}>{dest.name} ({dest.code})</option>
                        ))}
                      </select>
                    </div>

                    {/* To */}
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                      <select
                        name="to"
                        value={formData.to}
                        onChange={handleInputChange}
                        className="form-select w-full rounded-lg border-gray-300 shadow-sm focus:border-bimanGreen focus:ring focus:ring-bimanGreen/20 transition"
                        required
                      >
                        <option value="">Select Destination</option>
                        {data.destinations.map(dest => (
                          <option key={dest.id} value={dest.code}>{dest.name} ({dest.code})</option>
                        ))}
                      </select>
                    </div>

                    {/* Depart Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Departure</label>
                      <input
                        type="date"
                        name="departDate"
                        value={formData.departDate}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split('T')[0]}
                        className="form-input w-full rounded-lg border-gray-300 shadow-sm focus:border-bimanGreen focus:ring focus:ring-bimanGreen/20 transition"
                        required
                      />
                    </div>

                    {/* Return Date */}
                    {tripType === 'roundTrip' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Return</label>
                        <input
                          type="date"
                          name="returnDate"
                          value={formData.returnDate}
                          onChange={handleInputChange}
                          min={formData.departDate || new Date().toISOString().split('T')[0]}
                          className="form-input w-full rounded-lg border-gray-300 shadow-sm focus:border-bimanGreen focus:ring focus:ring-bimanGreen/20 transition"
                          required={tripType === 'roundTrip'}
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {/* Passengers */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Passengers</label>
                      <select
                        name="passengers"
                        value={formData.passengers}
                        onChange={handleInputChange}
                        className="form-select w-full rounded-lg border-gray-300 shadow-sm focus:border-bimanGreen focus:ring focus:ring-bimanGreen/20 transition"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <option key={num} value={num}>{num} {num === 1 ? 'Passenger' : 'Passengers'}</option>
                        ))}
                      </select>
                    </div>

                    {/* Class */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                      <select
                        name="class"
                        value={formData.class}
                        onChange={handleInputChange}
                        className="form-select w-full rounded-lg border-gray-300 shadow-sm focus:border-bimanGreen focus:ring focus:ring-bimanGreen/20 transition"
                      >
                        <option value="economy">Economy</option>
                        <option value="business">Business</option>
                        <option value="first">First Class</option>
                      </select>
                    </div>

                    {/* Promo Code */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Promo Code (Optional)</label>
                      <input
                        type="text"
                        name="promoCode"
                        value={formData.promoCode}
                        onChange={handleInputChange}
                        placeholder="Enter code"
                        className="form-input w-full rounded-lg border-gray-300 shadow-sm focus:border-bimanGreen focus:ring focus:ring-bimanGreen/20 transition"
                      />
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <button
                      type="submit"
                      className="px-8 py-3 bg-bimanGreen hover:bg-green-800 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5"
                    >
                      Search Flights
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Check-in Form (simplified) */}
            {searchTab === 'Check-in' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Booking Reference (PNR)</label>
                  <input
                    type="text"
                    placeholder="6-character code"
                    className="form-input w-full rounded-lg border-gray-300 shadow-sm focus:border-bimanGreen focus:ring focus:ring-bimanGreen/20 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    placeholder="Enter your last name"
                    className="form-input w-full rounded-lg border-gray-300 shadow-sm focus:border-bimanGreen focus:ring focus:ring-bimanGreen/20 transition"
                  />
                </div>
                <div className="md:col-span-2 flex justify-center mt-4">
                  <button className="px-8 py-3 bg-bimanGreen hover:bg-green-800 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5">
                    Check-in Now
                  </button>
                </div>
              </div>
            )}

            {/* Flight Status (simplified) */}
            {searchTab === 'Flight Status' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Flight Number</label>
                  <input
                    type="text"
                    placeholder="e.g., BG123"
                    className="form-input w-full rounded-lg border-gray-300 shadow-sm focus:border-bimanGreen focus:ring focus:ring-bimanGreen/20 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    className="form-input w-full rounded-lg border-gray-300 shadow-sm focus:border-bimanGreen focus:ring focus:ring-bimanGreen/20 transition"
                  />
                </div>
                <div className="flex items-end">
                  <button className="w-full px-4 py-3 bg-bimanGreen hover:bg-green-800 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5">
                    Check Status
                  </button>
                </div>
              </div>
            )}

            {/* Manage Booking (simplified) */}
            {searchTab === 'Manage Booking' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Booking Reference (PNR)</label>
                  <input
                    type="text"
                    placeholder="6-character code"
                    className="form-input w-full rounded-lg border-gray-300 shadow-sm focus:border-bimanGreen focus:ring focus:ring-bimanGreen/20 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    placeholder="Enter your last name"
                    className="form-input w-full rounded-lg border-gray-300 shadow-sm focus:border-bimanGreen focus:ring focus:ring-bimanGreen/20 transition"
                  />
                </div>
                <div className="md:col-span-2 flex justify-center mt-4">
                  <button className="px-8 py-3 bg-bimanGreen hover:bg-green-800 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5">
                    Retrieve Booking
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section ref={destRef} className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Destinations</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our most popular destinations with special fares and unforgettable experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.destinations.filter(d => d.popular).slice(0, 8).map((dest) => (
              <motion.div
                key={dest.id}
                whileHover={{ y: -10 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={dest.image} 
                    alt={dest.name} 
                    className="w-full h-full object-cover transition duration-500 hover:scale-110" 
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = 'https://placehold.co/600x400/006A4E/ffffff?text=' + dest.name;
                    }}
                  />
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{dest.name}</h3>
                    <span className="text-sm font-medium px-2 py-1 bg-bimanGold/20 text-bimanGreen rounded-full">
                      {dest.code}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{dest.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-bimanRed font-bold">
                      From ${dest.featuredFare}
                    </span>
                    <button className="text-bimanGreen hover:text-bimanRed font-medium text-sm transition">
                      Book Now →
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="px-6 py-3 bg-bimanGreen text-white rounded-lg shadow hover:bg-bimanGreen/80 transition">
              View All Destinations
            </button>
          </div>
        </div>
      </section>

      {/* Special Offers */}
      <section ref={offerRef} className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Special Offers</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Exclusive deals and promotions to make your journey even more memorable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.offers.map((offer) => (
              <motion.div
                key={offer.id}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl shadow-xl overflow-hidden flex flex-col md:flex-row"
              >
                <div className="md:w-2/5 h-48 md:h-auto overflow-hidden">
                  <img 
                    src={offer.image} 
                    alt={offer.title} 
                    className="w-full h-full object-cover transition duration-500 hover:scale-110"
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = 'https://placehold.co/600x400/D71920/ffffff?text=Special+Offer';
                    }}
                  />
                </div>
                <div className="p-6 md:w-3/5 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{offer.title}</h3>
                      {offer.expiryDate && (
                        <span className="text-xs text-gray-500">
                          Valid until {new Date(offer.expiryDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <h4 className="text-bimanRed font-semibold mb-2">{offer.subtitle}</h4>
                    <p className="text-gray-600 text-sm">{offer.description}</p>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex gap-2">
                      {offer.tags.map(tag => (
                        <span 
                          key={tag} 
                          className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <button className="px-4 py-2 bg-bimanRed text-white rounded-lg hover:bg-bimanRed/80 transition text-sm font-medium">
                      {offer.ctaText}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Travel Classes */}
      <section className="py-20 px-4 bg-gradient-to-br from-bimanGreen/10 to-bimanGold/10">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Travel Classes</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience comfort and luxury tailored to your preferences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {data.travelClasses.map((travelClass) => (
              <motion.div
                key={travelClass.id}
                whileHover={{ y: -10 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="h-52 overflow-hidden">
                  <img 
                    src={travelClass.image} 
                    alt={travelClass.name} 
                    className="w-full h-full object-cover transition duration-500 hover:scale-110"
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = `https://placehold.co/600x400/006A4E/ffffff?text=${travelClass.name}+Class`;
                    }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-bimanGreen mb-2">{travelClass.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{travelClass.description}</p>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Key Features:</h4>
                  <ul className="text-sm text-gray-600 space-y-1 mb-4">
                    {travelClass.features.slice(0, 3).map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-bimanGreen mr-2">•</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button className="w-full px-4 py-2 bg-bimanGreen text-white text-center rounded-lg hover:bg-bimanGreen/80 transition text-sm font-medium">
                    Learn More
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Fleet Information */}
      <section ref={fleetRef} className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Modern Fleet</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience comfort and safety with our state-of-the-art aircraft.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {data.fleetInfo.map((aircraft) => (
              <motion.div
                key={aircraft.type}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col"
              >
                <div className="h-64 overflow-hidden">
                  <img 
                    src={aircraft.image} 
                    alt={aircraft.type} 
                    className="w-full h-full object-cover transition duration-500 hover:scale-110"
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = `https://placehold.co/800x400/006A4E/ffffff?text=${aircraft.type.replace(/ /g, '+')}`;
                    }}
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{aircraft.type}</h3>
                    <p className="text-gray-600 mb-4">{aircraft.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Key Features:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {aircraft.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="text-bimanGreen mr-2">•</span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Cabin Layout:</h4>
                        <div className="space-y-1 text-sm">
                          {aircraft.cabinLayout.first > 0 && (
                            <p className="flex justify-between">
                              <span>First Class:</span>
                              <span className="font-medium">{aircraft.cabinLayout.first} seats</span>
                            </p>
                          )}
                          {aircraft.cabinLayout.business > 0 && (
                            <p className="flex justify-between">
                              <span>Business:</span>
                              <span className="font-medium">{aircraft.cabinLayout.business} seats</span>
                            </p>
                          )}
                          {aircraft.cabinLayout.economy > 0 && (
                            <p className="flex justify-between">
                              <span>Economy:</span>
                              <span className="font-medium">{aircraft.cabinLayout.economy} seats</span>
                            </p>
                          )}
                          <p className="flex justify-between font-semibold pt-1 border-t mt-1">
                            <span>Total:</span>
                            <span>{Object.values(aircraft.cabinLayout).reduce((a, b) => a + b, 0)} seats</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button className="mt-auto w-full px-4 py-2 bg-bimanGold text-bimanGreen text-center rounded-lg hover:bg-bimanGold/80 transition text-sm font-medium">
                    Explore {aircraft.type}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-bimanGreen text-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Passenger Stories</h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Hear what our passengers have to say about their journey with Biman Bangladesh Airlines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {data.testimonials.slice(0, 3).map((testimonial) => (
              <motion.div
                key={testimonial.id}
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg"
              >
                <div className="flex items-center mb-4">
                  <div className="h-14 w-14 rounded-full overflow-hidden mr-4 bg-bimanGold/20">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.author} 
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = `https://placehold.co/100x100/FFD700/006A4E?text=${testimonial.author.charAt(0)}`;
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{testimonial.author}</h3>
                    <p className="text-sm text-white/70">{testimonial.location}</p>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex text-bimanGold mb-2">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill={i < testimonial.rating ? "currentColor" : "none"} stroke="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="italic text-white/90">&ldquo;{testimonial.quote}&rdquo;</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="px-6 py-3 bg-white text-bimanGreen rounded-lg shadow hover:bg-bimanGold transition">
              Read More Reviews
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Subscribe to Our Newsletter</h2>
              <p className="text-gray-600">
                Get exclusive offers, travel tips, and updates delivered directly to your inbox.
              </p>
            </div>
            <form className="flex flex-col md:flex-row gap-4">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 form-input rounded-lg border-gray-300 shadow-sm focus:border-bimanGreen focus:ring focus:ring-bimanGreen/20 transition"
                required
              />
              <button 
                type="submit"
                className="px-6 py-3 bg-bimanRed hover:bg-red-700 text-white font-bold rounded-lg shadow hover:shadow-lg transition"
              >
                Subscribe
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-4 text-center">
              By subscribing, you agree to our Privacy Policy and consent to receive marketing communications.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Popular Destinations</h3>
              <ul className="space-y-2 text-gray-600">
                {data.destinations.filter(d => d.popular).slice(0, 5).map(dest => (
                  <li key={dest.id}>
                    <a href={`/destinations/${dest.id}`} className="hover:text-bimanGreen transition">
                      {dest.name} ({dest.code})
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Travel Information</h3>
              <ul className="space-y-2 text-gray-600">
                <li><a href="/baggage" className="hover:text-bimanGreen transition">Baggage Information</a></li>
                <li><a href="/travel-requirements" className="hover:text-bimanGreen transition">Travel Requirements</a></li>
                <li><a href="/special-assistance" className="hover:text-bimanGreen transition">Special Assistance</a></li>
                <li><a href="/travel-insurance" className="hover:text-bimanGreen transition">Travel Insurance</a></li>
                <li><a href="/faqs" className="hover:text-bimanGreen transition">FAQs</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">About Biman</h3>
              <ul className="space-y-2 text-gray-600">
                <li><a href="/about" className="hover:text-bimanGreen transition">About Us</a></li>
                <li><a href="/fleet" className="hover:text-bimanGreen transition">Our Fleet</a></li>
                <li><a href="/careers" className="hover:text-bimanGreen transition">Careers</a></li>
                <li><a href="/news" className="hover:text-bimanGreen transition">News & Updates</a></li>
                <li><a href="/contact" className="hover:text-bimanGreen transition">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Connect With Us</h3>
              <div className="flex space-x-4 mb-4">
                {Object.entries(data.contact.socialMedia).map(([platform, url]) => (
                  <a 
                    key={platform} 
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="h-10 w-10 rounded-full bg-bimanGreen/10 flex items-center justify-center text-bimanGreen hover:bg-bimanGreen hover:text-white transition"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      {platform === 'facebook' && <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>}
                      {platform === 'twitter' && <path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124-4.09-.193-7.715-2.157-10.141-5.126-.427.722-.666 1.561-.666 2.457 0 1.704.877 3.214 2.205 4.096-.815-.026-1.582-.248-2.252-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.686 1.321-3.801 2.107-6.102 2.107-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 14-7.503 14-14 0-.21-.005-.418-.015-.628.961-.689 1.8-1.56 2.46-2.548l-.047-.02z"/>}
                      {platform === 'instagram' && <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>}
                      {platform === 'youtube' && <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>}
                    </svg>
                  </a>
                ))}
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Customer Service:</h4>
              <p className="text-sm text-gray-600 mb-1">{data.contact.customerService.phone}</p>
              <p className="text-sm text-gray-600 mb-4">{data.contact.customerService.hours}</p>
              <a 
                href={`mailto:${data.contact.customerService.email}`} 
                className="inline-block px-4 py-2 bg-bimanGreen text-white rounded hover:bg-bimanGreen/80 transition text-sm"
              >
                Email Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;