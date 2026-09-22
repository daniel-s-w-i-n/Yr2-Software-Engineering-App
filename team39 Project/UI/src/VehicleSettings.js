import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Divider, TextField, Button, Box, IconButton, Avatar, Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Snackbar, Alert, InputLabel, MenuItem, FormControl, Select } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import PanoramaWideAngleIcon from '@mui/icons-material/PanoramaWideAngle';
import ShieldIcon from '@mui/icons-material/Shield';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import LogoutIcon from '@mui/icons-material/Logout';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

import { supabase } from './supabaseClient';

const VehicleSettings = () => {
  const navigate = useNavigate();

  const [numberPlate, setNumberPlate] = useState('');
  const [capacity, setCapacity] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [employeeID, setEmployeeID] = useState(null);

  const [labelNumberPlate, setLabelNumberPlate] = useState('');
  const [labelCapacity, setLabelCapacity] = useState('');

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const userEmail = localStorage.getItem('email');
  const [userName, setUserFullname] = useState('');
 
  // Fetches user details from the database using the email stored in local storage
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

  //Function to display labels
  useEffect(() => {
    const retrieveLabels = async () => {
      const { data, error } = await supabase
        .from('vehicleTable')
        .select('numberPlate, capacity')
        .eq('employeeID', employeeID);
  
      if (error) {
        console.error('Error retrieving labels:', error);
      } else if (data && data.length > 0) {
        setLabelNumberPlate(data[0].numberPlate);
        setLabelCapacity(data[0].capacity);
      } else {
        console.log('No data found for the given employee ID:', employeeID);
        // Handle the case when no data is returned
      }
    };
    if (employeeID) {
      retrieveLabels();
    }
  }, [employeeID]);

  // Function to fetch user details by email
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

  // Handles user sign out by removing relevant data from local storage and navigating to the home page
  const handleSignOut = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/');
  };

  // Updates the fuel type state based on selection in UI
  const handleChange = (event) => {
    setFuelType(event.target.value);
  };

  // Fetches additional user details and sets relevant states
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data, error } = await supabase
          .from('employeeTable')
          .select('firstName, lastName, employeeID')
          .eq('email', userEmail)
          .single();
        
        if (error) {
          throw error;
        }

        if (data) {
          setUserFullname(`${data.firstName} ${data.lastName}`);
          setEmployeeID(data.employeeID);

          // Logging the fetched data to the console
          console.log('User details fetched successfully:', {
            FullName: `${data.firstName} ${data.lastName}`,
            EmployeeID: data.employeeID
          });
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserData();
  }, [userEmail]);

  const updateVehicle = async () => {
    console.log('Updating vehicle with details:', {
        NumberPlate: numberPlate,
        Capacity: capacity,
        FuelType: fuelType,
        EmployeeID: employeeID
    });

    // Fetch existing vehicle data for the employee
    let vehicleData, vehicleError;
    try {
        const response = await supabase
            .from('vehicleTable')
            .select('numberPlate, capacity, fuelType')
            .eq('employeeID', employeeID);

        if (response.error) {
            throw response.error;
        }

        vehicleData = response.data;
    } catch (error) {
        console.error('Error retrieving vehicle data:', error);
        setSnackbarMessage('Error retrieving vehicle data');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        return;
    }

    // Prepare the data to be updated or inserted
    const updatedData = {
        numberPlate: numberPlate,
        capacity: capacity,
        fuelType: fuelType,
        employeeID: employeeID
    };

    try {
        let data, error;

        // If vehicle data exists, update it; otherwise, insert new vehicle data
        if (vehicleData && vehicleData.length > 0) {
            ({ data, error } = await supabase
                .from('vehicleTable')
                .update(updatedData)
                .eq('employeeID', employeeID));
        } else {
            ({ data, error } = await supabase
                .from('vehicleTable')
                .insert([updatedData]));
        }

        if (error) {
            throw error;
        }

        console.log('Vehicle updated/inserted successfully:', data);
        setSnackbarMessage('Vehicle updated/inserted successfully!');
        setSnackbarSeverity('success');
    } catch (error) {
        console.error('Error updating/inserting vehicle:', error);
        setSnackbarMessage('Error updating/inserting vehicle');
        setSnackbarSeverity('error');
    } finally {
        setSnackbarOpen(true);
    }
};
  
  return (
    <>
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
          onClick={() => navigate('/CalenderPage')}
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

    <Box sx={{ display: 'flex', height: 'calc(100vh - 144px)', padding: '16px'}}>
      {/* Left section */}
      <Box sx={{ flex: 1, height: 'calc(100% - 20px)', borderRadius: '16px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)'}}>
        {/* Grid container to hold the menu options */}
        <Grid container direction="column" justifyContent="space-between" alignItems="stretch" height="100%" padding="16px">
          {/* Menu options */}
          <Grid item>
          <nav aria-label="account side menu">
            <List>
              <ListItem disablePadding>
                <ListItemButton onClick={() => navigate('/account')}>
                  <ListItemIcon>
                    <SettingsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Account Settings" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <DirectionsCarIcon />
                  </ListItemIcon>
                  <ListItemText primary="Vehicle Settings" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <NotificationsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Notifications" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <PanoramaWideAngleIcon />
                  </ListItemIcon>
                  <ListItemText primary="Appearance" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <ShieldIcon />
                  </ListItemIcon>
                  <ListItemText primary="Privacy and Security" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <QuestionMarkIcon />
                  </ListItemIcon>
                  <ListItemText primary="Help and Support" />
                </ListItemButton>
              </ListItem>
            </List>
          </nav>
          </Grid>
          {/* Sign out */}
          <Grid item>
            <List>
              <ListItem disablePadding>
                <ListItemButton onClick={handleSignOut}>
                  <ListItemIcon>
                    <LogoutIcon />
                      </ListItemIcon>
                    <ListItemText primary="Sign Out" />
                  </ListItemButton>
                </ListItem>
              </List>
          </Grid>
        </Grid>
      </Box>
      {/* Right section */}
      <Box sx={{ flex: 4, borderRadius: '16px', marginLeft: '20px', marginBottom: '20px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)', padding: '20px' }}>
          {/* Title */}
          <Typography variant="h3" sx={{ textAlign: 'center', marginBottom: '20px'}}>Vehicle Settings</Typography>
          {/* Divider */}
          <Divider sx={{ marginBottom: '20px' }} />
            <Grid container spacing={2} sx={{ marginBottom: '20px' }}>
              {/* Number Plate */}
              <Grid item xs={6}>
                <Typography variant="body1" sx={{ marginBottom: '10px' }}>Number Plate</Typography>
                <TextField 
                  variant="outlined" 
                  fullWidth 
                  //size="small"
                  label={labelNumberPlate}
                  value={numberPlate}
                  onChange={(event) => {
                    const regex = /^[A-Z0-9]*$/;
                    const inputValue = event.target.value;
                  
                    if (regex.test(inputValue) && inputValue.length <= 7) {
                      setNumberPlate(inputValue);
                    }
                  }}
                />
              </Grid>
              {/* Vehicle Capacity */}
              <Grid item xs={6}>
                <Typography variant="body1" sx={{ marginBottom: '10px' }}>Vehicle Capacity</Typography>
                <TextField 
                  variant="outlined" 
                  fullWidth 
                  //size="small"
                  label={labelCapacity}
                  value={capacity}
                  onChange={(event) => {
                    const regex = /^[0-9]*$/;
                    const inputValue = event.target.value;
                  
                    if (regex.test(inputValue) && inputValue <= 10) {
                      setCapacity(inputValue);
                    }
                  }}
                />
              </Grid>
              {/* Fuel Type */}
              <Grid item xs={6}>
                <Typography variant="body1" sx={{ marginBottom: '10px' }}>Fuel Type</Typography>
                <FormControl fullWidth>
                    <InputLabel id="fuel-type-label">Fuel Type</InputLabel>
                    <Select
                        labelId="fuel-type-label"
                        id="fuel-type-select"
                        value={fuelType}
                        label="Fuel Type"
                        onChange={handleChange}
                        >
                        <MenuItem value={0}>Diesel</MenuItem>
                        <MenuItem value={1}>Petrol</MenuItem>
                        <MenuItem value={2}>Electric</MenuItem>
                    </Select>
                </FormControl>
                </Grid>
            </Grid>
            {/* Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
              <Button variant="contained" color="primary" sx={{ marginRight: '10px' }} onClick={updateVehicle}>Update Vehicle</Button> 
              <Button variant="contained" color="error" onClick={() => {setNumberPlate(''); setCapacity(''); setFuelType('')}}>Reset</Button>
            </Box>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
              <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
                {snackbarMessage}
              </Alert>
            </Snackbar>
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

export default VehicleSettings;