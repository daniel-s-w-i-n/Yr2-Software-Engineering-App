// Importing necessary React and Material UI components for use in the DashboardComponent
import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Avatar, TextField, Card, Tabs, Tab, DialogActions, Stack, Divider } from '@mui/material';
import { TabPanel, TabContext } from '@mui/lab';
import InsightsIcon from '@mui/icons-material/Insights';
import GroupIcon from '@mui/icons-material/Group';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';

import EventIcon from '@mui/icons-material/Event';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search'; 
import MyLocationIcon from '@mui/icons-material/MyLocation';

import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';

import PieChart from './components/PieChart';
import BarChart from './components/BarChart';
import LineChart from './components/LineChart';

import { UserData, SharedJourneysData } from './DataUpdated';

// Importing Leaflet components for map functionality, along with Leaflet's CSS
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine'; 
import { useMap } from 'react-leaflet'; 

// OpenStreetMapProvider from leaflet-geosearch package for geocoding services
import { OpenStreetMapProvider } from 'leaflet-geosearch';

import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus'; 
import ElectricCarIcon from '@mui/icons-material/ElectricCar';
import LocationOnIcon from '@mui/icons-material/LocationOn';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import { supabase } from './supabaseClient';

// Modifying Leaflet's default icon paths to ensure icons are correctly loaded
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom component for picking a location on the map by clicking
const LocationPicker = ({ onLocationSelect }) => {
  const map = useMap();
  useMapEvents({
    click: (e) => {
      onLocationSelect(e.latlng, map);
    },
  });
  return null;
};

