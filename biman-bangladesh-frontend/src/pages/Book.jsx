import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Book = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [searchParams, setSearchParams] = useState(null);
  const [selectedFlights, setSelectedFlights] = useState({ outbound: null, return: null });
  const [fareClass, setFareClass] = useState('standard');
  const [bookingStep, setBookingStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // Passenger information structure
  const [passengers, setPassengers] = useState([
    {
      type: 'adult',
      title: 'Mr',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      nationality: '',
      passportNumber: '',
      passportExpiry: '',
      email: '',
      phone: '',
      specialRequests: '',
    }
  ]);

  // Mock available flights 
  const [availableFlights, setAvailableFlights] = useState({
    outbound: [],
    return: []
  });

  // Mock fare families
  const fareFamilies = {
    basic: {
      name: 'Basic',
      price: 0, // Additional price
      features: [
        'Cabin baggage only',
        'No flight changes',
        'No refunds',
        'No seat selection'
      ],
      color: 'gray'
    },
    standard: {
      name: 'Standard',
      price: 50, // Additional price
      features: [
        '23kg checked baggage',
        'Standard seat selection',
        'Flight changes with fee',
        'Partial refund available'
      ],
      color: 'bimanGreen'
    },
    flex: {
      name: 'Flex',
      price: 120, // Additional price
      features: [
        '32kg checked baggage',
        'Premium seat selection',
        'Free flight changes',
        'Full refund available',
        'Priority check-in'
      ],
      color: 'bimanGold'
    }
  };

  useEffect(() => {
    // Load data.json
    import('../data.json').then((module) => setData(module.default || module));
    
    // Get search parameters from location state
    if (location.state?.formData) {
      setSearchParams(location.state.formData);
      
      // Generate mock available flights based on search parameters
      generateMockFlights(location.state.formData);
    }
  }, [location]);

  const generateMockFlights = (params) => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Generate outbound flights
      const outboundDate = new Date(params.departDate);
      const outboundFlights = generateFlightsForDate(params.from, params.to, outboundDate);
      
      // Generate return flights if round trip
      let returnFlights = [];
      if (params.returnDate) {
        const returnDate = new Date(params.returnDate);
        returnFlights = generateFlightsForDate(params.to, params.from, returnDate);
      }
      
      setAvailableFlights({
        outbound: outboundFlights,
        return: returnFlights
      });
      
      setIsLoading(false);
    }, 1500);
  };

  const generateFlightsForDate = (origin, destination, date) => {
    // Get day of week (0-6)
    const dayOfWeek = date.getDay();
    
    // Convert date to string
    const dateString = date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short', 
      day: 'numeric'
    });
    
    // Generate 3-5 flights for this day
    const numFlights = 3 + Math.floor(Math.random() * 3);
    const flights = [];
    
    // Morning, afternoon, evening distribution
    const timeSlots = [
      { start: 6, end: 11 },   // Morning
      { start: 12, end: 17 },  // Afternoon
      { start: 18, end: 23 }   // Evening
    ];
    
    timeSlots.forEach(slot => {
      // Generate at least one flight per time slot
      const hour = slot.start + Math.floor(Math.random() * (slot.end - slot.start));
      const minute = Math.floor(Math.random() * 12) * 5; // 0, 5, 10, 15, ... 55
      
      // Duration between 1h 30m and 8h depending on route
      const durationHours = 1 + Math.floor(Math.random() * 7);
      const durationMinutes = Math.floor(Math.random() * 12) * 5;
      
      // Format time strings
      const departTime = \`\${hour.toString().padStart(2, '0')}:\${minute.toString().padStart(2, '0')}\`;
      
      // Calculate arrival time
      const arrivalDate = new Date(date);
      arrivalDate.setHours(hour + durationHours);
      arrivalDate.setMinutes(minute + durationMinutes);
      const arrivalTime = \`\${arrivalDate.getHours().toString().padStart(2, '0')}:\${arrivalDate.getMinutes().toString().padStart(2, '0')}\`;
      
      // Check if arrival is next day
      const isNextDay = arrivalDate.getDate() !== date.getDate();
      
      // Random price between $150 and $800
      const basePrice = 150 + Math.floor(Math.random() * 650);
      
      // Aircraft types
      const aircraftTypes = ['Boeing 787-8', 'Boeing 787-9', 'Boeing 777-300ER', 'Boeing 737-800'];
      const aircraft = aircraftTypes[Math.floor(Math.random() * aircraftTypes.length)];
      
      flights.push({
        id: \`BG\${100 + Math.floor(Math.random() * 900)}\`,
        origin: origin,
        destination: destination,
        date: dateString,
        departTime: departTime,
        arrivalTime: arrivalTime,
        isNextDay: isNextDay,
        duration: \`\${durationHours}h \${durationMinutes}m\`,
        aircraft: aircraft,
        prices: {
          basic: Math.round(basePrice * 0.8),
          standard: basePrice,
          flex: Math.round(basePrice * 1.3)
        },
        seatsAvailable: 5 + Math.floor(Math.random() * 95)
      });
    });
    
    // Add a few more flights randomly distributed
    for (let i = 0; i < numFlights - 3; i++) {
      const slotIndex = Math.floor(Math.random() * 3);
      const slot = timeSlots[slotIndex];
      
      const hour = slot.start + Math.floor(Math.random() * (slot.end - slot.start));
      const minute = Math.floor(Math.random() * 12) * 5;
      
      const durationHours = 1 + Math.floor(Math.random() * 7);
      const durationMinutes = Math.floor(Math.random() * 12) * 5;
      
      const departTime = \`\${hour.toString().padStart(2, '0')}:\${minute.toString().padStart(2, '0')}\`;
      
      const arrivalDate = new Date(date);
      arrivalDate.setHours(hour + durationHours);
      arrivalDate.setMinutes(minute + durationMinutes);
      const arrivalTime = \`\${arrivalDate.getHours().toString().padStart(2, '0')}:\${arrivalDate.getMinutes().toString().padStart(2, '0')}\`;
      
      const isNextDay = arrivalDate.getDate() !== date.getDate();
      
      const basePrice = 150 + Math.floor(Math.random() * 650);
      
      const aircraftTypes = ['Boeing 787-8', 'Boeing 787-9', 'Boeing 777-300ER', 'Boeing 737-800'];
      const aircraft = aircraftTypes[Math.floor(Math.random() * aircraftTypes.length)];
      
      flights.push({
        id: \`BG\${100 + Math.floor(Math.random() * 900)}\`,
        origin: origin,
        destination: destination,
        date: dateString,
        departTime: departTime,
        arrivalTime: arrivalTime,
        isNextDay: isNextDay,
        duration: \`\${durationHours}h \${durationMinutes}m\`,
        aircraft: aircraft,
        prices: {
          basic: Math.round(basePrice * 0.8),
          standard: basePrice,
          flex: Math.round(basePrice * 1.3)
        },
        seatsAvailable: 5 + Math.floor(Math.random() * 95)
      });
    }
    
    // Sort by departure time
    flights.sort((a, b) => {
      const [aHour, aMinute] = a.departTime.split(':').map(Number);
      const [bHour, bMinute] = b.departTime.split(':').map(Number);
      
      if (aHour !== bHour) return aHour - bHour;
      return aMinute - bMinute;
    });
    
    return flights;
  };

  const selectFlight = (flight, direction) => {
    setSelectedFlights(prev => ({
      ...prev,
      [direction]: flight
    }));
    
    // If outbound flight is selected and it's a round trip
    if (direction === 'outbound' && availableFlights.return.length > 0) {
      // Don't advance to next step yet
    } else {
      // Move to next step (passenger information)
      setBookingStep(2);
    }
  };

  const handlePassengerChange = (index, field, value) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index] = {
      ...updatedPassengers[index],
      [field]: value
    };
    setPassengers(updatedPassengers);
  };

  const addPassenger = () => {
    setPassengers([...passengers, {
      type: 'adult',
      title: 'Mr',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      nationality: '',
      passportNumber: '',
      passportExpiry: '',
      email: '',
      phone: '',
      specialRequests: '',
    }]);
  };

  const removePassenger = (index) => {
    if (passengers.length > 1) {
      const updatedPassengers = passengers.filter((_, i) => i !== index);
      setPassengers(updatedPassengers);
    }
  };

  const proceedToPayment = () => {
    setBookingStep(3);
  };

  const completeBooking = () => {
    // In a real app, submit payment and create booking
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      navigate('/booking-confirmation', { 
        state: { 
          bookingReference: 'BG' + Math.random().toString(36).substring(2, 8).toUpperCase(),
          flights: selectedFlights,
          passengers,
          fareClass
        } 
      });
    }, 2000);
  };

  const getTotalPrice = () => {
    if (!selectedFlights.outbound) return 0;
    
    const outboundPrice = selectedFlights.outbound.prices[fareClass];
    const returnPrice = selectedFlights.return ? selectedFlights.return.prices[fareClass] : 0;
    
    return (outboundPrice + returnPrice) * passengers.length;
  };

  if (!data || !searchParams) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bimanRed"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4">
      <div className="container mx-auto">
        {/* Booking Steps */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0">Book Your Flight</h1>
            <div className="flex items-center space-x-2 md:space-x-4">
              <div className={`flex items-center ${bookingStep >= 1 ? 'text-bimanGreen' : 'text-gray-400'}`}>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-2 ${bookingStep >= 1 ? 'bg-bimanGreen text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
                <span className="hidden md:inline font-medium">Select Flights</span>
              </div>
              <div className="w-8 h-0.5 bg-gray-300"></div>
              <div className={`flex items-center ${bookingStep >= 2 ? 'text-bimanGreen' : 'text-gray-400'}`}>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-2 ${bookingStep >= 2 ? 'bg-bimanGreen text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
                <span className="hidden md:inline font-medium">Passenger Details</span>
              </div>
              <div className="w-8 h-0.5 bg-gray-300"></div>
              <div className={`flex items-center ${bookingStep >= 3 ? 'text-bimanGreen' : 'text-gray-400'}`}>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-2 ${bookingStep >= 3 ? 'bg-bimanGreen text-white' : 'bg-gray-200 text-gray-500'}`}>3</div>
                <span className="hidden md:inline font-medium">Payment</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search Summary */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-sm text-gray-500">From</div>
              <div className="font-bold text-lg">{searchParams.from}</div>
            </div>
            <div className="hidden md:block">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-bimanGreen" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="md:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-bimanGreen transform rotate-90" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <div className="text-sm text-gray-500">To</div>
              <div className="font-bold text-lg">{searchParams.to}</div>
            </div>
            <div className="h-10 w-px bg-gray-300 hidden lg:block"></div>
            <div>
              <div className="text-sm text-gray-500">Depart</div>
              <div className="font-bold">{new Date(searchParams.departDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
            </div>
            {searchParams.returnDate && (
              <>
                <div className="h-10 w-px bg-gray-300 hidden lg:block"></div>
                <div>
                  <div className="text-sm text-gray-500">Return</div>
                  <div className="font-bold">{new Date(searchParams.returnDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                </div>
              </>
            )}
            <div className="h-10 w-px bg-gray-300 hidden lg:block"></div>
            <div>
              <div className="text-sm text-gray-500">Passengers</div>
              <div className="font-bold">{searchParams.passengers} {parseInt(searchParams.passengers) === 1 ? 'Passenger' : 'Passengers'}</div>
            </div>
            <div className="h-10 w-px bg-gray-300 hidden lg:block"></div>
            <div>
              <div className="text-sm text-gray-500">Class</div>
              <div className="font-bold capitalize">{searchParams.class}</div>
            </div>
            <button 
              onClick={() => navigate('/')} 
              className="text-bimanGreen hover:text-bimanRed transition flex items-center text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Modify
            </button>
          </div>
        </div>

        {bookingStep === 1 && (
          /* Flight Selection */
          <div className="space-y-8">
            {/* Fare Family Selection */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Select Fare Type</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(fareFamilies).map(([key, family]) => (
                  <div 
                    key={key}
                    onClick={() => setFareClass(key)}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      fareClass === key 
                        ? `border-${family.color} bg-${family.color}/5` 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className={`font-bold text-lg ${fareClass === key ? `text-${family.color}` : 'text-gray-800'}`}>{family.name}</h3>
                      <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                        fareClass === key 
                          ? `border-${family.color}` 
                          : 'border-gray-400'
                      }`}>
                        {fareClass === key && (
                          <div className={`h-3 w-3 rounded-full bg-${family.color}`}></div>
                        )}
                      </div>
                    </div>
                    <ul className="space-y-2 text-sm mb-4">
                      {family.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    {family.price > 0 ? (
                      <div className="font-medium text-right">+${family.price}</div>
                    ) : (
                      <div className="font-medium text-right">Base fare</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Outbound Flights */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Select Outbound Flight: {searchParams.from} to {searchParams.to}
              </h2>
              
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bimanGreen"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {availableFlights.outbound.map(flight => (
                    <div 
                      key={flight.id}
                      onClick={() => selectFlight(flight, 'outbound')}
                      className={`border rounded-lg p-4 hover:border-bimanGreen hover:shadow-md transition-all cursor-pointer ${
                        selectedFlights.outbound?.id === flight.id ? 'border-bimanGreen bg-bimanGreen/5' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-4 md:mb-0">
                          <div className="text-sm text-gray-500 mb-1">Flight</div>
                          <div className="font-bold">{flight.id}</div>
                          <div className="text-sm text-gray-500">{flight.aircraft}</div>
                        </div>
                        
                        <div className="text-center mb-4 md:mb-0">
                          <div className="flex items-center gap-2">
                            <div>
                              <div className="font-bold text-lg">{flight.departTime}</div>
                              <div className="text-sm text-gray-500">{flight.origin}</div>
                            </div>
                            <div className="flex flex-col items-center">
                              <div className="text-xs text-gray-500">{flight.duration}</div>
                              <div className="relative w-20 h-0.5 bg-gray-300 my-1">
                                <div className="absolute left-0 top-1/2 -mt-1 h-2 w-2 rounded-full bg-bimanGreen"></div>
                                <div className="absolute right-0 top-1/2 -mt-1 h-2 w-2 rounded-full bg-bimanRed"></div>
                              </div>
                              <div className="text-xs text-gray-500">Direct</div>
                            </div>
                            <div>
                              <div className="font-bold text-lg">
                                {flight.arrivalTime}
                                {flight.isNextDay && <span className="text-xs text-bimanRed ml-1">+1</span>}
                              </div>
                              <div className="text-sm text-gray-500">{flight.destination}</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mb-4 md:mb-0">
                          <div className="text-sm text-gray-500 mb-1">Seats</div>
                          <div className={`font-medium ${flight.seatsAvailable < 10 ? 'text-bimanRed' : 'text-green-600'}`}>
                            {flight.seatsAvailable} left
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-sm text-gray-500 mb-1">Fare</div>
                          <div className="font-bold text-lg text-bimanGreen">${flight.prices[fareClass]}</div>
                          <div className="text-xs text-gray-500">per passenger</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Return Flights if applicable */}
            {searchParams.returnDate && availableFlights.return.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Select Return Flight: {searchParams.to} to {searchParams.from}
                </h2>
                
                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bimanGreen"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {availableFlights.return.map(flight => (
                      <div 
                        key={flight.id}
                        onClick={() => selectFlight(flight, 'return')}
                        className={`border rounded-lg p-4 hover:border-bimanGreen hover:shadow-md transition-all cursor-pointer ${
                          selectedFlights.return?.id === flight.id ? 'border-bimanGreen bg-bimanGreen/5' : 'border-gray-200'
                        }`}
                      >
                        <div className="flex flex-col md:flex-row justify-between items-center">
                          <div className="mb-4 md:mb-0">
                            <div className="text-sm text-gray-500 mb-1">Flight</div>
                            <div className="font-bold">{flight.id}</div>
                            <div className="text-sm text-gray-500">{flight.aircraft}</div>
                          </div>
                          
                          <div className="text-center mb-4 md:mb-0">
                            <div className="flex items-center gap-2">
                              <div>
                                <div className="font-bold text-lg">{flight.departTime}</div>
                                <div className="text-sm text-gray-500">{flight.origin}</div>
                              </div>
                              <div className="flex flex-col items-center">
                                <div className="text-xs text-gray-500">{flight.duration}</div>
                                <div className="relative w-20 h-0.5 bg-gray-300 my-1">
                                  <div className="absolute left-0 top-1/2 -mt-1 h-2 w-2 rounded-full bg-bimanGreen"></div>
                                  <div className="absolute right-0 top-1/2 -mt-1 h-2 w-2 rounded-full bg-bimanRed"></div>
                                </div>
                                <div className="text-xs text-gray-500">Direct</div>
                              </div>
                              <div>
                                <div className="font-bold text-lg">
                                  {flight.arrivalTime}
                                  {flight.isNextDay && <span className="text-xs text-bimanRed ml-1">+1</span>}
                                </div>
                                <div className="text-sm text-gray-500">{flight.destination}</div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mb-4 md:mb-0">
                            <div className="text-sm text-gray-500 mb-1">Seats</div>
                            <div className={`font-medium ${flight.seatsAvailable < 10 ? 'text-bimanRed' : 'text-green-600'}`}>
                              {flight.seatsAvailable} left
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-sm text-gray-500 mb-1">Fare</div>
                            <div className="font-bold text-lg text-bimanGreen">${flight.prices[fareClass]}</div>
                            <div className="text-xs text-gray-500">per passenger</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {bookingStep === 2 && (
          /* Passenger Information */
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Passenger Details</h2>
            
            <div className="space-y-8">
              {passengers.map((passenger, index) => (
                <div key={index} className="border-b border-gray-200 pb-8 last:border-0">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Passenger {index + 1}</h3>
                    {passengers.length > 1 && (
                      <button 
                        onClick={() => removePassenger(index)}
                        className="text-bimanRed hover:text-red-700 flex items-center text-sm"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Remove
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Passenger Type</label>
                      <select
                        value={passenger.type}
                        onChange={(e) => handlePassengerChange(index, 'type', e.target.value)}
                        className="form-select w-full rounded-lg border-gray-300 shadow-sm focus:border-bimanGreen focus:ring focus:ring-bimanGreen/20 transition"
                      >
                        <option value="adult">Adult (12+ years)</option>
                        <option value="child">Child (2-11 years)</option>
                        <option value="infant">Infant (under 2 years)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <select
                        value={passenger.title}
                        onChange={(e) => handlePassengerChange(index, 'title', e.target.value)}
                        className="form-select w-full rounded-lg border-gray-300 shadow-sm focus:border-bimanGreen focus:ring focus:ring-bimanGreen/20 transition"
                      >
                        <option value="Mr">Mr</option>
                        <option value="Mrs">Mrs</option>
                        <option value="Ms">Ms</option>
                        <option value="Dr">Dr</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name (as in passport)</label>
                      <input
                        type="text"
                        value={passenger.firstName}
                        onChange={(e) => handlePassengerChange(index, 'firstName', e.target.value)}
                        className="form-input w-full rounded-lg border-gray-300 shadow-sm focus:border-bimanGreen focus:ring focus:ring-bimanGreen/20 transition"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name (as in passport)</label>
                      <input
                        type="text"
                        value={passenger.lastName}
                        onChange={(e) => handlePassengerChange(index, 'lastName', e.target.value)}
                        className="form-input w-full rounded-lg border-gray-300 shadow-sm focus:border-bimanGreen focus:ring focus:ring-bimanGreen/20 transition"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                      <input
                        type="date"
                        value={passenger.dateOfBirth}
                        onChange={(e) => handlePassengerChange(index, 'dateOfBirth', e.target.value)}
                        className="form-input w-full rounded-lg border-gray-300 shadow-sm focus:border-bimanGreen focus:ring focus:ring-bimanGreen/20 transition"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                      <input
                        type="text"
                        value={passenger.nationality}
                        onChange={(e) => handlePassengerChange(index, 'nationality', e.target.value)}
                        className="form-input w-full rounded-lg border-gray-300 shadow-sm focus:border-bimanGreen focus:ring focus:ring-bimanGreen/20 transition"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Passport Number</label>
                      <input
                        type="text"
                        value={passenger.passportNumber}
                        onChange={(e) => handlePassengerChange(index, 'passportNumber', e.target.value)}
                        className="form-input w-full rounded-lg border-gray-300 shadow-sm focus:border-bimanGreen focus:ring focus:ring-bimanGreen/20 transition"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Passport Expiry Date</label>
                      <input
                        type="date"
                        value={passenger.passportExpiry}
                        onChange={(e) => handlePassengerChange(index, 'passportExpiry', e.target.value)}
                        className="form-input w-full rounded-lg border-gray-300 shadow-sm focus:border-bimanGreen focus:ring focus:ring-bimanGreen/20 transition"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={passenger.email}
                        onChange={(e) => handlePassengerChange(index, 'email', e.target.value)}
                        className="form-input w-full rounded-lg border-gray-300 shadow-sm focus:border-bimanGreen focus:ring focus:ring-bimanGreen/20 transition"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={passenger.phone}
                        onChange={(e) => handlePassengerChange(index, 'phone', e.target.value)}
                        className="form-input w-full rounded-lg border-gray-300 shadow-sm focus:border-bimanGreen focus:ring focus:ring-bimanGreen/20 transition"
                        required
                      />
                    </div>
                    
                    <div className="md:col-span-2 lg:col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests (optional)</label>
                      <textarea
                        value={passenger.specialRequests}
                        onChange={(e) => handlePassengerChange(index, 'specialRequests', e.target.value)}
                        rows="3"
                        className="form-textarea w-full rounded-lg border-gray-300 shadow-sm focus:border-bimanGreen focus:ring focus:ring-bimanGreen/20 transition"
                        placeholder="Wheelchair assistance, special meals, etc."
                      ></textarea>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="flex justify-between items-center">
                <button
                  onClick={addPassenger}
                  className="flex items-center text-bimanGreen hover:text-bimanGreen/80 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add Another Passenger
                </button>
                
                <button
                  onClick={proceedToPayment}
                  className="px-6 py-3 bg-bimanGreen hover:bg-green-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5"
                >
                  Continue to Payment
                </button>
              </div>
            </div>
          </div>
        )}

        {bookingStep === 3 && (
          /* Payment */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Payment Details</h2>
                
                <div className="mb-6">
                  <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="card"
                        name="paymentMethod"
                        checked
                        className="form-radio text-bimanGreen h-5 w-5"
                      />
                      <label htmlFor="card" className="ml-2 text-gray-700">Credit/Debit Card</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="paypal"
                        name="paymentMethod"
                        className="form-radio text-bimanGreen h-5 w-5"
                      />
                      <label htmlFor="paypal" className="ml-2 text-gray-700">PayPal</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="bkash"
                        name="paymentMethod"
                        className="form-radio text-bimanGreen h-5 w-5"
                      />
                      <label htmlFor="bkash" className="ml-2 text-gray-700">bKash</label>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    <img src="https://placehold.co/45x30/D71920/ffffff?text=VISA" alt="Visa" className="h-8 rounded" />
                    <img src="https://placehold.co/45x30/006A4E/ffffff?text=MC" alt="MasterCard" className="h-8 rounded" />
                    <img src="https://placehold.co/45x30/FFD700/006A4E?text=AMEX" alt="American Express" className="h-8 rounded" />
                    <img src="https://placehold.co/45x30/ffffff/000000?text=PayPal" alt="PayPal" className="h-8 rounded" />
                    <img src="https://placehold.co/45x30/D71920/ffffff?text=bKash" alt="bKash" className="h-8 rounded" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                      <input
                        type="text"
                        placeholder="XXXX XXXX XXXX XXXX"
                        className="form-input w-full rounded-lg border-gray-300 shadow-sm focus:border-bimanGreen focus:ring focus:ring-bimanGreen/20 transition"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                      <input
                        type="text"
                        placeholder="Name as it appears on card"
                        className="form-input w-full rounded-lg border-gray-300 shadow-sm focus:border-bimanGreen focus:ring focus:ring-bimanGreen/20 transition"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="form-input w-full rounded-lg border-gray-300 shadow-sm focus:border-bimanGreen focus:ring focus:ring-bimanGreen/20 transition"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                        <input
                          type="text"
                          placeholder="123"
                          className="form-input w-full rounded-lg border-gray-300 shadow-sm focus:border-bimanGreen focus:ring focus:ring-bimanGreen/20 transition"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Billing Address</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
                      <input
                        type="text"
                        className="form-input w-full rounded-lg border-gray-300 shadow-sm focus:border-bimanGreen focus:ring focus:ring-bimanGreen/20 transition"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2 (optional)</label>
                      <input
                        type="text"
                        className="form-input w-full rounded-lg border-gray-300 shadow-sm focus:border-bimanGreen focus:ring focus:ring-bimanGreen/20 transition"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        className="form-input w-full rounded-lg border-gray-300 shadow-sm focus:border-bimanGreen focus:ring focus:ring-bimanGreen/20 transition"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                      <input
                        type="text"
                        className="form-input w-full rounded-lg border-gray-300 shadow-sm focus:border-bimanGreen focus:ring focus:ring-bimanGreen/20 transition"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State/Province</label>
                      <input
                        type="text"
                        className="form-input w-full rounded-lg border-gray-300 shadow-sm focus:border-bimanGreen focus:ring focus:ring-bimanGreen/20 transition"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Postal/ZIP Code</label>
                      <input
                        type="text"
                        className="form-input w-full rounded-lg border-gray-300 shadow-sm focus:border-bimanGreen focus:ring focus:ring-bimanGreen/20 transition"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Booking Summary</h2>
                
                <div className="mb-6">
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="font-medium">{selectedFlights.outbound?.id}</span>
                    <span className="text-gray-600">{selectedFlights.outbound?.date}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">From</span>
                    <span>{searchParams.from}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">To</span>
                    <span>{searchParams.to}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Departure</span>
                    <span>{selectedFlights.outbound?.departTime}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Arrival</span>
                    <span>
                      {selectedFlights.outbound?.arrivalTime}
                      {selectedFlights.outbound?.isNextDay && <span className="text-xs text-bimanRed ml-1">+1</span>}
                    </span>
                  </div>
                </div>
                
                {selectedFlights.return && (
                  <div className="mb-6">
                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                      <span className="font-medium">{selectedFlights.return?.id}</span>
                      <span className="text-gray-600">{selectedFlights.return?.date}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">From</span>
                      <span>{searchParams.to}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">To</span>
                      <span>{searchParams.from}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Departure</span>
                      <span>{selectedFlights.return?.departTime}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Arrival</span>
                      <span>
                        {selectedFlights.return?.arrivalTime}
                        {selectedFlights.return?.isNextDay && <span className="text-xs text-bimanRed ml-1">+1</span>}
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="mb-6">
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="font-medium">Price Details</span>
                    <span className="text-sm text-gray-600">
                      {passengers.length} {passengers.length === 1 ? 'passenger' : 'passengers'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Base fare</span>
                    <span>${selectedFlights.outbound?.prices[fareClass] || 0}</span>
                  </div>
                  
                  {selectedFlights.return && (
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Return fare</span>
                      <span>${selectedFlights.return?.prices[fareClass] || 0}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Taxes & Fees</span>
                    <span>${Math.round(getTotalPrice() * 0.12)}</span>
                  </div>
                  
                  <div className="flex justify-between py-3 border-t border-gray-200 font-bold text-lg">
                    <span>Total</span>
                    <span>${getTotalPrice() + Math.round(getTotalPrice() * 0.12)}</span>
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-start bg-bimanGreen/5 p-3 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-bimanGreen flex-shrink-0 mt-0.5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div className="text-sm text-gray-600">
                      <div className="font-medium text-gray-800">Your booking is secure</div>
                      <p>We use industry-standard encryption to protect your personal information.</p>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={completeBooking}
                  disabled={isLoading}
                  className={`w-full px-6 py-3 bg-bimanRed hover:bg-red-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    'Complete Booking'
                  )}
                </button>
                
                <p className="text-xs text-gray-500 text-center mt-4">
                  By clicking "Complete Booking", you agree to our Terms & Conditions and Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Book;