import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [data, setData] = useState(null);
  const [subscribeEmail, setSubscribeEmail] = useState('');
  
  useEffect(() => {
    import('../data.json').then((module) => setData(module.default || module));
  }, []);

  if (!data) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would dispatch this to a subscription handler
    console.log('Subscribing email:', subscribeEmail);
    alert('Thank you for subscribing to our newsletter!');
    setSubscribeEmail('');
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-bimanGreen to-bimanGreen/90 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: About */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <img 
                src="/logo.png" 
                alt="Biman Bangladesh Airlines" 
                className="h-12 w-auto" 
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = 'https://placehold.co/200x80/D71920/ffffff?text=BIMAN';
                }}
              />
              <span className="font-bold text-xl tracking-tight">
                Biman <span className="hidden sm:inline">Bangladesh</span>
              </span>
            </div>
            <p className="text-white/80 mb-4">
              Biman Bangladesh Airlines is the national flag carrier of Bangladesh, connecting the country to destinations around the world. Experience the warmth of Bengali hospitality in the sky.
            </p>
            <div className="flex space-x-3 mb-6">
              {Object.entries(data.contact.socialMedia).map(([platform, url]) => (
                <a 
                  key={platform} 
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-bimanGold hover:text-bimanGreen transition-colors"
                  aria-label={`Follow us on ${platform}`}
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
            
            <div className="space-y-2">
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 text-bimanGold" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" clipRule="evenodd" />
                  <path d="M10 5a1 1 0 011 1v3.586l2.707 2.707a1 1 0 01-1.414 1.414l-3-3A1 1 0 019 10V6a1 1 0 011-1z" />
                </svg>
                <span className="text-white/80">{data.contact.customerService.hours} (GMT+6)</span>
              </div>
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 text-bimanGold" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span className="text-white/80">{data.contact.customerService.phone}</span>
              </div>
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 text-bimanGold" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <a href={`mailto:${data.contact.customerService.email}`} className="text-white/80 hover:text-white">
                  {data.contact.customerService.email}
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-bimanGold" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
              </svg>
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/book" className="text-white/80 hover:text-white hover:translate-x-1 transition-transform duration-200 inline-block">
                  Book a Flight
                </Link>
              </li>
              <li>
                <Link to="/check-in" className="text-white/80 hover:text-white hover:translate-x-1 transition-transform duration-200 inline-block">
                  Web Check-in
                </Link>
              </li>
              <li>
                <Link to="/flight-status" className="text-white/80 hover:text-white hover:translate-x-1 transition-transform duration-200 inline-block">
                  Flight Status
                </Link>
              </li>
              <li>
                <Link to="/manage" className="text-white/80 hover:text-white hover:translate-x-1 transition-transform duration-200 inline-block">
                  Manage Booking
                </Link>
              </li>
              <li>
                <Link to="/loyalty/join" className="text-white/80 hover:text-white hover:translate-x-1 transition-transform duration-200 inline-block">
                  Join {data.loyaltyProgram.name}
                </Link>
              </li>
              <li>
                <Link to="/baggage" className="text-white/80 hover:text-white hover:translate-x-1 transition-transform duration-200 inline-block">
                  Baggage Information
                </Link>
              </li>
              <li>
                <Link to="/special-assistance" className="text-white/80 hover:text-white hover:translate-x-1 transition-transform duration-200 inline-block">
                  Special Assistance
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="text-white/80 hover:text-white hover:translate-x-1 transition-transform duration-200 inline-block">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Destinations */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-bimanGold" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              Popular Destinations
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {data.destinations.filter(d => d.popular).slice(0, 8).map(dest => (
                <Link 
                  key={dest.id} 
                  to={`/destinations/${dest.id}`} 
                  className="text-white/80 hover:text-white hover:translate-x-1 transition-transform duration-200 inline-block"
                >
                  {dest.name}
                </Link>
              ))}
            </div>
            <Link 
              to="/destinations" 
              className="inline-block mt-4 text-bimanGold hover:text-white transition"
            >
              View all destinations →
            </Link>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-bimanGold" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              Newsletter
            </h3>
            <p className="text-white/80 mb-4">
              Subscribe to our newsletter to receive exclusive offers, travel tips, and the latest updates.
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-bimanGold"
                  placeholder="Your email address"
                  value={subscribeEmail}
                  onChange={(e) => setSubscribeEmail(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-bimanGold hover:bg-bimanGold/90 text-bimanGreen font-bold py-3 px-4 rounded-lg transition"
              >
                Subscribe
              </button>
            </form>
            <p className="text-xs text-white/60 mt-3">
              By subscribing, you agree to our Privacy Policy and consent to receive marketing communications.
            </p>
          </div>
        </div>
      </div>

      {/* Mobile App Section */}
      <div className="bg-white/10 py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-6 md:mb-0">
              <h3 className="text-xl font-bold mb-2">Download Our Mobile App</h3>
              <p className="text-white/80 max-w-md">
                Book flights, check in, access boarding passes, and track your flights on the go.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#" className="flex items-center bg-black/80 hover:bg-black text-white px-4 py-2 rounded-lg transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.5575 1.0034L12.0722 6.4887L16.4576 10.874L5.53429 21.7974C4.77566 21.4341 4.11438 20.8929 3.60306 20.2255C2.38605 18.6654 1.92168 16.6684 2.31601 14.7471C2.71034 12.8259 3.92736 11.1396 5.64366 10.0488L15.115 0.577479C15.8736 0.250312 16.7055 0.250312 17.4641 0.577479C17.4969 0.577479 17.5246 0.608403 17.5575 0.641041C17.5899 0.673664 17.6177 0.701343 17.6459 0.72951C17.8856 0.969238 17.9736 1.2981 17.8856 1.62695C17.8305 1.44499 17.7148 1.15427 17.5575 1.0034ZM19.6063 4.65547L18.1203 6.14144L21.7055 9.72666C21.5483 10.8174 21.1813 11.877 20.658 12.83C19.8553 14.2701 18.7037 15.5149 17.2967 16.4994C16.8254 16.8282 16.3321 17.1351 15.8193 17.4145L12.0722 21.1616C12.5295 21.4299 13.0426 21.5913 13.5697 21.6355C15.115 21.7235 16.6052 21.2151 17.7629 20.2255C18.5205 19.5902 19.1049 18.7905 19.4706 17.891C19.8364 16.9915 19.9739 16.0188 19.8718 15.0563C19.8107 14.5207 19.6889 13.9951 19.5091 13.4911L21.7055 11.2947C22.362 10.6382 22.7563 9.76633 22.8443 8.80482C22.9322 7.84331 22.6748 6.88182 22.1665 6.0951C21.5483 5.13358 20.6691 4.35781 19.6063 4.65547Z" />
                </svg>
                <div>
                  <div className="text-xs">Download on the</div>
                  <div className="text-sm font-bold">App Store</div>
                </div>
              </a>
              <a href="#" className="flex items-center bg-black/80 hover:bg-black text-white px-4 py-2 rounded-lg transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.9281 10.8916C20.9519 11.2378 20.9519 11.5841 20.9519 11.9303C20.9519 16.4767 17.5697 20.4412 12.286 20.4412C10.3757 20.4412 8.61186 19.8703 7.144 18.8996C7.43638 18.9353 7.70487 18.947 7.99966 18.947C9.55177 18.947 10.9849 18.3998 12.1224 17.4886C10.6641 17.453 9.41646 16.4767 8.99416 15.1268C9.21807 15.1624 9.44198 15.187 9.6778 15.187C10.0073 15.187 10.3367 15.1387 10.6423 15.0538C9.13056 14.7551 8.00695 13.4172 8.00695 11.8124V11.7649C8.45193 12.0161 8.96984 12.1723 9.52193 12.1961C8.64042 11.6014 8.0549 10.5595 8.0549 9.39366C8.0549 8.77622 8.21056 8.20586 8.49097 7.70622C10.1096 9.68596 12.5042 10.9882 15.1865 11.1444C15.1272 10.8933 15.0915 10.6301 15.0915 10.367C15.0915 8.54974 16.5618 7.0676 18.3683 7.0676C19.3094 7.0676 20.1575 7.47164 20.7451 8.13034C21.4733 7.97467 22.1778 7.69427 22.7992 7.31293C22.548 8.10663 22.0301 8.77623 21.3494 9.20962C22.0063 9.13141 22.6513 8.94204 23.2439 8.68465C22.7992 9.36615 22.2234 9.97249 21.5783 10.4721C21.5902 10.6121 21.5902 10.7517 21.5902 10.8916H20.9281ZM12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" />
                </svg>
                <div>
                  <div className="text-xs">GET IT ON</div>
                  <div className="text-sm font-bold">Google Play</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-white/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-white/80 text-sm">
                &copy; {currentYear} Biman Bangladesh Airlines. All rights reserved.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link to="/privacy-policy" className="text-white/80 hover:text-white transition">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-white/80 hover:text-white transition">
                Terms & Conditions
              </Link>
              <Link to="/legal" className="text-white/80 hover:text-white transition">
                Legal
              </Link>
              <Link to="/accessibility" className="text-white/80 hover:text-white transition">
                Accessibility
              </Link>
              <Link to="/sitemap" className="text-white/80 hover:text-white transition">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;