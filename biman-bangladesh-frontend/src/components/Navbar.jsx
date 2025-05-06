import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [language, setLanguage] = useState('en');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [data, setData] = useState(null);
  const [megaMenu, setMegaMenu] = useState(null);
  const location = useLocation();

  useEffect(() => {
    import('../data.json').then((module) => setData(module.default || module));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  if (!data) return null;

  const translations = data.translations[language]?.nav || {};

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'bn' : 'en');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  const toggleMegaMenu = (menu) => {
    if (megaMenu === menu) {
      setMegaMenu(null);
    } else {
      setMegaMenu(menu);
    }
  };

  const mainMenuItems = [
    { key: 'home', label: translations.home || 'Home', path: '/' },
    { key: 'book', label: translations.book || 'Book', path: '/book', hasMegaMenu: true },
    { key: 'manage', label: translations.manage || 'Manage', path: '/manage' },
    { key: 'checkIn', label: translations.checkIn || 'Check-in', path: '/check-in' },
    { key: 'flightStatus', label: translations.flightStatus || 'Flight Status', path: '/flight-status' },
    { key: 'destinations', label: translations.destinations || 'Destinations', path: '/destinations', hasMegaMenu: true },
    { key: 'offers', label: translations.offers || 'Offers', path: '/offers' },
    { key: 'loyalty', label: translations.loyalty || 'Loyalty', path: '/loyalty', hasMegaMenu: true }
  ];

  const menuAnimations = {
    initial: { opacity: 0, height: 0 },
    animate: { opacity: 1, height: 'auto' },
    exit: { opacity: 0, height: 0 }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`w-full bg-white sticky top-0 z-50 transition-all duration-300 ${
          isScrolled ? 'shadow-md py-2' : 'shadow py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center hover:opacity-90 transition">
            <img 
              src="/biman-template/logo.png" 
              alt="Biman Bangladesh Airlines" 
              className="h-12 object-contain"
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = 'https://placehold.co/200x80/D71920/ffffff?text=BIMAN';
              }}
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex gap-1 text-gray-800 font-medium">
            {mainMenuItems.map((item) => (
              <div key={item.key} className="relative group">
                <Link
                  to={item.path}
                  onClick={item.hasMegaMenu ? (e) => {
                    e.preventDefault();
                    toggleMegaMenu(item.key);
                  } : undefined}
                  className={`px-3 py-2 rounded-md hover:bg-bimanGreen/10 hover:text-bimanGreen transition-colors relative flex items-center ${
                    location.pathname === item.path ? 'text-bimanGreen' : ''
                  }`}
                >
                  {item.label}
                  {item.hasMegaMenu && (
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-4 w-4 ml-1 transition-transform duration-200 ${megaMenu === item.key ? 'rotate-180' : ''}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </Link>
              </div>
            ))}
          </div>

          {/* Language Toggle & Mobile Menu Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-md hover:bg-bimanGreen/10 text-bimanGreen font-medium transition-colors"
            >
              {language === 'en' ? (
                <>EN <span className="text-gray-400">|</span> <span className="text-gray-500">বাংলা</span></>
              ) : (
                <><span className="text-gray-500">EN</span> <span className="text-gray-400">|</span> বাংলা</>
              )}
            </button>

            <Link 
              to="/login" 
              className="hidden md:flex items-center gap-1 px-4 py-2 rounded-lg bg-bimanGold/20 text-bimanGreen hover:bg-bimanGold transition-colors font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <span>Log In</span>
            </Link>

            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-md hover:bg-bimanGreen/10 text-bimanGreen transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mega Menus */}
        <AnimatePresence>
          {megaMenu && (
            <motion.div
              key={`megamenu-${megaMenu}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 right-0 bg-white shadow-lg border-t border-gray-100"
            >
              <div className="max-w-7xl mx-auto px-4 py-6">
                {megaMenu === 'book' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                      <h3 className="text-lg font-bold text-bimanGreen mb-4">Flights</h3>
                      <ul className="space-y-2">
                        <li>
                          <Link to="/book/flights" className="text-gray-700 hover:text-bimanRed transition flex items-center">
                            <span className="w-6 inline-block text-bimanGreen">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11.43a1 1 0 01.725-.962l5-1.429a1 1 0 001.17-1.409l-7-14z" />
                              </svg>
                            </span>
                            Book Flight
                          </Link>
                        </li>
                        <li>
                          <Link to="/book/flights?type=multi" className="text-gray-700 hover:text-bimanRed transition flex items-center">
                            <span className="w-6 inline-block text-bimanGreen">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                              </svg>
                            </span>
                            Multi-city Booking
                          </Link>
                        </li>
                        <li>
                          <Link to="/book/group" className="text-gray-700 hover:text-bimanRed transition flex items-center">
                            <span className="w-6 inline-block text-bimanGreen">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                              </svg>
                            </span>
                            Group Booking
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-bimanGreen mb-4">Extra Services</h3>
                      <ul className="space-y-2">
                        <li>
                          <Link to="/book/seats" className="text-gray-700 hover:text-bimanRed transition flex items-center">
                            <span className="w-6 inline-block text-bimanGreen">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                              </svg>
                            </span>
                            Seat Selection
                          </Link>
                        </li>
                        <li>
                          <Link to="/book/baggage" className="text-gray-700 hover:text-bimanRed transition flex items-center">
                            <span className="w-6 inline-block text-bimanGreen">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                                <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                              </svg>
                            </span>
                            Extra Baggage
                          </Link>
                        </li>
                        <li>
                          <Link to="/book/meals" className="text-gray-700 hover:text-bimanRed transition flex items-center">
                            <span className="w-6 inline-block text-bimanGreen">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                              </svg>
                            </span>
                            Special Meals
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-bimanGreen mb-4">Travel Info</h3>
                      <ul className="space-y-2">
                        <li>
                          <Link to="/book/fare-families" className="text-gray-700 hover:text-bimanRed transition flex items-center">
                            <span className="w-6 inline-block text-bimanGreen">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-14a3 3 0 00-3 3v2H7a1 1 0 000 2h1v1a1 1 0 01-1 1 1 1 0 100 2h6a1 1 0 100-2H9.83c.11-.313.17-.65.17-1v-1h1a1 1 0 100-2h-1V7a1 1 0 112 0 1 1 0 102 0 3 3 0 00-3-3z" clipRule="evenodd" />
                              </svg>
                            </span>
                            Fare Families
                          </Link>
                        </li>
                        <li>
                          <Link to="/book/baggage-info" className="text-gray-700 hover:text-bimanRed transition flex items-center">
                            <span className="w-6 inline-block text-bimanGreen">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                              </svg>
                            </span>
                            Baggage Information
                          </Link>
                        </li>
                        <li>
                          <Link to="/book/travel-docs" className="text-gray-700 hover:text-bimanRed transition flex items-center">
                            <span className="w-6 inline-block text-bimanGreen">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                              </svg>
                            </span>
                            Travel Documents
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {megaMenu === 'destinations' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                      <h3 className="text-lg font-bold text-bimanGreen mb-4">Popular Destinations</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {data.destinations.filter(d => d.popular).slice(0, 6).map(dest => (
                          <Link 
                            key={dest.id} 
                            to={`/destinations/${dest.id}`} 
                            className="text-gray-700 hover:text-bimanRed transition flex items-center"
                          >
                            <span className="w-6 inline-block text-bimanGreen">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                              </svg>
                            </span>
                            {dest.name} ({dest.code})
                          </Link>
                        ))}
                      </div>
                      <Link 
                        to="/destinations" 
                        className="inline-block mt-4 text-bimanRed hover:text-bimanGreen font-medium transition"
                      >
                        View all destinations →
                      </Link>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-bimanGreen mb-4">Travel Guides</h3>
                      <ul className="space-y-2">
                        {data.destinations_guides.slice(0, 3).map(guide => (
                          <li key={guide.id}>
                            <Link 
                              to={`/guides/${guide.id}`} 
                              className="text-gray-700 hover:text-bimanRed transition flex items-center gap-2"
                            >
                              <div className="w-10 h-10 rounded-full overflow-hidden">
                                <img 
                                  src={guide.image} 
                                  alt={guide.destination} 
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.onerror = null; 
                                    e.target.src = `https://placehold.co/100x100/006A4E/ffffff?text=${guide.destination.charAt(0)}`;
                                  }}
                                />
                              </div>
                              <div>
                                <span className="font-medium block">{guide.destination}</span>
                                <span className="text-xs text-gray-500">
                                  {guide.highlights.slice(0, 2).join(', ')}...
                                </span>
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <Link 
                        to="/travel-guides" 
                        className="inline-block mt-4 text-bimanRed hover:text-bimanGreen font-medium transition"
                      >
                        Explore travel guides →
                      </Link>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-bimanGreen mb-4">Route Map</h3>
                      <div className="rounded-lg overflow-hidden h-44 bg-gray-100 flex items-center justify-center relative">
                        <div className="absolute inset-0 bg-bimanGreen/20 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                          </svg>
                        </div>
                        <img 
                          src="/images/route-map.jpg" 
                          alt="Biman Bangladesh Route Map" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null; 
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                      <Link 
                        to="/route-map" 
                        className="block text-center py-3 mt-4 bg-bimanGreen text-white rounded-lg hover:bg-bimanGreen/90 transition"
                      >
                        View Interactive Map
                      </Link>
                    </div>
                  </div>
                )}

                {megaMenu === 'loyalty' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                      <h3 className="text-lg font-bold text-bimanGreen mb-4">Loyalty Program</h3>
                      <ul className="space-y-2">
                        <li>
                          <Link to="/loyalty/join" className="text-gray-700 hover:text-bimanRed transition flex items-center">
                            <span className="w-6 inline-block text-bimanGreen">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                              </svg>
                            </span>
                            Join {data.loyaltyProgram.name}
                          </Link>
                        </li>
                        <li>
                          <Link to="/loyalty/benefits" className="text-gray-700 hover:text-bimanRed transition flex items-center">
                            <span className="w-6 inline-block text-bimanGreen">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            </span>
                            Program Benefits
                          </Link>
                        </li>
                        <li>
                          <Link to="/loyalty/tiers" className="text-gray-700 hover:text-bimanRed transition flex items-center">
                            <span className="w-6 inline-block text-bimanGreen">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                              </svg>
                            </span>
                            Membership Tiers
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-bimanGreen mb-4">Earn & Redeem</h3>
                      <ul className="space-y-2">
                        <li>
                          <Link to="/loyalty/earn" className="text-gray-700 hover:text-bimanRed transition flex items-center">
                            <span className="w-6 inline-block text-bimanGreen">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                              </svg>
                            </span>
                            How to Earn Miles
                          </Link>
                        </li>
                        <li>
                          <Link to="/loyalty/redeem" className="text-gray-700 hover:text-bimanRed transition flex items-center">
                            <span className="w-6 inline-block text-bimanGreen">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                                <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
                              </svg>
                            </span>
                            Redeem Miles
                          </Link>
                        </li>
                        <li>
                          <Link to="/loyalty/partners" className="text-gray-700 hover:text-bimanRed transition flex items-center">
                            <span className="w-6 inline-block text-bimanGreen">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                              </svg>
                            </span>
                            Partner Offers
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div className="bg-bimanGold/20 p-6 rounded-lg">
                      <h3 className="text-lg font-bold text-bimanGreen mb-4">Member Login</h3>
                      <form className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Membership Number
                          </label>
                          <input 
                            type="text" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-bimanGreen focus:border-bimanGreen"
                            placeholder="Enter membership number"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                          </label>
                          <input 
                            type="password" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-bimanGreen focus:border-bimanGreen"
                            placeholder="Enter password"
                          />
                        </div>
                        <button 
                          type="submit"
                          className="w-full py-2 px-4 bg-bimanGreen text-white rounded-md hover:bg-bimanGreen/90 transition"
                        >
                          Login
                        </button>
                        <div className="flex items-center justify-between text-sm">
                          <Link to="/loyalty/forgot-password" className="text-bimanGreen hover:text-bimanRed transition">
                            Forgot Password?
                          </Link>
                          <Link to="/loyalty/join" className="text-bimanGreen hover:text-bimanRed transition">
                            Join Now
                          </Link>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden fixed inset-x-0 top-[64px] bg-white shadow-lg overflow-hidden z-40"
          >
            <div className="px-4 py-2">
              {mainMenuItems.map((item) => (
                <div key={item.key}>
                  <div 
                    className="py-3 border-b border-gray-100 flex justify-between items-center"
                    onClick={() => item.hasMegaMenu && toggleMegaMenu(item.key)}
                  >
                    <Link
                      to={item.path}
                      className={`font-medium ${
                        location.pathname === item.path ? 'text-bimanGreen' : 'text-gray-800'
                      }`}
                      onClick={(e) => item.hasMegaMenu && e.preventDefault()}
                    >
                      {item.label}
                    </Link>
                    {item.hasMegaMenu && (
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${megaMenu === item.key ? 'rotate-180' : ''}`} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </div>
                  
                  <AnimatePresence>
                    {item.hasMegaMenu && megaMenu === item.key && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-gray-50 px-4 py-3 space-y-3"
                      >
                        {item.key === 'book' && (
                          <>
                            <div className="mb-2">
                              <h4 className="font-medium text-bimanGreen mb-2">Flights</h4>
                              <ul className="space-y-2 pl-2">
                                <li><Link to="/book/flights" className="text-gray-700">Book Flight</Link></li>
                                <li><Link to="/book/flights?type=multi" className="text-gray-700">Multi-city Booking</Link></li>
                                <li><Link to="/book/group" className="text-gray-700">Group Booking</Link></li>
                              </ul>
                            </div>
                            <div className="mb-2">
                              <h4 className="font-medium text-bimanGreen mb-2">Extra Services</h4>
                              <ul className="space-y-2 pl-2">
                                <li><Link to="/book/seats" className="text-gray-700">Seat Selection</Link></li>
                                <li><Link to="/book/baggage" className="text-gray-700">Extra Baggage</Link></li>
                                <li><Link to="/book/meals" className="text-gray-700">Special Meals</Link></li>
                              </ul>
                            </div>
                          </>
                        )}
                        
                        {item.key === 'destinations' && (
                          <>
                            <div className="mb-2">
                              <h4 className="font-medium text-bimanGreen mb-2">Popular Destinations</h4>
                              <ul className="space-y-2 pl-2 grid grid-cols-2">
                                {data.destinations.filter(d => d.popular).slice(0, 6).map(dest => (
                                  <li key={dest.id}>
                                    <Link to={`/destinations/${dest.id}`} className="text-gray-700">
                                      {dest.name}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <Link 
                              to="/destinations" 
                              className="block py-2 text-center bg-bimanGreen text-white rounded-lg"
                            >
                              View All Destinations
                            </Link>
                          </>
                        )}
                        
                        {item.key === 'loyalty' && (
                          <>
                            <div className="mb-2">
                              <h4 className="font-medium text-bimanGreen mb-2">Program</h4>
                              <ul className="space-y-2 pl-2">
                                <li><Link to="/loyalty/join" className="text-gray-700">Join {data.loyaltyProgram.name}</Link></li>
                                <li><Link to="/loyalty/benefits" className="text-gray-700">Program Benefits</Link></li>
                                <li><Link to="/loyalty/tiers" className="text-gray-700">Membership Tiers</Link></li>
                              </ul>
                            </div>
                            <div className="mb-2">
                              <h4 className="font-medium text-bimanGreen mb-2">Miles</h4>
                              <ul className="space-y-2 pl-2">
                                <li><Link to="/loyalty/earn" className="text-gray-700">How to Earn Miles</Link></li>
                                <li><Link to="/loyalty/redeem" className="text-gray-700">Redeem Miles</Link></li>
                                <li><Link to="/loyalty/partners" className="text-gray-700">Partner Offers</Link></li>
                              </ul>
                            </div>
                          </>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
              
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                <button
                  onClick={toggleLanguage}
                  className="px-4 py-2 rounded-md bg-bimanGreen/10 text-bimanGreen font-medium"
                >
                  {language === 'en' ? 'বাংলা' : 'English'}
                </button>
                <Link 
                  to="/login" 
                  className="px-4 py-2 rounded-md bg-bimanGold text-bimanGreen font-medium"
                >
                  Log In
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Backdrop for mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden fixed inset-0 bg-black z-30"
            onClick={toggleMobileMenu}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;