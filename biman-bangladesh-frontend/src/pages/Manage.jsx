import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Manage = () => {
  const [data, setData] = useState(null);
  const [bookingReference, setBookingReference] = useState('');
  const [lastName, setLastName] = useState('');
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState('manage');

  useEffect(() => {
    // Load data from data.json
    import('../data.json').then((module) => setData(module.default || module));
  }, []);

  // Mock function to simulate retrieving a booking
  const retrieveBooking = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      // Create a mock booking
      setBooking({
        reference: bookingReference || 'BG123456',
        lastName: lastName || 'Smith',
        flights: [
          {
            flightNumber: 'BG123',
            origin: 'DAC',
            destination: 'LHR',
            departDate: new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
            departTime: '10:30',
            arrivalTime: '17:45',
            status: 'Confirmed',
            class: 'Economy',
            passengerCount: 2
          },
          {
            flightNumber: 'BG456',
            origin: 'LHR',
            destination: 'DAC',
            departDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
            departTime: '19:30',
            arrivalTime: '14:15',
            status: 'Confirmed',
            class: 'Economy',
            passengerCount: 2
          }
        ],
        passengers: [
          {
            name: 'John Smith',
            type: 'Adult',
            seatAssigned: false,
            checkedIn: false,
            services: []
          },
          {
            name: 'Jane Smith',
            type: 'Adult',
            seatAssigned: false,
            checkedIn: false,
            services: []
          }
        ],
        canCheckIn: true,
        canManage: true
      });
      
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };
  
  if (!data) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bimanRed"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {!isSubmitted ? (
          // Retrieve Booking Form
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Manage Your Booking</h1>
            
            <div className="flex space-x-4 border-b border-gray-200 mb-6">
              <button
                onClick={() => setActiveTab('manage')}
                className={`px-4 py-2 font-medium text-sm sm:text-base border-b-2 -mb-px ${
                  activeTab === 'manage'
                    ? 'text-bimanGreen border-bimanGreen'
                    : 'text-gray-500 border-transparent hover:text-bimanGreen'
                }`}
              >
                Manage Booking
              </button>
              <button
                onClick={() => setActiveTab('checkin')}
                className={`px-4 py-2 font-medium text-sm sm:text-base border-b-2 -mb-px ${
                  activeTab === 'checkin'
                    ? 'text-bimanGreen border-bimanGreen'
                    : 'text-gray-500 border-transparent hover:text-bimanGreen'
                }`}
              >
                Online Check-in
              </button>
            </div>
            
            <p className="text-gray-600 mb-8">
              {activeTab === 'manage' 
                ? 'Enter your booking details to view, modify, or add extras to your reservation.' 
                : 'Enter your booking details to check in online and select your seats.'}
            </p>
            
            <form onSubmit={retrieveBooking} className="max-w-md mx-auto">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Booking Reference (PNR)
                </label>
                <input
                  type="text"
                  value={bookingReference}
                  onChange={(e) => setBookingReference(e.target.value)}
                  placeholder="6-character code"
                  className="form-input w-full rounded-lg border-gray-300 shadow-sm focus:border-bimanGreen focus:ring focus:ring-bimanGreen/20 transition"
                  required
                />
              </div>
              
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name as it appears on your booking"
                  className="form-input w-full rounded-lg border-gray-300 shadow-sm focus:border-bimanGreen focus:ring focus:ring-bimanGreen/20 transition"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full px-6 py-3 bg-bimanGreen hover:bg-green-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5 ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    Retrieving Booking...
                  </div>
                ) : (
                  activeTab === 'manage' ? 'Retrieve Booking' : 'Begin Check-in'
                )}
              </button>
            </form>
            
            <div className="mt-8 border-t border-gray-200 pt-6">
              <h2 className="text-lg font-semibold mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {data.manageBookingExperience.faqs.map((faq, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-bimanGreen mb-2">{faq.question}</h3>
                    <p className="text-sm text-gray-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          // Booking Management Dashboard
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Your Booking: {booking.reference}</h1>
                  <p className="text-gray-600">Passenger name: {booking.lastName}</p>
                </div>
                <div className="mt-4 md:mt-0">
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="text-bimanGreen hover:text-bimanRed transition"
                  >
                    ← Back to search
                  </button>
                </div>
              </div>
              
              <div className="border-t border-b border-gray-200 py-4 mb-6">
                <h2 className="text-xl font-semibold mb-4">Your Flights</h2>
                {booking.flights.map((flight, index) => (
                  <div key={index} className="mb-4 last:mb-0 p-4 border border-gray-200 rounded-lg">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="flex items-center mb-4 md:mb-0">
                        <div className="bg-bimanGold/20 text-bimanGreen p-2 rounded-full mr-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-lg font-medium">{flight.flightNumber}</div>
                          <div className="text-sm text-gray-600">{flight.departDate}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center mb-4 md:mb-0">
                        <div className="text-center md:text-left">
                          <div className="flex items-center gap-2">
                            <div>
                              <div className="font-bold text-lg">{flight.departTime}</div>
                              <div className="text-sm text-gray-500">{flight.origin}</div>
                            </div>
                            <div className="flex flex-col items-center">
                              <div className="text-xs text-gray-500">Direct</div>
                              <div className="relative w-16 h-0.5 bg-gray-300 my-1">
                                <div className="absolute left-0 top-1/2 -mt-1 h-2 w-2 rounded-full bg-bimanGreen"></div>
                                <div className="absolute right-0 top-1/2 -mt-1 h-2 w-2 rounded-full bg-bimanRed"></div>
                              </div>
                            </div>
                            <div>
                              <div className="font-bold text-lg">{flight.arrivalTime}</div>
                              <div className="text-sm text-gray-500">{flight.destination}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Status</div>
                        <div className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded text-sm font-medium">
                          {flight.status}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {data.manageBookingExperience.services.map((service, index) => (
                  <div 
                    key={index}
                    className="border rounded-lg p-4 hover:border-bimanGreen hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="flex items-start mb-3">
                      <div className="bg-bimanGreen/10 p-2 rounded-lg mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-bimanGreen" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800 mb-1">{service.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                      </div>
                    </div>
                    <button className="w-full px-3 py-2 bg-bimanGreen text-white text-sm font-medium rounded hover:bg-bimanGreen/90 transition">
                      {service.ctaText}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Manage;