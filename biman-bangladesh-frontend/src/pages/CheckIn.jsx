import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CheckIn = () => {
  const [data, setData] = useState(null);
  const [bookingReference, setBookingReference] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [booking, setBooking] = useState(null);
  const [activeStep, setActiveStep] = useState(1);
  const [selectedSeats, setSelectedSeats] = useState({});
  const [checkInCompleted, setCheckInCompleted] = useState(false);
  
  useEffect(() => {
    import('../data.json').then((module) => setData(module.default || module));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      // Generate mock booking data
      generateMockBooking();
      setIsLoading(false);
      setActiveStep(2);
    }, 1500);
  };

  const generateMockBooking = () => {
    // Create a mock flight booking
    const flightDate = new Date();
    flightDate.setDate(flightDate.getDate() + 2); // Flight in 2 days
    
    const formattedDate = flightDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    
    // Random flight number
    const flightNumber = 'BG' + (100 + Math.floor(Math.random() * 900));
    
    // Random aircraft
    const aircraftTypes = ['Boeing 787-8', 'Boeing 787-9', 'Boeing 777-300ER', 'Boeing 737-800'];
    const aircraft = aircraftTypes[Math.floor(Math.random() * aircraftTypes.length)];
    
    // Flight times
    const hour = 6 + Math.floor(Math.random() * 16); // 6 AM to 10 PM
    const minute = Math.floor(Math.random() * 12) * 5; // 0, 5, 10, 15, ... 55
    const departureTime = hour.toString().padStart(2, '0') + ':' + minute.toString().padStart(2, '0');
    
    // Flight duration
    const durationHours = 1 + Math.floor(Math.random() * 12); // 1-13 hours
    const durationMinutes = Math.floor(Math.random() * 12) * 5; // 0, 5, 10, ... 55
    
    // Calculate arrival time
    const arrivalDate = new Date(flightDate);
    arrivalDate.setHours(hour + durationHours);
    arrivalDate.setMinutes(minute + durationMinutes);
    const arrivalTime = arrivalDate.getHours().toString().padStart(2, '0') + ':' + arrivalDate.getMinutes().toString().padStart(2, '0');
    
    // Is arrival next day?
    const isNextDay = arrivalDate.getDate() !== flightDate.getDate();
    
    // Mock passengers
    const mockPassengers = [
      {
        id: 1,
        firstName: 'John',
        lastName: lastName || 'Smith',
        gender: 'Male',
        dateOfBirth: '1985-05-15',
        nationality: 'Bangladesh',
        passportNumber: 'AB1234567',
        ticketNumber: '123-4567890123',
        seatAssigned: 'Not assigned',
        checkedIn: false,
        class: 'Economy'
      },
      {
        id: 2,
        firstName: 'Sarah',
        lastName: lastName || 'Smith',
        gender: 'Female',
        dateOfBirth: '1988-09-23',
        nationality: 'Bangladesh',
        passportNumber: 'CD9876543',
        ticketNumber: '123-4567890124',
        seatAssigned: 'Not assigned',
        checkedIn: false,
        class: 'Economy'
      }
    ];
    
    // Generate seat map
    const seatMap = generateSeatMap();
    
    setBooking({
      pnr: bookingReference || 'ABC123',
      status: 'Confirmed',
      flight: {
        number: flightNumber,
        date: formattedDate,
        origin: 'DAC',
        destination: 'LHR',
        departureTime,
        arrivalTime,
        isNextDay,
        aircraft,
        departureTerminal: '1',
        departureGate: 'G' + (Math.floor(Math.random() * 30) + 1),
        originAirport: 'Hazrat Shahjalal International Airport',
        destinationAirport: 'London Heathrow Airport',
        duration: durationHours + 'h ' + durationMinutes + 'm'
      },
      passengers: mockPassengers,
      seatMap
    });
  };

  const generateSeatMap = () => {
    // Create a mock seat map with random occupancy
    const rows = 30;
    const columns = ['A', 'B', 'C', 'D', 'E', 'F'];
    const seatMap = [];
    
    for (let row = 1; row <= rows; row++) {
      const rowSeats = [];
      
      // Exit rows (emergency exits)
      const isExitRow = row === 12 || row === 13;
      
      for (let col = 0; col < columns.length; col++) {
        const seat = {
          id: row + columns[col],
          row,
          column: columns[col],
          type: isExitRow ? 'exit' : 'standard',
          occupied: Math.random() < 0.3, // 30% chance of being occupied
          price: isExitRow ? 25 : (row < 10 ? 15 : 0) // Exit rows and front rows cost extra
        };
        
        // Middle column divider (aisle)
        if (col === 2) {
          rowSeats.push({ type: 'aisle' });
        }
        
        rowSeats.push(seat);
      }
      
      seatMap.push(rowSeats);
    }
    
    return seatMap;
  };

  const selectSeat = (passengerId, seatId) => {
    if (!booking) return;
    
    // Update selected seats
    setSelectedSeats(prev => ({
      ...prev,
      [passengerId]: seatId
    }));
    
    // Update passenger seat assignment
    setBooking(prev => ({
      ...prev,
      passengers: prev.passengers.map(passenger => 
        passenger.id === passengerId
          ? { ...passenger, seatAssigned: seatId }
          : passenger
      )
    }));
  };

  const isSeatSelected = (seatId) => {
    return Object.values(selectedSeats).includes(seatId);
  };

  const completeSeatSelection = () => {
    setActiveStep(3);
  };

  const completeCheckIn = () => {
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      // Update passenger check-in status
      setBooking(prev => ({
        ...prev,
        passengers: prev.passengers.map(passenger => ({
          ...passenger,
          checkedIn: true
        }))
      }));
      
      setIsLoading(false);
      setCheckInCompleted(true);
      setActiveStep(4);
    }, 1500);
  };

  const getSeatColorClass = (seat) => {
    if (isSeatSelected(seat.id)) return 'bg-bimanGreen text-white';
    if (seat.occupied) return 'bg-gray-300 text-gray-500 cursor-not-allowed';
    if (seat.type === 'exit') return 'bg-indigo-100 text-gray-700 hover:bg-indigo-200';
    if (seat.price > 0) return 'bg-blue-50 text-gray-700 hover:bg-blue-100';
    return 'bg-gray-100 text-gray-700 hover:bg-gray-200';
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
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden mb-8"
        >
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Online Check-In</h1>
            <p className="text-gray-600 mt-2">
              Check-in online to save time at the airport and choose your preferred seat.
            </p>
          </div>
          
          {/* Check-in Steps */}
          <div className="flex justify-between bg-gray-50 p-4 border-b border-gray-200">
            <div className={`flex flex-col items-center ${activeStep >= 1 ? 'text-bimanGreen' : 'text-gray-400'}`}>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full mb-1 ${
                activeStep >= 1 ? 'bg-bimanGreen text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                1
              </div>
              <span className="text-xs font-medium">Retrieve Booking</span>
            </div>
            
            <div className="w-16 h-0.5 bg-gray-300 self-center"></div>
            
            <div className={`flex flex-col items-center ${activeStep >= 2 ? 'text-bimanGreen' : 'text-gray-400'}`}>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full mb-1 ${
                activeStep >= 2 ? 'bg-bimanGreen text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                2
              </div>
              <span className="text-xs font-medium">Select Seats</span>
            </div>
            
            <div className="w-16 h-0.5 bg-gray-300 self-center"></div>
            
            <div className={`flex flex-col items-center ${activeStep >= 3 ? 'text-bimanGreen' : 'text-gray-400'}`}>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full mb-1 ${
                activeStep >= 3 ? 'bg-bimanGreen text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                3
              </div>
              <span className="text-xs font-medium">Add-ons</span>
            </div>
            
            <div className="w-16 h-0.5 bg-gray-300 self-center"></div>
            
            <div className={`flex flex-col items-center ${activeStep >= 4 ? 'text-bimanGreen' : 'text-gray-400'}`}>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full mb-1 ${
                activeStep >= 4 ? 'bg-bimanGreen text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                4
              </div>
              <span className="text-xs font-medium">Confirmation</span>
            </div>
          </div>

          {/* Step Content */}
          <div className="p-6">
            {/* Step 1: Retrieve Booking */}
            {activeStep === 1 && (
              <div>
                <p className="text-gray-600 mb-6">
                  Enter your booking reference (PNR) and last name to retrieve your flight details.
                </p>
                
                <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Booking Reference (PNR)
                    </label>
                    <input
                      type="text"
                      value={bookingReference}
                      onChange={(e) => setBookingReference(e.target.value.toUpperCase())}
                      placeholder="6-character code (e.g., ABC123)"
                      className="form-input w-full rounded-lg border-gray-300 shadow-sm focus:border-bimanGreen focus:ring focus:ring-bimanGreen/20 transition"
                      maxLength={6}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      You can find this on your e-ticket or confirmation email.
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Enter your last name"
                      className="form-input w-full rounded-lg border-gray-300 shadow-sm focus:border-bimanGreen focus:ring focus:ring-bimanGreen/20 transition"
                      required
                    />
                  </div>
                  
                  <div className="flex justify-center">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-bimanGreen hover:bg-green-700 text-white font-bold rounded-lg shadow hover:shadow-lg transition transform hover:-translate-y-0.5"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                          Retrieving...
                        </div>
                      ) : (
                        'Retrieve Booking'
                      )}
                    </button>
                  </div>
                </form>
                
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Check-in Information</h3>
                  
                  <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-800">
                    <ul className="space-y-2 list-disc pl-5">
                      <li>Online check-in opens 24 hours before flight departure and closes 90 minutes before departure.</li>
                      <li>Each passenger must present a valid ID at the airport even after completing online check-in.</li>
                      <li>Passengers with special requests (wheelchair, extra baggage, etc.) should check-in at the airport counter.</li>
                      <li>You can print your boarding pass or save it on your mobile device for convenient access.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 2: Seat Selection */}
            {activeStep === 2 && booking && (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Flight Details</h2>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex flex-col md:flex-row justify-between mb-2">
                      <div>
                        <div className="text-sm text-gray-500">Flight</div>
                        <div className="font-bold">{booking.flight.number}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Date</div>
                        <div className="font-medium">{booking.flight.date}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Route</div>
                        <div className="font-medium">{booking.flight.origin} - {booking.flight.destination}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Departure</div>
                        <div className="font-medium">{booking.flight.departureTime}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Arrival</div>
                        <div className="font-medium">
                          {booking.flight.arrivalTime}
                          {booking.flight.isNextDay && <span className="text-xs text-bimanRed ml-1">+1</span>}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {booking.flight.aircraft} · Terminal {booking.flight.departureTerminal} · Gate {booking.flight.departureGate}
                    </div>
                  </div>
                  
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Choose Your Seats</h2>
                  
                  {booking.passengers.map(passenger => (
                    <div key={passenger.id} className="mb-6">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-50 rounded-lg p-4 mb-2">
                        <div>
                          <div className="font-medium">{passenger.firstName} {passenger.lastName}</div>
                          <div className="text-sm text-gray-500">{passenger.class} Class · Ticket: {passenger.ticketNumber}</div>
                        </div>
                        <div className="mt-2 md:mt-0 bg-white border border-gray-200 rounded-lg px-3 py-1 text-sm">
                          <span className="text-gray-500 mr-1">Selected Seat:</span>
                          <span className="font-bold text-bimanGreen">
                            {selectedSeats[passenger.id] || 'Not selected'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mb-6">
                  <div className="bg-gray-100 p-4 rounded-lg mb-4">
                    <div className="flex items-center justify-center mb-6">
                      <div className="w-1/2 h-8 rounded-t-lg bg-bimanGreen text-white flex items-center justify-center text-sm font-medium">
                        FRONT
                      </div>
                    </div>
                    
                    {/* Seat Map Legend */}
                    <div className="flex flex-wrap gap-3 justify-center mb-6">
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-gray-100 border border-gray-300 rounded mr-2"></div>
                        <span className="text-xs">Available</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-gray-300 rounded mr-2"></div>
                        <span className="text-xs">Occupied</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-blue-50 border border-blue-200 rounded mr-2"></div>
                        <span className="text-xs">Premium (+$15)</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-indigo-100 border border-indigo-200 rounded mr-2"></div>
                        <span className="text-xs">Exit Row (+$25)</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-bimanGreen text-white flex items-center justify-center rounded mr-2">
                          <span className="text-xs">1A</span>
                        </div>
                        <span className="text-xs">Selected</span>
                      </div>
                    </div>
                    
                    {/* Seat Map Grid */}
                    <div className="flex justify-center overflow-x-auto max-w-full pb-4">
                      <div className="inline-block">
                        {/* Row Numbers */}
                        <div className="flex mb-1">
                          <div className="w-8"></div>
                          {booking.seatMap[0].map((seat, i) => (
                            <div key={i} className="w-8 text-center text-xs text-gray-500">
                              {seat.type !== 'aisle' && seat.column}
                            </div>
                          ))}
                        </div>
                        
                        {/* Seat Grid */}
                        {booking.seatMap.map((row, rowIndex) => (
                          <div key={rowIndex} className="flex items-center mb-1">
                            <div className="w-8 text-center text-xs text-gray-500">
                              {row[0].row}
                            </div>
                            
                            {row.map((seat, seatIndex) => (
                              seat.type === 'aisle' ? (
                                <div key={`aisle-${rowIndex}-${seatIndex}`} className="w-4"></div>
                              ) : (
                                <div 
                                  key={`seat-${rowIndex}-${seatIndex}`} 
                                  className={`w-8 h-8 rounded flex items-center justify-center text-xs font-medium cursor-pointer transition ${getSeatColorClass(seat)}`}
                                  onClick={() => {
                                    if (!seat.occupied && booking.passengers.length > 0) {
                                      selectSeat(booking.passengers[0].id, seat.id);
                                    }
                                  }}
                                >
                                  {seat.id}
                                </div>
                              )
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Passenger selection for seat assignment (if multiple passengers) */}
                  {booking.passengers.length > 1 && (
                    <div className="mb-6">
                      <h3 className="font-medium text-gray-800 mb-2">Selecting Seat For:</h3>
                      <div className="flex flex-wrap gap-2">
                        {booking.passengers.map(passenger => (
                          <button
                            key={passenger.id}
                            className={`px-3 py-1 rounded-full text-sm ${
                              Object.keys(selectedSeats)[Object.keys(selectedSeats).length - 1] === passenger.id.toString()
                                ? 'bg-bimanGreen text-white'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                            }`}
                            onClick={() => {
                              // This would typically set the active passenger for seat selection
                            }}
                          >
                            {passenger.firstName} {passenger.lastName}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-center">
                    <button
                      onClick={completeSeatSelection}
                      className="px-6 py-3 bg-bimanGreen hover:bg-green-700 text-white font-bold rounded-lg shadow hover:shadow-lg transition transform hover:-translate-y-0.5"
                      disabled={Object.keys(selectedSeats).length < booking.passengers.length}
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 3: Add-ons and Additional Services */}
            {activeStep === 3 && booking && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-6">Additional Services</h2>
                
                <div className="space-y-6 mb-8">
                  {/* Baggage */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="flex items-center bg-gray-50 p-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-bimanGreen mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <h3 className="font-bold text-gray-800">Extra Baggage</h3>
                    </div>
                    <div className="p-4">
                      <p className="text-gray-600 mb-4">
                        Add extra baggage allowance to your booking. Standard allowance is already included.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[5, 10, 15, 20, 25, 30].map(kg => (
                          <div key={kg} className="border border-gray-200 rounded-lg p-3 hover:border-bimanGreen cursor-pointer transition">
                            <div className="font-bold text-gray-800 mb-1">+{kg} kg</div>
                            <div className="text-bimanGreen font-medium">${kg * 12}</div>
                            <div className="text-xs text-gray-500">per passenger</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Meals */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="flex items-center bg-gray-50 p-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-bimanGreen mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 className="font-bold text-gray-800">Special Meal Requests</h3>
                    </div>
                    <div className="p-4">
                      <p className="text-gray-600 mb-4">
                        Choose from our selection of special meals. Standard meal is included with your booking.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {['Vegetarian', 'Vegan', 'Halal', 'Diabetic', 'Gluten-free', 'Kosher'].map(meal => (
                          <div key={meal} className="border border-gray-200 rounded-lg p-3 hover:border-bimanGreen cursor-pointer transition">
                            <div className="font-bold text-gray-800 mb-1">{meal}</div>
                            <div className="text-bimanGreen font-medium">
                              {meal === 'Vegetarian' ? 'No additional cost' : '+$12'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Travel Insurance */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="flex items-center bg-gray-50 p-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-bimanGreen mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <h3 className="font-bold text-gray-800">Travel Insurance</h3>
                    </div>
                    <div className="p-4">
                      <p className="text-gray-600 mb-4">
                        Protect your journey with our comprehensive travel insurance plans.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="border border-gray-200 rounded-lg p-3 hover:border-bimanGreen cursor-pointer transition">
                          <div className="font-bold text-gray-800 mb-1">Basic Protection</div>
                          <div className="text-bimanGreen font-medium">$25</div>
                          <div className="text-xs text-gray-500 mt-1">
                            Flight cancellation, baggage loss
                          </div>
                        </div>
                        <div className="border border-gray-200 rounded-lg p-3 hover:border-bimanGreen cursor-pointer transition bg-bimanGreen/5 border-bimanGreen">
                          <div className="font-bold text-gray-800 mb-1">Premium Cover</div>
                          <div className="text-bimanGreen font-medium">$45</div>
                          <div className="text-xs text-gray-500 mt-1">
                            All basic + medical expenses, travel delays
                          </div>
                        </div>
                        <div className="border border-gray-200 rounded-lg p-3 hover:border-bimanGreen cursor-pointer transition">
                          <div className="font-bold text-gray-800 mb-1">Comprehensive</div>
                          <div className="text-bimanGreen font-medium">$65</div>
                          <div className="text-xs text-gray-500 mt-1">
                            All premium + emergency evacuation
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <button
                    onClick={completeCheckIn}
                    className="px-6 py-3 bg-bimanGreen hover:bg-green-700 text-white font-bold rounded-lg shadow hover:shadow-lg transition transform hover:-translate-y-0.5"
                  >
                    Complete Check-In
                  </button>
                </div>
              </div>
            )}
            
            {/* Step 4: Confirmation and Boarding Pass */}
            {activeStep === 4 && checkInCompleted && booking && (
              <div>
                <div className="flex justify-center mb-8">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Check-In Completed!</h2>
                  <p className="text-gray-600">
                    Your boarding passes are ready. You can print them or download to your mobile device.
                  </p>
                </div>
                
                {/* Flight Info Summary */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex flex-col md:flex-row justify-between items-center">
                    <div>
                      <div className="text-sm text-gray-500">Flight</div>
                      <div className="font-bold">{booking.flight.number}</div>
                    </div>
                    <div className="hidden md:block">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">From</div>
                      <div className="font-bold">{booking.flight.origin}</div>
                    </div>
                    <div className="hidden md:block">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">To</div>
                      <div className="font-bold">{booking.flight.destination}</div>
                    </div>
                    <div className="hidden md:block">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Date</div>
                      <div className="font-bold">{booking.flight.date}</div>
                    </div>
                  </div>
                </div>
                
                {/* Boarding Passes */}
                <h3 className="text-lg font-bold text-gray-800 mb-4">Boarding Passes</h3>
                
                <div className="space-y-6 mb-8">
                  {booking.passengers.map(passenger => (
                    <div key={passenger.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-bimanGreen text-white p-4">
                        <div className="flex justify-between">
                          <div className="font-bold">Boarding Pass</div>
                          <div>Flight {booking.flight.number}</div>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <div className="text-sm text-gray-500">Name</div>
                            <div className="font-medium">{passenger.firstName} {passenger.lastName}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Seat</div>
                            <div className="font-medium">{selectedSeats[passenger.id] || 'Not assigned'}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Gate</div>
                            <div className="font-medium">{booking.flight.departureGate}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Boarding</div>
                            <div className="font-medium">
                              {/* Generate boarding time (30 min before departure) */}
                              {(() => {
                                const [hours, minutes] = booking.flight.departureTime.split(':').map(Number);
                                const boardingDate = new Date();
                                boardingDate.setHours(hours);
                                boardingDate.setMinutes(minutes - 30);
                                return boardingDate.getHours().toString().padStart(2, '0') + ':' + boardingDate.getMinutes().toString().padStart(2, '0');
                              })()}
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <div className="text-sm text-gray-500">From</div>
                            <div className="font-medium">{booking.flight.origin} - {booking.flight.originAirport}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">To</div>
                            <div className="font-medium">{booking.flight.destination} - {booking.flight.destinationAirport}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Date & Time</div>
                            <div className="font-medium">{booking.flight.date} · {booking.flight.departureTime}</div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col md:flex-row justify-between items-center">
                          <div className="mb-4 md:mb-0">
                            {/* Mock barcode */}
                            <div className="h-16 w-48 bg-gray-800 rounded"></div>
                          </div>
                          <div className="flex gap-2">
                            <button className="px-4 py-2 bg-bimanGreen text-white rounded-lg hover:bg-green-700 transition flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z" clipRule="evenodd" />
                              </svg>
                              Print
                            </button>
                            <button className="px-4 py-2 bg-bimanRed text-white rounded-lg hover:bg-red-700 transition flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                              Download
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-800 mb-8">
                  <h4 className="font-bold mb-2">Important Information</h4>
                  <ul className="space-y-2 list-disc pl-5">
                    <li>Please arrive at the airport at least 2 hours before your flight.</li>
                    <li>Present your boarding pass and valid ID/passport at security checkpoints.</li>
                    <li>Baggage drop closes 60 minutes before departure.</li>
                    <li>Gate closes 30 minutes before departure.</li>
                  </ul>
                </div>
                
                <div className="flex justify-center">
                  <button
                    onClick={() => window.location.href = '/'}
                    className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-lg shadow hover:shadow-lg transition"
                  >
                    Return to Homepage
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CheckIn;