import React, { useState, useEffect } from 'react'; // Import useState for managing form state
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

// Component for managing the user's account page
const AccountPage = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('')

  const [labelFirstName, setLabelFirstName] = useState('');
  const [labelLastName, setLabelLastName] = useState('');
  const [labelEmail, setLabelEmail] = useState('');
  const [labelPhoneNumber, setLabelPhoneNumber] = useState('');

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const userEmail = localStorage.getItem('email');
  const [userName, setUserFullname] = useState('');
 
  // Fetches user details from the database on component mount and updates state
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
 
  // Function to fetch user details from the database
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

  // Function to handle sign out action
  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');

    navigate('/');
  };
  const handleChange = (event) => {
    setRole(event.target.value);
  };

  //Function to display labels
  useEffect(() => {
    const retrieveLabels = async () => {
      const { data, error } = await supabase
        .from('employeeTable')
        .select('firstName, lastName, email, phoneNumber, departmentID')
        .eq('email', userEmail);
  
      if (error) {
        console.error('Error retrieving labels', error);
      } else {
        setLabelFirstName(data[0].firstName);
        setLabelLastName(data[0].lastName);
        setLabelEmail(data[0].email);
        setLabelPhoneNumber(data[0].phoneNumber);
      }
    };
    retrieveLabels();
  }, );

  // Function to update user profile information in the database
  const updateProfile = async () => {
    const { data: userData, error: userError } = await supabase
    .from('employeeTable')
    .select('firstName, lastName, email, phoneNumber, departmentID')
    .eq('email', userEmail);

    if (userError) {
    console.error('Error retrieving user data:', userError);
    setSnackbarMessage('Failed to retrieve user data. Please try again.');
    setSnackbarSeverity('error');
    return;
    }
  
  const updatedData = {
    firstName: firstName || userData[0].firstName,
    lastName: lastName || userData[0].lastName,
    email: email || userData[0].email,
    phoneNumber: phoneNumber || userData[0].phoneNumber,
    departmentID: role || userData[0].departmentID
  };

  // Update user data
  const { data, error } = await supabase
    .from('employeeTable')
    .update(updatedData)
    .eq('email', userEmail);

  if (error) {
    console.error('Error updating profile:', error);
    setSnackbarMessage('Failed to update profile. Please try again.');
  } else {
    console.log('Profile updated successfully:', data);
    setSnackbarMessage('Profile updated successfully.');
    setSnackbarSeverity('success');
  }
  setSnackbarOpen(true);
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

{/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}

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
                <ListItemButton>
                  <ListItemIcon>
                    <SettingsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Account Settings" />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton onClick={() => navigate('/VehicleSettings')}>
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
          <Typography variant="h3" sx={{ textAlign: 'center'}}>Account Settings</Typography>
          {/* Profile Picture */}
          <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
          </Box>
          {/* Divider */}
          <Divider sx={{ marginBottom: '20px' }} />
            <Grid container spacing={2} sx={{ marginBottom: '20px' }}>
              {/* First Name */}
              <Grid item xs={6}>
                <Typography variant="body1" sx={{ marginBottom: '10px' }}>First Name</Typography>
                <TextField 
                  variant="outlined" 
                  fullWidth 
                  //size="small"
                  label={labelFirstName}
                  value={firstName}
                  onChange={(event) => {
                    const regex = /^[A-Za-z-]*$/;
                    if (regex.test(event.target.value) || event.target.value === "") {
                      setFirstName(event.target.value);
                    }
                  }}
                />
              </Grid>
              {/* Last Name */}
              <Grid item xs={6}>
                <Typography variant="body1" sx={{ marginBottom: '10px' }}>Last Name</Typography>
                <TextField 
                  variant="outlined" 
                  fullWidth 
                  //size="small"
                  label={labelLastName}
                  value={lastName}
                  onChange={(event) => {
                    const regex = /^[A-Za-z-]*$/;
                    if (regex.test(event.target.value) || event.target.value === "") {
                      setLastName(event.target.value);
                    }
                  }}
                />
              </Grid>
              {/* Email */}
              <Grid item xs={6}>
                <Typography variant="body1" sx={{ marginBottom: '10px' }}>Email</Typography>
                <TextField 
                  variant="outlined" 
                  fullWidth 
                  //size="small"
                  label={labelEmail}
                  value={email}
                  error={!email.includes('@') && email.length > 0} 
                  helperText={!email.includes('@') && email.length > 0 ? 'Email must contain an @' : ''}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              {/* Phone Number */}
              <Grid item xs={6}>
                <Typography variant="body1" sx={{ marginBottom: '10px' }}>Phone Number</Typography>
                <TextField 
                  variant="outlined" 
                  fullWidth 
                  //size="small"
                  label={labelPhoneNumber}
                  value={phoneNumber}
                  onChange={(event) => {
                    const regex = /^[+]?[0-9]*$/;
                    const inputValue = event.target.value;
  
                    if (regex.test(inputValue) && ((inputValue.startsWith('+') && inputValue.length <= 12) || (!inputValue.startsWith('+') && inputValue.length <= 11))) {
                      setPhoneNumber(inputValue);
                    }
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1" sx={{ marginBottom: '10px' }}>Department</Typography>
                <FormControl fullWidth>
                    <InputLabel id="role-label">Department</InputLabel>
                    <Select
                        labelId="role-label"
                        id="role-select"
                        value={role}
                        label="Department"
                        onChange={handleChange}
                        >
                        <MenuItem value={''}>None</MenuItem>
                        <MenuItem value={0}>HR</MenuItem>
                        <MenuItem value={1}>Marketing</MenuItem>
                        <MenuItem value={2}>IT</MenuItem>
                        <MenuItem value={3}>Sales</MenuItem>
                        <MenuItem value={4}>Management</MenuItem>
                    </Select>
                </FormControl>
                </Grid>
            </Grid>
            {/* Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
              <Button variant="contained" color="primary" sx={{ marginRight: '10px' }} onClick={updateProfile}>Update Profile</Button>
              <Button variant="contained" color="error" onClick={() => {setFirstName(''); setLastName(''); setEmail(''); setPhoneNumber('')}}>Reset</Button>
            </Box>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
              <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
                {snackbarMessage}
              </Alert>
            </Snackbar>
          </Box>
        </Box>
        
{/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
          
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

export default AccountPage;