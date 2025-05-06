import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const FlightStatus = () => {
  const [data, setData] = useState(null);
  const [flightNumber, setFlightNumber] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [flight, setFlight] = useState(null);
  const [searchMode, setSearchMode] = useState('flightNumber'); // 'flightNumber' or 'route'
  const [route, setRoute] = useState({
    from: '',
    to: '',
    date: ''
  });
  const [recentSearches, setRecentSearches] = useState([]);
  
  useEffect(() => {
    import('../data.json').then((module) => setData(module.default || module));
    
    // Load recent searches from localStorage
    const savedSearches = localStorage.getItem('recentFlightStatusSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Save to recent searches
    if (searchMode === 'flightNumber' && flightNumber) {
      const newSearch = {
        type: 'flightNumber',
        value: flightNumber,
        date: searchDate,
        timestamp: new Date().toISOString()
      };
      
      const updatedSearches = [newSearch, ...recentSearches.filter(s => 
        !(s.type === 'flightNumber' && s.value === flightNumber && s.date === searchDate)
      )].slice(0, 5);
      
      setRecentSearches(updatedSearches);
      localStorage.setItem('recentFlightStatusSearches', JSON.stringify(updatedSearches));
    } else if (searchMode === 'route' && route.from && route.to && route.date) {
      const newSearch = {
        type: 'route',
        from: route.from,
        to: route.to,
        date: route.date,
        timestamp: new Date().toISOString()
      };
      
      const updatedSearches = [newSearch, ...recentSearches.filter(s => 
        !(s.type === 'route' && s.from === route.from && s.to === route.to && s.date === route.date)
      )].slice(0, 5);
      
      setRecentSearches(updatedSearches);
      localStorage.setItem('recentFlightStatusSearches', JSON.stringify(updatedSearches));
    }
    
    // Generate mock flight data
    setTimeout(() => {
      generateMockFlight();
      setIsLoading(false);
    }, 1500);
  };

  const loadRecentSearch = (search) => {
    if (search.type === 'flightNumber') {
      setSearchMode('flightNumber');
      setFlightNumber(search.value);
      setSearchDate(search.date);
    } else {
      setSearchMode('route');
      setRoute({
        from: search.from,
        to: search.to,
        date: search.date
      });
    }
    
    // Automatically search
    setIsLoading(true);
    setTimeout(() => {
      generateMockFlight();
      setIsLoading(false);
    }, 1500);
  };

  const generateMockFlight = () => {
    // Generate mock flight details
    const status = ['On Time', 'Delayed', 'Boarding', 'In Air', 'Landed', 'Arrived'][Math.floor(Math.random() * 6)];
    const origin = searchMode === 'flightNumber' ? 'DAC' : route.from;
    const destination = searchMode === 'flightNumber' ? 'LHR' : route.to;
    const date = searchMode === 'flightNumber' ? searchDate : route.date;
    
    const flightDate = new Date(date);
    const formattedDate = flightDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
    
    // Random times
    const hour = 6 + Math.floor(Math.random() * 16); // 6 AM to 10 PM
    const minute = Math.floor(Math.random() * 12) * 5; // 0, 5, 10, 15, ... 55
    const scheduledDeparture = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    
    // Actual departure time (with possible delay)
    let actualDepartureDate;
    if (status === 'Delayed') {
      actualDepartureDate = new Date(flightDate);
      actualDepartureDate.setHours(hour);
      actualDepartureDate.setMinutes(minute + 15 + Math.floor(Math.random() * 10) * 5); // 15-60 min delay
    } else {
      actualDepartureDate = new Date(flightDate);
      actualDepartureDate.setHours(hour);
      actualDepartureDate.setMinutes(minute);
    }
    const actualDeparture = `${actualDepartureDate.getHours().toString().padStart(2, '0')}:${actualDepartureDate.getMinutes().toString().padStart(2, '0')}`;
    
    // Flight duration
    const durationHours = 1 + Math.floor(Math.random() * 12); // 1-13 hours
    const durationMinutes = Math.floor(Math.random() * 12) * 5; // 0, 5, 10, ... 55
    
    // Calculate scheduled arrival time
    const scheduledArrivalDate = new Date(flightDate);
    scheduledArrivalDate.setHours(hour + durationHours);
    scheduledArrivalDate.setMinutes(minute + durationMinutes);
    const scheduledArrival = `${scheduledArrivalDate.getHours().toString().padStart(2, '0')}:${scheduledArrivalDate.getMinutes().toString().padStart(2, '0')}`;
    
    // Calculate actual arrival time
    const actualArrivalDate = new Date(actualDepartureDate);
    actualArrivalDate.setHours(actualDepartureDate.getHours() + durationHours);
    actualArrivalDate.setMinutes(actualDepartureDate.getMinutes() + durationMinutes);
    const actualArrival = `${actualArrivalDate.getHours().toString().padStart(2, '0')}:${actualArrivalDate.getMinutes().toString().padStart(2, '0')}`;
    
    // Is arrival next day?
    const isNextDay = scheduledArrivalDate.getDate() !== flightDate.getDate();
    
    // Get random aircraft
    const aircraftTypes = ['Boeing 787-8', 'Boeing 787-9', 'Boeing 777-300ER', 'Boeing 737-800'];
    const aircraft = aircraftTypes[Math.floor(Math.random() * aircraftTypes.length)];
    
    // Generate random flight path coordinates (simplified for demo)
    const flightPath = [];
    const numPoints = 50;
    const startLat = origin === 'DAC' ? 23.8103 : 51.5074;
    const startLng = origin === 'DAC' ? 90.4125 : -0.1278;
    const endLat = destination === 'LHR' ? 51.5074 : 23.8103;
    const endLng = destination === 'LHR' ? -0.1278 : 90.4125;
    
    for (let i = 0; i < numPoints; i++) {
      const ratio = i / (numPoints - 1);
      flightPath.push({
        lat: startLat + (endLat - startLat) * ratio,
        lng: startLng + (endLng - startLng) * ratio
      });
    }
    
    // Calculate progress percentage based on status
    let progressPercentage = 0;
    if (status === 'In Air') {
      progressPercentage = 30 + Math.floor(Math.random() * 40); // 30-70%
    } else if (status === 'Landed') {
      progressPercentage = 90;
    } else if (status === 'Arrived') {
      progressPercentage = 100;
    } else if (status === 'Boarding') {
      progressPercentage = 10;
    }
    
    // Terminal and gate information
    const departureTerminal = ['1', '2', '3'][Math.floor(Math.random() * 3)];
    const departureGate = `${Math.floor(Math.random() * 30) + 1}`;
    const arrivalTerminal = ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)];
    const arrivalGate = `${Math.floor(Math.random() * 30) + 1}`;
    
    setFlight({
      flightNumber: searchMode === 'flightNumber' ? flightNumber : `${BG}${100 + Math.floor(Math.random() * 900)}`,
      status,
      origin,
      destination,
      date: formattedDate,
      scheduledDeparture,
      actualDeparture,
      scheduledArrival,
      actualArrival,
      isNextDay,
      aircraft,
      duration: `${durationHours}h ${durationMinutes}m`,
      flightPath,
      progressPercentage,
      departureTerminal,
      departureGate,
      arrivalTerminal,
      arrivalGate,
      originAirport: origin === 'DAC' ? 'Hazrat Shahjalal International Airport' : 'London Heathrow Airport',
      destinationAirport: destination === 'LHR' ? 'London Heathrow Airport' : 'Hazrat Shahjalal International Airport'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'On Time':
        return 'bg-green-500';
      case 'Delayed':
        return 'bg-yellow-500';
      case 'Boarding':
        return 'bg-blue-500';
      case 'In Air':
        return 'bg-indigo-500';
      case 'Landed':
        return 'bg-purple-500';
      case 'Arrived':
        return 'bg-green-600';
      default:
        return 'bg-gray-500';
    }
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
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Flight Status</h1>
          
          <div className="mb-6">
            <div className="flex border-b border-gray-200">
              <button
                className={`px-4 py-2 font-medium ${
                  searchMode === 'flightNumber'
                    ? 'text-bimanGreen border-b-2 border-bimanGreen'
                    : 'text-gray-500 hover:text-bimanGreen'
                }`}
                onClick={() => setSearchMode('flightNumber')}
              >
                Search by Flight Number
              </button>
              <button
                className={`px-4 py-2 font-medium ${
                  searchMode === 'route'
                    ? 'text-bimanGreen border-b-2 border-bimanGreen'
                    : 'text-gray-500 hover:text-bimanGreen'
                }`}
                onClick={() => setSearchMode('route')}
              >
                Search by Route
              </button>
            </div>
          </div>
          
          {searchMode === 'flightNumber' ? (
            <form onSubmit={handleSearch}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Flight Number</label>
                  <input
                    type="text"
                    value={flightNumber}
                    onChange={(e) => setFlightNumber(e.target.value)}
                    placeholder="e.g., BG123"
                    className="form-input w-full rounded-lg border-gray-300 shadow-sm focus:border-bimanGreen focus:ring focus:ring-bimanGreen/20 transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={searchDate}
                    onChange={(e) => setSearchDate(e.target.value)}
                    className="form-input w-full rounded-lg border-gray-300 shadow-sm focus:border-bimanGreen focus:ring focus:ring-bimanGreen/20 transition"
                    required
                  />
                </div>
                <div className="md:col-span-3">
                  <button
                    type="submit"
                    className="w-full px-4 py-3 bg-bimanGreen hover:bg-green-700 text-white font-bold rounded-lg shadow hover:shadow-lg transition transform hover:-translate-y-0.5"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                        Searching...
                      </div>
                    ) : (
                      'Check Flight Status'
                    )}
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSearch}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                  <select
                    value={route.from}
                    onChange={(e) => setRoute({...route, from: e.target.value})}
                    className="form-select w-full rounded-lg border-gray-300 shadow-sm focus:border-bimanGreen focus:ring focus:ring-bimanGreen/20 transition"
                    required
                  >
                    <option value="">Select Origin</option>
                    {data.destinations.map(dest => (
                      <option key={dest.id} value={dest.code}>{dest.name} ({dest.code})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                  <select
                    value={route.to}
                    onChange={(e) => setRoute({...route, to: e.target.value})}
                    className="form-select w-full rounded-lg border-gray-300 shadow-sm focus:border-bimanGreen focus:ring focus:ring-bimanGreen/20 transition"
                    required
                  >
                    <option value="">Select Destination</option>
                    {data.destinations.map(dest => (
                      <option key={dest.id} value={dest.code}>{dest.name} ({dest.code})</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={route.date}
                    onChange={(e) => setRoute({...route, date: e.target.value})}
                    className="form-input w-full rounded-lg border-gray-300 shadow-sm focus:border-bimanGreen focus:ring focus:ring-bimanGreen/20 transition"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="w-full px-4 py-3 bg-bimanGreen hover:bg-green-700 text-white font-bold rounded-lg shadow hover:shadow-lg transition transform hover:-translate-y-0.5"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                        Searching...
                      </div>
                    ) : (
                      'Check Flight Status'
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Recent searches */}
          {recentSearches.length > 0 && !flight && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Searches</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recentSearches.map((search, index) => (
                  <div
                    key={index}
                    onClick={() => loadRecentSearch(search)}
                    className="border border-gray-200 rounded-lg p-3 hover:border-bimanGreen hover:bg-bimanGreen/5 cursor-pointer transition"
                  >
                    {search.type === 'flightNumber' ? (
                      <div className="flex justify-between">
                        <div>
                          <div className="font-medium">{search.value}</div>
                          <div className="text-sm text-gray-500">
                            {new Date(search.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(search.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between">
                        <div>
                          <div className="font-medium">{search.from} to {search.to}</div>
                          <div className="text-sm text-gray-500">
                            {new Date(search.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(search.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Flight Status Results */}
        {flight && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden mb-8"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl font-bold">Flight {flight.flightNumber}</span>
                    <span className={`${getStatusColor(flight.status)} text-white text-xs font-medium px-2.5 py-0.5 rounded`}>
                      {flight.status}
                    </span>
                  </div>
                  <div className="text-gray-600">
                    {flight.date} · {flight.aircraft}
                  </div>
                </div>
                <button className="mt-2 md:mt-0 px-4 py-2 bg-bimanGreen/10 text-bimanGreen rounded flex items-center text-sm hover:bg-bimanGreen/20 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  New Search
                </button>
              </div>
            </div>
            
            {/* Flight Status Visualization */}
            <div className="p-6 md:p-8">
              {/* Progress Bar with 3 Stages */}
              <div className="mb-10">
                <div className="relative">
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-2 bg-bimanGreen rounded-full"
                      style={{ width: `${flight.progressPercentage}%` }}  
                    ></div>
                  </div>
                  
                  {/* Flight Phases */}
                  <div className="flex justify-between mt-2">
                    <div className={`flex flex-col items-center relative ${flight.progressPercentage >= 0 ? 'text-bimanGreen' : 'text-gray-400'}`}>
                      <div className={`absolute -top-5 w-5 h-5 rounded-full ${flight.progressPercentage >= 0 ? 'bg-bimanGreen' : 'bg-gray-200'} flex items-center justify-center`}>
                        {flight.progressPercentage >= 0 && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className="text-xs font-medium mt-1">Scheduled</span>
                    </div>
                    
                    <div className={`flex flex-col items-center relative ${flight.progressPercentage >= 25 ? 'text-bimanGreen' : 'text-gray-400'}`}>
                      <div className={`absolute -top-5 w-5 h-5 rounded-full ${flight.progressPercentage >= 25 ? 'bg-bimanGreen' : 'bg-gray-200'} flex items-center justify-center`}>
                        {flight.progressPercentage >= 25 && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className="text-xs font-medium mt-1">Departed</span>
                    </div>
                    
                    <div className={`flex flex-col items-center relative ${flight.progressPercentage >= 50 ? 'text-bimanGreen' : 'text-gray-400'}`}>
                      <div className={`absolute -top-5 w-5 h-5 rounded-full ${flight.progressPercentage >= 50 ? 'bg-bimanGreen' : 'bg-gray-200'} flex items-center justify-center`}>
                        {flight.progressPercentage >= 50 && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className="text-xs font-medium mt-1">In Air</span>
                    </div>
                    
                    <div className={`flex flex-col items-center relative ${flight.progressPercentage >= 75 ? 'text-bimanGreen' : 'text-gray-400'}`}>
                      <div className={`absolute -top-5 w-5 h-5 rounded-full ${flight.progressPercentage >= 75 ? 'bg-bimanGreen' : 'bg-gray-200'} flex items-center justify-center`}>
                        {flight.progressPercentage >= 75 && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className="text-xs font-medium mt-1">Landing</span>
                    </div>
                    
                    <div className={`flex flex-col items-center relative ${flight.progressPercentage >= 100 ? 'text-bimanGreen' : 'text-gray-400'}`}>
                      <div className={`absolute -top-5 w-5 h-5 rounded-full ${flight.progressPercentage >= 100 ? 'bg-bimanGreen' : 'bg-gray-200'} flex items-center justify-center`}>
                        {flight.progressPercentage >= 100 && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className="text-xs font-medium mt-1">Arrived</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Flight Route Map Visualization */}
              <div className="mb-10 bg-gray-100 h-64 rounded-lg flex items-center justify-center relative overflow-hidden">
                {/* This would be replaced with an actual map in a production app */}
                <div className="absolute inset-x-12 top-1/2 h-0.5 bg-gray-300"></div>
                <div className="absolute left-12 top-1/2 transform -translate-y-1/2 flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full bg-bimanGreen mb-1"></div>
                  <div className="text-xs font-medium">{flight.origin}</div>
                </div>
                <div className="absolute right-12 top-1/2 transform -translate-y-1/2 flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full bg-bimanRed mb-1"></div>
                  <div className="text-xs font-medium">{flight.destination}</div>
                </div>
                
                {/* Airplane Icon */}
                <div 
                  className="absolute top-1/2 transform -translate-y-1/2"
                  style={{ left: `${12 + (76 * flight.progressPercentage / 100)}%` }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-bimanGreen" viewBox="0 0 20 20" fill="currentColor" style={{ transform: 'rotate(90deg)' }}>
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11.43a1 1 0 01.725-.962l5-1.429a1 1 0 001.17-1.409l-7-14z" />
                  </svg>
                </div>
                
                <div className="text-sm text-center text-gray-500 mt-8">
                  Interactive flight map visualization
                </div>
              </div>

              {/* Flight Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Departure Details */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 rounded-full bg-bimanGreen/10 flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-bimanGreen" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xl font-bold">{flight.origin}</div>
                      <div className="text-gray-600">{flight.originAirport}</div>
                    </div>
                  </div>
                  
                  <div className="ml-13 pl-6 border-l border-gray-200">
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <div className="text-sm text-gray-500">Scheduled</div>
                        <div className="font-medium">{flight.scheduledDeparture}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Terminal</div>
                        <div className="font-medium">{flight.departureTerminal}</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">Actual</div>
                        <div className={`font-medium ${flight.scheduledDeparture !== flight.actualDeparture ? 'text-yellow-600' : ''}`}>
                          {flight.actualDeparture}
                          {flight.scheduledDeparture !== flight.actualDeparture && (
                            <span className="text-xs ml-1">
                              {flight.scheduledDeparture < flight.actualDeparture ? '(Delayed)' : '(Early)'}
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Gate</div>
                        <div className="font-medium">{flight.departureGate}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Arrival Details */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 rounded-full bg-bimanRed/10 flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-bimanRed" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xl font-bold">{flight.destination}</div>
                      <div className="text-gray-600">{flight.destinationAirport}</div>
                    </div>
                  </div>
                  
                  <div className="ml-13 pl-6 border-l border-gray-200">
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <div className="text-sm text-gray-500">Scheduled</div>
                        <div className="font-medium">
                          {flight.scheduledArrival}
                          {flight.isNextDay && <span className="text-xs text-bimanRed ml-1">+1</span>}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Terminal</div>
                        <div className="font-medium">{flight.arrivalTerminal}</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">Expected</div>
                        <div className={`font-medium ${flight.scheduledArrival !== flight.actualArrival ? 'text-yellow-600' : ''}`}>
                          {flight.actualArrival}
                          {flight.isNextDay && <span className="text-xs text-bimanRed ml-1">+1</span>}
                          {flight.scheduledArrival !== flight.actualArrival && (
                            <span className="text-xs ml-1">
                              {flight.scheduledArrival < flight.actualArrival ? '(Delayed)' : '(Early)'}
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Gate</div>
                        <div className="font-medium">{flight.arrivalGate}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Additional Information */}
              <div className="flex flex-col md:flex-row justify-between mt-8">
                <div>
                  <div className="text-sm text-gray-500">Flight Duration</div>
                  <div className="font-medium">{flight.duration}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Aircraft</div>
                  <div className="font-medium">{flight.aircraft}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Distance</div>
                  <div className="font-medium">
                    {/* Calculate rough distance based on flight time */}
                    {Math.round((parseInt(flight.duration.split('h')[0]) * 850) + (parseInt(flight.duration.split('h')[1].trim().split('m')[0]) / 60 * 850))} km
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 border-t border-gray-200">
              <div className="flex items-center gap-2 text-bimanGreen text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span>Flight information is updated every few minutes and is for informational purposes only.</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FlightStatus;