// The main dashboard component
const DashboardComponent = () => {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  let currentJourneyPath = null;

  // State management hooks for various functionalities such as navigation, position tracking, and search
  const [position, setPosition] = React.useState(null);
  const [startPosition, setStartPosition] = useState(null);
  const [search, setSearch] = useState('');
  const [tabValue, setTabValue] = useState('1');
  const [postcode, setPostcode] = useState('');
  const [mapPostcode, setMapPostcode] = useState('');
  const [address, setAddress] = useState(''); 
  const [emissions, setEmissions] = useState(0); 

  const [isComparisonDialogOpen, setIsComparisonDialogOpen] = useState(false);

  const [endPosition] = useState(L.latLng(51.5194, -0.1085));
  const [currentRoute, setCurrentRoute] = React.useState(null);
  const [distance, setDistance] = useState(0);
  const [time, setTime] = useState(0);

  // Pattern to match London postcodes in searches
  const londonPostcodePattern = /\b(E[1-9]|EC[1-4]|N[1-9]|NW[1-9]|SE[1-9]|SW[1-9]|W[1-9]|WC[1-2]|BR[1-8]|CR[0-9]|DA[1-8]|EN[1-9]|HA[0-9]|IG[1-9]|KT[1-9]|RM[1-9]|SM[1-7]|TW[1-9]|UB[1-9]|WD[1-9])\d{0,1}[A-Z]?\s*\d[A-Z]{2}\b/gi;

  const [selectedMode, setSelectedMode] = useState('walking');
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);

  const [userLocation, setUserLocation] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [routes, setRoutes] = useState([]);

  const provider = new OpenStreetMapProvider();

  const userEmail = localStorage.getItem('email');
  const [userName, setUserFullname] = useState('');
  const [employeeID, setEmployeeID] = useState(null);
 
  // Fetches user details such as full name from the database using user email
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDetails = await fetchUserDetails(userEmail);
        if (userDetails) {
          const { firstName, lastName } = userDetails;
          const fullName = `${firstName} ${lastName}`;
          setUserFullname(fullName);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
 
    fetchUserData();
  }, [userEmail]);
 
  // Internal function to fetch user details from the 'employeeTable' in the database
  const fetchUserDetails = async (email) => {
    try {
      const { data, error } = await supabase
        .from('employeeTable')
        .select('firstName, lastName')
        .eq('email', email)
        .single();
     
      if (error) {
        throw error;
      }
 
      return data ? { firstName: data.firstName, lastName: data.lastName } : null;
    } catch (error) {
      console.error('Error fetching user details:', error);
      return null;
    }
  };

  // Logs the employee ID fetched from the database for the current logged-in user
  const logEmployeeID = async () => {
    const userEmail = localStorage.getItem('email');
    try {
      const { data, error } = await supabase
        .from('employeeTable')
        .select('employeeID')
        .eq('email', userEmail)
        .single(); 
  
        console.log('User Email:', userEmail);

      if (error) {
        console.error('Error fetching employee ID:', error);
        return;
      }
  
      if (data) {
        console.log('Employee ID:', data.employeeID);
      } else {
        console.log('No data found for the specified user email.');
      }
    } catch (error) {
      console.error('An error occurred while fetching employee ID:', error);
    }
  };
  
  // Calls the logEmployeeID and fetchEmployeeDetails function on component mount to fetch employee ID
  useEffect(() => {
    logEmployeeID();
  }, []); 

  useEffect(() => {
    fetchEmployeeDetails();
  }, []);

  // Fetches employee details from the database
  const fetchEmployeeDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('employeeTable')
        .select('employeeID')
        .eq('email', userEmail)
        .single();
      
      if (error) {
        throw error;
      }

      if (data) {
        setEmployeeID(data.employeeID);
      }
    } catch (error) {
      console.error('Error fetching employee ID:', error);
    }
  };

  // Converts a numeric index to a colour value, used for styling map elements
  const getColorForIndex = (index) => {
    const colors = ['#0077BB', '#228B22'];
    return colors[index % colors.length];
  };

  // Logs out the user from the application and navigates back to the login screen
  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');

    navigate('/');
  };

  // Handles changes in tab selection in the UI
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Handles the form submission for location search, including postcode validation and geocoding
  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!londonPostcodePattern.test(search)) {
      alert('Please enter a valid London postcode.');
      return;
    }

    setPostcode(search);
  
    const results = await provider.search({ query: search });
    if (results && results.length > 0) {
      const { x, y, label } = results[0];
      const newPosition = { lat: y, lng: x };
      setStartPosition(newPosition);
      setPosition(newPosition);
      setAddress(label);

      const postcodeMatch = label.match(londonPostcodePattern);
      setPostcode(postcodeMatch ? postcodeMatch[0] : '');

      const distanceInMeters = L.latLng(y, x).distanceTo(endPosition);
      updateDetailsBasedOnMode(distanceInMeters, selectedMode);

      calculateRoute(newPosition, endPosition, mapRef.current);
  
    } else {
      alert('Location not found');
      setPosition(null);
      setAddress('');
    }
  };

  // Selects a location on the map based on user interaction and calculates the route from start to the selected location
  const handleLocationSelect = (latlng, map) => {
    const m25Bounds = {
      north: 51.6934,
      south: 51.2868,
      east: 0.3340,
      west: -0.5103,
    };
  
    if (
      latlng.lat < m25Bounds.north &&
      latlng.lat > m25Bounds.south &&
      latlng.lng < m25Bounds.east &&
      latlng.lng > m25Bounds.west
    ) {
      const newPosition = L.latLng(latlng.lat, latlng.lng);
      setStartPosition(newPosition);
      setPosition(newPosition);

    if (currentRoute) {
      map.removeLayer(currentRoute);
      setCurrentRoute(null);
    }

      calculateRoute(newPosition, endPosition, map);
      fetchAddress(latlng.lat, latlng.lng);
  
    } else {
      alert('This location is too far. Please select another.');
    }
  };

  // Fetches an address using geocoding for a given latitude and longitude
  const fetchAddress = async (lat, lng) => {
    const results = await provider.search({ query: `${lat}, ${lng}` });
    if (results && results.length > 0) {
        const addressLabel = results[0].label;
        setAddress(addressLabel);

        const postcodeMatch = addressLabel.match(londonPostcodePattern);
        const foundPostcode = postcodeMatch ? postcodeMatch[0] : '';
        setMapPostcode(foundPostcode);
        console.log("Selected Postcode:", foundPostcode);
    } else {
        console.log('Address not found');
        setAddress('Address not found');
    }
  };

  // Uses the browser's geolocation API to fetch the current user location and calculates the route from current location to destination
  const handleUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const currentPosition = { lat: position.coords.latitude, lng: position.coords.longitude };
        setStartPosition(currentPosition);
        setPosition(currentPosition);
        calculateRoute(currentPosition, endPosition, mapRef.current);

        await convertAddress(currentPosition.lat, currentPosition.lng);
      }, () => {
        console.error('Error fetching the location');
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };
  
  // Converts geographic coordinates to a human-readable address
  const convertAddress = async (lat, lng) => {
    const results = await provider.search({ query: `${lat}, ${lng}` });
    if (results && results.length > 0) {
      const addressLabel = results[0].label;
      setAddress(addressLabel);

      const postcodeMatch = addressLabel.match(londonPostcodePattern);
      if (postcodeMatch && postcodeMatch.length > 0) {
        setMapPostcode(postcodeMatch[0]);
      } else {
        console.log('Postcode not found in the address');
        setMapPostcode('');
      }
    } else {
      console.log('Address not found');
      setAddress('Address not found');
      setMapPostcode('');
    }
  };
  
  // Calculates the route between two points on the map using the OSRM routing engine
  const calculateRoute = async (startPos, endPos, map) => {
    const osrmRouteUrl = `https://router.project-osrm.org/route/v1/driving/${startPos.lng},${startPos.lat};${endPos.lng},${endPos.lat}?overview=full&geometries=geojson`;
    try {
      const response = await fetch(osrmRouteUrl);
      const json = await response.json();
      if (json.routes.length > 0) {
        const route = json.routes[0];
        const routeCoordinates = route.geometry.coordinates;
        const latLngs = routeCoordinates.map(coord => [coord[1], coord[0]]);
  
        if (currentRoute) {
          map.removeLayer(currentRoute);
        }
  
        const newRoute = L.polyline(latLngs, { color: 'blue', weight: 5 }).addTo(map);
        setCurrentRoute(newRoute);
        map.fitBounds(newRoute.getBounds());
  
        setDistance(route.distance);
          const emissions = calculateCarbonEmissions(route.distance, selectedMode);
        setEmissions(emissions);
  
        updateTimeBasedOnMode(route.distance, selectedMode);
      } else {
        alert('No route found.');
      }
    } catch (error) {
      console.error('Failed to draw route:', error);
    }
  };

  // Handles the click event to calculate the route based on the current start position
  const handleCalculateClick = async () => {
    const currentPosition = startPosition;
    if (!currentPosition) {
      alert("Current location not set. Please ensure your location is accessible.");
      return;
    }
    
    const distanceInMeters = L.latLng(currentPosition.lat, currentPosition.lng).distanceTo(endPosition);
    updateDetailsBasedOnMode(distanceInMeters, selectedMode);
    setIsDialogOpen(true); 
  };

  // Handles the placement of a marker on the map at specified coordinates and colours it based on index
  const handleLocationClick = async (lat, lng, index) => {
    if (!lat || !lng) {
      console.error("Invalid start or destination coordinates");
      return;
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    const newLocation = L.latLng(latitude, longitude);

    const marker = L.marker(newLocation).addTo(mapRef.current);

    if (currentJourneyPath) {
      currentJourneyPath.remove();
    }

    if (startPosition) {
      await drawRouteToMarker(startPosition, newLocation, index);
    }

    console.log("Marker set at", newLocation, "with color index", index);
  };

  // Draws a route to a marker placed on the map, colour-coded by the provided index
  const drawRouteToMarker = async (startPos, endPos, index) => {
    const routeUrl = `https://router.project-osrm.org/route/v1/driving/${startPos.lng},${startPos.lat};${endPos.lng},${endPos.lat}?overview=simplified&geometries=geojson`;
    try {
      const response = await fetch(routeUrl);
      const data = await response.json();
      const coordinates = data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);

      const polyline = L.polyline(coordinates, {
          color: getColorForIndex(index), 
          weight: 5
      }).addTo(mapRef.current);
      mapRef.current.fitBounds(polyline.getBounds());

      const newRoutes = routes.filter(r => r.index !== index);
      newRoutes.push({ index, polyline });
      setRoutes(newRoutes);
    } catch (error) {
      console.error("Failed to fetch route:", error);
    }
  };
  
  // Formats the provided time in seconds to a human-readable format including hours, minutes, and seconds
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    let timeString = '';
      if (hours > 0) {
      timeString += `${hours} hour${hours > 1 ? 's' : ''} `;
    }
      if (mins > 0) {
      timeString += `${mins} min${mins > 1 ? 's' : ''} `;
    }
      if (secs > 0) {
      timeString += `${secs} sec${secs > 1 ? 's' : ''}`;
    }
    return timeString.trim();
  };

  // Array of transport modes with their corresponding icons and speed values used for route calculations
  const transportModes = [
    { name: 'walking', icon: <DirectionsWalkIcon />, speed: 1.2 }, 
    { name: 'cycling', icon: <DirectionsBikeIcon />, speed: 4.5 }, 
    { name: 'bus', icon: <DirectionsBusIcon />, speed: 7.0 },
    { name: 'petrolCar', icon: <DirectionsCarIcon />, speed: 11.5 }, 
    { name: 'electricCar', icon: <ElectricCarIcon />, speed: 12.5 }, 
    { name: 'dieselCar', icon: <DirectionsCarIcon />, speed: 10.5 }, 
  ];

  // Updates the calculated time based on the distance and selected mode of transport
  const updateTimeBasedOnMode = (distance, mode) => {
    const modeSpeed = transportModes.find(m => m.name === mode).speed; 
    const timeInSeconds = distance / modeSpeed; 
    setTime(timeInSeconds);
  };
  
  // Updates the details related to the journey based on the selected mode of transport, calculating distance and time
  const updateDetailsBasedOnMode = (distanceInMeters, mode) => {
    const modeSpeed = transportModes.find(m => m.name === mode).speed;
    const timeInSeconds = distanceInMeters / modeSpeed;
    setDistance(distanceInMeters);
    setTime(timeInSeconds);
  };

  // Data structure for various transport modes containing their emission rates, energy efficiencies, and fuel consumptions
  const transportData = {
    walking: {
      emissionsPerKm: 0,
    },
    cycling: {
      emissionsPerKm: 0,
    },
    bus: {
      emissionsPerKm: 0.089,
    },
    petrolCar: {
      fuelEfficiency: 8,
      CO2PerLiter: 2.31,
    },
    dieselCar: {
      fuelEfficiency: 10,
      CO2PerLiter: 2.68,
    },
    electricCar: {
      emissionsPerKWh: 0.233,
      energyEfficiency: 6.1,
    },
  };

  // Calculates the carbon emissions for a journey based on the distance and selected mode of transport
  const calculateCarbonEmissions = (distanceInMeters, mode) => {
    const distanceInKm = distanceInMeters / 1000;
    let carbonEmissions = 0;
    
    const modeData = transportData[mode];
    
    switch (mode) {
      case 'walking':
      case 'cycling':
      case 'bus':
        carbonEmissions = distanceInKm * modeData.emissionsPerKm;
        break;
      case 'petrolCar':
      case 'dieselCar':
        const fuelConsumed = distanceInKm / modeData.fuelEfficiency;
        carbonEmissions = fuelConsumed * modeData.CO2PerLiter;
        break;
      case 'electricCar':
        const energyConsumed = distanceInKm / modeData.energyEfficiency;
        carbonEmissions = energyConsumed * modeData.emissionsPerKWh;
        break;
      default:
        console.log("Unsupported transport mode for emission calculations.");
        break;
    }
    
    return carbonEmissions.toFixed(2);
  };

  // Generates a recommendation message based on the selected mode of transport, encouraging more eco-friendly choices
  const getRecommendationMessage = (selectedMode) => {
    if (selectedMode === 'walking') {
      return (
        <Stack direction="row" spacing={1} alignItems="center">
          <DirectionsWalkIcon color="primary" />
          <Typography variant="body1">Great job walking! Keep it up for a healthier planet! 🌍</Typography>
        </Stack>
      );
    } else if (['cycling', 'bus'].includes(selectedMode)) {
      const Icon = selectedMode === 'cycling' ? DirectionsBikeIcon : DirectionsBusIcon;
      return (
        <Stack direction="row" spacing={1} alignItems="center">
          <Icon color="primary" />
          <Typography variant="body1">You're doing great by choosing {selectedMode}. Consider walking for shorter distances for an even lower impact!</Typography>
        </Stack>
      );
    } else if (['petrolCar', 'dieselCar'].includes(selectedMode)) {
      return (
        <Stack direction="row" spacing={1} alignItems="center">
          <DirectionsCarIcon color="error" />
          <Typography variant="body1">Consider carpooling to reduce your carbon footprint. Check out our carpooling options in the Potential Matches tab!</Typography>
        </Stack>
      );
    } else {
      return (
        <Stack direction="row" spacing={1} alignItems="center">
          <GroupIcon color="secondary" />
          <Typography variant="body1">Looking for a greener way to commute? Consider carpooling or other eco-friendly modes of transport.</Typography>
        </Stack>
      );
    }
  };

  // Calculates the maximum emissions value for a given distance, used in emissions graphs
  const getMaxEmissionsValue = (distance) => {
    const emissionsValues = transportModes.map(mode => parseFloat(calculateCarbonEmissions(distance, mode.name)));
  
    const maxEmissions = Math.max(...emissionsValues);
  
    if (maxEmissions < 1) {
      return 1;
    } else if (maxEmissions <= 3) {
      return 3;
    } else if (maxEmissions <= 5) {
      return 5;
    } else if (maxEmissions <= 7) {
      return 7;
    } else {
      return Math.ceil(maxEmissions / 5) * 5;
    }
  };
  
  const maxEmissionsScale = getMaxEmissionsValue(distance); 

  // React component for rendering a radial emissions graph based on mode and distance
  const EmissionsGraph = ({ mode, distance, maxEmissionsScale }) => {
    const emissions = parseFloat(calculateCarbonEmissions(distance, mode));
    const percentageOfMax = (emissions / maxEmissionsScale) * 100;

    const data = [{ name: 'Emissions', value: percentageOfMax, fill: '#4285F4' }];
  
    return (
      <ResponsiveContainer width="100%" height={200}>
        <RadialBarChart
          innerRadius="70%"
          outerRadius="100%" 
          startAngle={90}
          endAngle={450}
          data={data}
          cx="50%"
          cy="50%"
        >
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} /> {/* Hide axis ticks */}
          <RadialBar
            minAngle={15}
            clockWise
            dataKey="value" 
            cornerRadius={10}
            background={{ fill: '#ddd' }}
          />
          <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fill="#363636">
            {`${emissions.toFixed(2)}kg / ${maxEmissionsScale}kg`}
          </text>
        </RadialBarChart>
      </ResponsiveContainer>
    );
  };

  // State hook storing the chart data for shared journeys between users
  const [sharedJourneysChartData] = useState({
    labels: SharedJourneysData.map((data) => `${data.user1} & ${data.user2}`),
    datasets: [
      {
        label: "Shared Journeys",
        data: SharedJourneysData.map((data) => data.sharedJourneysCount),
        backgroundColor: ["rgba(75,192,192,1)", "#ecf0f1", "#50AF95", "#f3ba2f", "#2a71d0"],
        borderColor: "black",
        borderWidth: 2,
      },
    ],
  });

  // State hook storing the chart data for carbon emissions for each journey
  const [carbonEmissionsChartData] = useState({
    labels: UserData.map((data) => `Journey ${data.journeyId}`),
    datasets: [
      {
        label: "Carbon Emissions (kg CO2)",
        data: UserData.map((data) => data.carbonEmissionsResults),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  });

  // Selects the last five journeys from user data and stores their corresponding chart data
  const lastFiveJourneys = UserData.slice(-5);
  const [distanceChartData] = useState({
    labels: lastFiveJourneys.map((data) => `Journey ${data.journeyId}`),
    datasets: [
      {
        label: "Distance Traveled (km)",
        data: lastFiveJourneys.map((data) => data.distance),
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  });

  // Maps transport mode names to indices for data storage and manipulation
  const transportModeMapping = {
    'walking': 0,
    'cycling': 1,
    'bus': 2,
    'petrolCar': 3,
    'electricCar': 4,
    'dieselCar': 5,
  };

  // Saves journey data to the database and updates related UI components
  const saveJourneyData = async () => {
    try {
        let vehicleID = null;

        if (['petrolCar', 'electricCar', 'dieselCar'].includes(selectedMode)) {
            const vehicleResponse = await supabase
                .from('vehicleTable')
                .select('vehicleID')
                .eq('employeeID', employeeID);

            if (vehicleResponse.error) {
                console.error('Error fetching vehicle IDs:', vehicleResponse.error);
                throw vehicleResponse.error;
            }

            if (vehicleResponse.data.length > 0) {
                vehicleID = vehicleResponse.data[0].vehicleID;  // Choosing the first vehicle ID if multiple
                console.log("Using first fetched VehicleID for mode", selectedMode, ":", vehicleID);
            } else {
                console.log("No VehicleID found for this mode and employee, proceeding without VehicleID.");
            }
        }

        const modeOfTransport = transportModeMapping[selectedMode] !== undefined ? transportModeMapping[selectedMode] : null;
        const currentDate = new Date();
        const journeyDate = currentDate.toISOString().split('T')[0].replace(/-/g, '/');

        const journeyData = {
            startLat: startPosition.lat,
            startLong: startPosition.lng,
            endLat: endPosition.lat,
            endLong: endPosition.lng,
            distance: distance,
            carbonEmissionsResults: emissions,
            estimatedTimeTaken: time,
            vehicleID: vehicleID,
            MOTID: modeOfTransport,
            postCode: mapPostcode !== '' ? mapPostcode : postcode,
            address: address,
            entryDate: journeyDate,
            employeeID: employeeID,
        };

        const { data, error } = await supabase
            .from('journeyTable')
            .insert([journeyData]);

        if (error) {
            console.error('Error saving journey data:', error);
            throw error;
        }

        console.log('Journey data saved successfully:', data);
        await fetchJourneyIdForEmployee(employeeID); // Fetch and update employee with the latest journey ID
        setIsDialogOpen(false);
        setOpenSnackbar(true);

    } catch (error) {
        console.error('Error in saving journey data:', error);
        setOpenSnackbar(true);
    }
};

  // Fetches the latest journey ID for a specific employee and updates the employee table with this information
  const fetchJourneyIdForEmployee = async (employeeID) => {
    try {
      const { data, error } = await supabase
        .from('journeyTable')
        .select('journeyid')
        .eq('employeeID', employeeID)
        .order('entryDate', { ascending: false })
        .limit(1);
  
      if (error) {
        throw error;
      }
  
      if (data.length > 0) {
        console.log('Latest Journey ID for employee:', data[0].journeyid);
        updateEmployeeTable(employeeID, data[0].journeyid);
      } else {
        console.log('No journey found for this employee.');
      }
    } catch (error) {
      console.error('Error fetching journey ID:', error.message);
    }
  };
  
  // Updates the employee table in the database with the latest journey ID for a specific employee
  const updateEmployeeTable = async (employeeID, journeyID) => {
    try {
      const { data, error } = await supabase
        .from('employeeTable')
        .update({ journeyID: journeyID })
        .eq('employeeID', employeeID);
  
      if (error) {
        throw error;
      }
  
      console.log('Employee table updated with journey ID:', journeyID);
    } catch (error) {
      console.error('Error updating employee table:', error.message);
    }
  };

  // Fetches search results from a custom API endpoint, handling any network errors and updating the UI accordingly
  const fetchSearchResults = () => {
    fetch('http://127.0.0.1:5000/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: employeeID,
        limit: 10,
      }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log("Data received:", data);
      setSearchResults(data);
    })
    .catch(error => {
      console.error('Error fetching search results:', error);
      setSearchResults([]);
    });
  };

  return (
    <>
      {/* AppBar at the top displaying navigation and user information */}
      <AppBar position="static" color="primary" sx={{ backgroundColor: '#013035' }}>
      <Toolbar sx={{ minHeight: '80px', height: '80px', alignItems: 'center', paddingLeft: '0px' }}>
        <Box sx={{ 
            backgroundColor: 'lightgrey', 
            display: 'inline-flex',
            alignItems: 'center', 
            height: '48px', 
            pl: 2, 
            pr: 2, 
            borderTopRightRadius: '20px', 
            borderBottomRightRadius: '20px', 
        }}>
          <img src="/eviden-logo2.png" alt="Eviden Logo" style={{ height: '40px' }} />
        </Box>
        <Box sx={{ flexGrow: 1 }} /> 
        <Button 
          color="inherit" 
          onClick={() => navigate('/dashboard')}
          sx={{
            "&:hover": {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
            },
          }}
        >
          Dashboard
        </Button>
        <Button 
          color="inherit" 
          onClick={() => navigate('/account')}
          sx={{
            "&:hover": {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
            },
          }}
        >
          Account
        </Button>
        <Button 
          color="inherit" 
          onClick={handleSignOut}
          sx={{
            "&:hover": {
              backgroundColor: 'rgba(255, 255, 255, 0.2)', 
            },
          }}
        >
          Sign Out
        </Button>        
        <IconButton
          color="inherit"
          onClick={() => navigate('/calendar')}
          sx={{
            "&:hover": {
              backgroundColor: 'rgba(255, 255, 255, 0.2)', 
            },
          }}
        >
          <EventIcon />
        </IconButton>
        <IconButton
          color="inherit"
          onClick={() => navigate('/notifications')}
          sx={{
            "&:hover": {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
            },
            marginRight: '24px', 
          }}
        >
          <NotificationsIcon />
        </IconButton>
        
        {/* User Profile Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
          <Avatar sx={{ bgcolor: 'secondary.main', marginRight: '10px' }}></Avatar>
          <Box>
            <Typography variant="body1" sx={{ color: 'white' }}>{userName}</Typography>
            <Typography variant="body2" sx={{ color: 'white' }}>{userEmail}</Typography>
          </Box>
        </Box>
      </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex', height: 'calc(100vh - 144px)', overflow: 'hidden' }}>
        {/* Map Component - the left hand side */}
        <Box sx={{ flex: 1, height: '100%' }}> 
          <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '100vh', width: '100%' }}   ref={mapRef}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {startPosition && <Marker position={startPosition}></Marker>}
            <Marker position={endPosition}></Marker>
            <LocationPicker onLocationSelect={handleLocationSelect} />
          </MapContainer>
        </Box>

        <Box sx={{ flex: 0.60, width: '50%', display: 'flex', flexDirection: 'column' }}>
          {/* Form on the top half */}
          <Box sx={{ 
            width: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: 3, 
            backgroundColor: '#f7f7f7',
            borderBottom: '1px solid #e0e0e0',
          }}>
            <Typography variant="h6" sx={{ marginBottom: '20px', color: '#333', fontWeight: 'medium' }}>
              Where did you start from?
            </Typography>
            
            <Box component="form" onSubmit={handleSearch} sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              width: '100%', 
              maxWidth: '500px',
              marginBottom: '20px',
            }}>
              {/* Location Button */}
              <IconButton onClick={handleUserLocation} sx={{ color: 'primary.main' }}>
                <MyLocationIcon />
              </IconButton>

              {/* Postcode Input */}
              <TextField
                fullWidth 
                size="small"
                label="Enter postcode"
                variant="outlined"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ flexGrow: 1 }}
              />
              <IconButton type="submit" aria-label="search" sx={{ color: 'primary.main' }}>
                <SearchIcon />
              </IconButton>
            </Box>
            
            <Typography variant="h6" sx={{ marginBottom: '20px', color: '#333', fontWeight: 'medium', textAlign: 'center' }}>
              How did you get here?
            </Typography>

            <Box sx={{ 
              marginBottom: '20px', 
              display: 'flex', 
              flexWrap: 'wrap',
              justifyContent: 'center', 
            }}>

              {transportModes.map((mode, index) => (
                <Box 
                  key={mode.name} 
                  sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    width: 80 
                  }}
                >
                  <IconButton
                    color={selectedMode === mode.name ? 'primary' : 'default'}
                    onClick={() => {
                      setSelectedMode(mode.name);
                      updateTimeBasedOnMode(distance, mode.name);
                    }}
                    sx={{ 
                      border: selectedMode === mode.name ? '2px solid' : '1px solid rgba(0, 0, 0, 0.23)', 
                      borderRadius: '50%', 
                      marginBottom: 1,
                    }}
                  >
                    {mode.icon}
                  </IconButton>
                  <Typography variant="caption" sx={{ textAlign: 'center' }}>
                    {mode.name.charAt(0).toUpperCase() + mode.name.slice(1)}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Button 
                onClick={handleCalculateClick} 
                variant="contained" 
                color="primary"
                sx={{ marginTop: '20px' }}
              >
                Calculate Now
              </Button>
            
            <Dialog
              open={isDialogOpen}
              onClose={() => setIsDialogOpen(false)}
              aria-labelledby="position-dialog-title"
              maxWidth="sm"
              fullWidth
            >
              <DialogTitle id="position-dialog-title">Location Information</DialogTitle>
              <DialogContent>
                {startPosition && (
                  <>
                    <Typography variant="body1" sx={{ mt: 2 }}>
                      Address: {address}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2 }}>
                      Distance to End Position: {(distance / 1000).toFixed(2)} km
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2 }}>
                      Estimated Time: {formatTime(time)}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2 }}>
                      Estimated Carbon Emissions: {calculateCarbonEmissions(distance, selectedMode)} kg CO2
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    Mode of Transport: 
                    {transportModes.find(mode => mode.name === selectedMode)?.icon}
                    {selectedMode}
                    </Typography>
                    <Dialog
                      open={isComparisonDialogOpen}
                      onClose={() => setIsComparisonDialogOpen(false)}
                      aria-labelledby="comparison-dialog-title"
                      fullWidth
                      maxWidth="xl"
                      sx={{
                        '& .MuiDialog-paper': {
                          borderRadius: 2,
                          padding: '24px',
                          overflowX: 'auto',
                        }
                      }}
                    >
                      <DialogTitle id="comparison-dialog-title" sx={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '20px' }}>
                        Compare The Potential Emissions
                      </DialogTitle>
                      <DialogContent>
                        <Box sx={{
                          display: 'flex', 
                          flexDirection: 'row', 
                          alignItems: 'center', 
                          gap: 2, 
                          flexWrap: 'wrap', 
                          justifyContent: 'center',
                          minWidth: 0,
                        }}>
                          {transportModes.map((mode) => (
                            <Box key={mode.name} sx={{
                              textAlign: 'center', 
                              minWidth: '150px',
                              margin: '10px',
                              flex: '1 1 auto',
                              maxWidth: '16.66%',
                            }}>
                              <Typography variant="h6" sx={{ fontSize: '1rem', color: '#333', marginBottom: '10px' }}>
                                {mode.name.charAt(0).toUpperCase() + mode.name.slice(1)}
                              </Typography>
                              <EmissionsGraph mode={mode.name} distance={distance} maxEmissionsScale={maxEmissionsScale} />
                            </Box>
                          ))}
                        </Box>
                      </DialogContent>
                      <DialogActions sx={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        {getRecommendationMessage(selectedMode)}
                        <Button
                          onClick={() => setIsComparisonDialogOpen(false)}
                          color="primary"
                          variant="contained"
                          sx={{
                            textTransform: 'none',
                            width: 'fit-content',
                            marginTop: 2, 
                          }}
                        >
                          Close
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={saveJourneyData} color="primary">Save Journey</Button>
                <Button onClick={() => setIsComparisonDialogOpen(true)} color="secondary">Compare</Button>
              </DialogActions>
            </Dialog>
            <Snackbar
              open={openSnackbar}
              autoHideDuration={6000}
              onClose={() => setOpenSnackbar(false)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
              <MuiAlert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
                Journey saved successfully!
              </MuiAlert>
            </Snackbar>
          </Box>

          {/* Tabs on the bottom half */}
          <Box sx={{ flex: 1, overflowY: 'auto', bgcolor: 'background.paper' }}>
            <TabContext value={tabValue}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs 
                  value={tabValue} 
                  onChange={handleTabChange} 
                  aria-label="User predictions and potential matches tabs" 
                  variant="fullWidth" 
                  indicatorColor="primary"
                  textColor="primary"
                  centered 
                  sx={{
                    '.MuiTab-root': { 
                      fontWeight: 'bold',
                    },
                    '.Mui-selected': { 
                      color: '#ff5722',
                      backgroundColor: '#e0e0e0',
                    }
                  }}
                >
                  <Tab 
                    icon={<InsightsIcon />} 
                    label="User Results" 
                    value="1"
                    wrapped 
                    sx={{
                      fontSize: '0.875rem', 
                    }}
                  />
                  <Tab 
                    icon={<GroupIcon />} 
                    label="Potential Matches" 
                    value="2"
                    wrapped 
                    sx={{
                      fontSize: '0.875rem',
                    }}
                  />
                </Tabs>
              </Box>
              <TabPanel value="1">
                {/* User Predictions Content */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Emissions Overview</Typography>
                  <EmissionsGraph mode={selectedMode} distance={distance} maxEmissionsScale={getMaxEmissionsValue(distance)} />
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    Your journey by {selectedMode.charAt(0).toUpperCase() + selectedMode.slice(1)} emitted {calculateCarbonEmissions(distance, selectedMode)} kg CO2.
                  </Typography>
                  
                  <Divider sx={{ width: '100%', my: 4 }} />

                  <Typography variant="h6" sx={{ mb: 2 }}>Shared Journeys</Typography>
                  <PieChart chartData={sharedJourneysChartData} />

                  <Divider sx={{ width: '100%', my: 4 }} />

                  <Typography variant="h6" sx={{ mb: 2 }}>Carbon Emissions by Journey</Typography>
                  <BarChart chartData={carbonEmissionsChartData} />

                  <Divider sx={{ width: '100%', my: 4 }} />

                  <Typography variant="h6" sx={{ mb: 2 }}>Distance Traveled in the Last 5 Journeys</Typography>
                  {/* Assuming LineChart and distanceChartData are set up */}
                  <LineChart chartData={distanceChartData} />
                </Box>
              </TabPanel>
              
              <TabPanel value="2">
                  {/* Potential Matches Content */}
                  <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
                      <Button
                          variant="contained"
                          color="primary"
                          onClick={fetchSearchResults}
                          sx={{ width: 'auto', textAlign: 'center' }}
                      >
                          Find Potential Matches
                      </Button>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
                      {Array.isArray(searchResults) && searchResults.length > 0 ? (
                          searchResults.map((user, index) => (
                              <Card key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 2, width: '100%' }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                      <Avatar>{user[0][0]}</Avatar>
                                      <Box sx={{ flexGrow: 1 }}>
                                          <Typography>{`${user[0]} ${user[1]}`}</Typography>
                                          <Typography variant="body2">{user[3]}</Typography>
                                          <Typography variant="body2">{user[2]}</Typography>
                                      </Box>
                                  </Box>
                                  <Box>
                                      <IconButton onClick={() => handleLocationClick(user[4], user[5], index)}>
                                          <LocationOnIcon color="secondary" />
                                      </IconButton>
                                      <Button variant="contained" sx={{ backgroundColor: 'green', '&:hover': { backgroundColor: 'darkgreen' } }}>
                                          Contact Now
                                      </Button>
                                  </Box>
                              </Card>
                          ))
                      ) : (
                          <Box sx={{ textAlign: 'center', mt: 2 }}>
                              <GroupIcon sx={{ fontSize: 60, color: '#bbb' }} />
                              <Typography variant="subtitle1" sx={{ color: '#aaa' }}>
                                  Click "Find Potential Matches" to see results.
                              </Typography>
                          </Box>
                      )}
                  </Box>
              </TabPanel>

            </TabContext>
          </Box>
        </Box>
      </Box>

      {/* Footer */}
      <Box component="footer" sx={{
        width: '100%',
        backgroundColor: '#013035',
        color: 'white',
        textAlign: 'center',
        padding: '15px 0',
        position: 'fixed',
        bottom: 0,
      }}>
        <Typography>© 2024 Ecomute - All rights reserved - Team 39</Typography>
      </Box>

    </>
  );
};

export default DashboardComponent;