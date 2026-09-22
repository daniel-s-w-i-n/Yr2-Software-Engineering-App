import React from 'react';
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient'; // Assuming you saved supabaseClient.js in the same directory
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Avatar, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid, TextField, InputAdornment, Alert, TablePagination, TableSortLabel, InputLabel, MenuItem, FormControl, Select } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import EventIcon from '@mui/icons-material/Event';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';

// Component to manage calendar-based user interactions in a React application
const CalenderPage = () => {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('email');
  const [userName, setUserFullname] = useState('');
 
  // State management for various data and UI control elements.
  const [data, setData] = useState([]);
  const [cleared, setCleared] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [error, setError] = useState(null);
  const [queryDate, setQueryDate] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('journeyId');
  const [searchTerm, setSearchTerm] = useState('');
  const [transportMethod, setTransportMethod] = useState('')

  // Logs out the user and navigates to the start page of the application
  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    
    navigate('/'); // navigates to the root (start of application)
  };

   // Fetches user details from the server and updates the userName state
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
 
  // Asynchronously retrieves user details from the 'employeeTable' in the database using the user's email
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

  // Sets the start date for the calendar and clears any errors
  const handleStartDateChange = (date) => {
    setStartDate(date);
    setError(null);
  };
  
  // Sets the end date for the calendar and clears any errors
  const handleEndDateChange = (date) => {
    setEndDate(date);
    setError(null);
  };

  // Validates and sets the query date for fetching data
  const handleQuery = () => {
    if (startDate && endDate && dayjs(endDate).isBefore(dayjs(startDate))) {
      setError("End date must be after the start date");
    } else {
      setQueryDate(new Date())
    }
  }

  // Control for changing the current page
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

   // Handles the number of rows per page in the data table
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Controls sorting of data in the table based on specified property
  const handleSort = (property) => (event) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Filters the displayed data according to search terms and selected transport method.
  const filteredData = data
  .filter((row) =>
    row.postCode.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .filter((row) =>
    !transportMethod || row.MOTID === transportMethod
  );

  // Updates the transport method state based on user selection
  const handleChange = (event) => {
    setTransportMethod(event.target.value);
  };

  // Function to define sorting order for data comparison
  function getComparator(order, orderBy) {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }
  
  // Compares two values based on the order and property to sort by
  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  // Sorts the data array in a stable manner based on the comparator function
  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  // Converts a numeric mode of transport into a readable string
  function MOTChange(num) {
    if (num === 0) {
      return 'Walking';
    } else if (num === 1) {
      return 'Cycling';
    } else if (num === 2) {
      return 'Bus';
    } else if (num === 3) {
      return 'Petrol Car';
    } else if (num === 4) {
      return 'Electric Car';
    } else {
      return 'Diesel Car';
    }
  }

  // Resets the 'cleared' state after a timeout to manage UI feedback
  useEffect(() => {
    if (cleared) {
      const timeout = setTimeout(() => {
        setCleared(false);
      }, 1500);

      return () => clearTimeout(timeout);
    }
    return () => {};
  }, [cleared]);

   // Fetches and updates the journey data based on the specified date range

  useEffect(() => {
    const fetchData = async () => {
      const start = startDate ? dayjs(startDate).format('YYYY-MM-DD') : '2020-01-01'
      const end = endDate ? dayjs(endDate).format('YYYY-MM-DD') : '2030-12-31'
      const { data, error } = await supabase
        .from('journeyTable')
        .select('*')
        .gte('entryDate', start)
        .lte('entryDate', end);
      if (error) {
        console.error('error fetching data:', error);
      } else {
        setData(data);
      }     
      
    };

    fetchData();
  }, [queryDate]);

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
          onClick={() => {}}
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

    {data.length > 0 && (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Grid container spacing={3} sx={{justifyContent: 'center', alignItems: 'center', width: '100%', marginBottom: '10px'}}>
            <Grid item xs={3} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Typography variant="h5" >Previous Journeys</Typography>          
            </Grid>
            <Grid item xs={2.5} sx={{ display: 'flex', justifyContent: 'center' }}>
                <TextField 
                  fullWidth 
                  id="quick-search" 
                  label="Search Postcodes" 
                  variant="outlined"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)} 
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon/>
                      </InputAdornment>
                    ),
                  }}/>    
            </Grid>
            <Grid item xs={1} sx={{ display: 'flex', justifyContent: 'center' }}>
            <FormControl variant="standard" sx={{ m: 1, minWidth: 100 }}>
              <InputLabel id="simple-select-standard-label">Transport Method</InputLabel>
                <Select
                  labelId="simple-select-standard-label"
                  id="simple-select-standard"
                  value={transportMethod}
                  onChange={handleChange}
                  label="Transport Method"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={0}>Walking</MenuItem>
                  <MenuItem value={1}>Cycling</MenuItem>
                  <MenuItem value={2}>Bus</MenuItem>
                  <MenuItem value={3}>Petrol Car</MenuItem>
                  <MenuItem value={4}>Electric</MenuItem>
                  <MenuItem value={5}>Diesel</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Grid item xs={2.5} sx={{ display: 'flex', justifyContent: 'center' }}>
                <DesktopDatePicker 
                  label='Start Date' 
                  value={startDate} 
                  onChange={handleStartDateChange}
                  slotProps={{field: { clearable: true, onClear: () => setCleared(true) },}}
                />
              </Grid>
              <Grid item xs={2.5} sx={{ display: 'flex', justifyContent: 'center' }}>
                <DesktopDatePicker 
                  label='End Date' 
                  value={endDate} 
                  onChange={handleEndDateChange}
                  slotProps={{field: { clearable: true, onClear: () => setCleared(true) },}}
                  />
              </Grid>
            </LocalizationProvider>
            <Grid item onClick={handleQuery} xs={.5} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button>View</Button>
            </Grid>
            {error && ( <Grid item justifyContent='center' xs={12}>
              <Alert severity="error">End Date must be after Start Date</Alert>
            </Grid>)
            }
          </Grid>        
          <TableContainer component={Paper}>
            <Table stickyHeader sx={{ minWidth: 650 }} aria-label="journeys table">
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: 'bold' }}>
                    <TableSortLabel>Journey ID</TableSortLabel>
                  </TableCell>
                  <TableCell style={{ fontWeight: 'bold' }} align="center">Post Code</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }} align="center">Estimated Time Taken (min)</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }} align="center">Distance (m)</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }} align="center">Carbon Emissions Results</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }} align="center">Transport Method</TableCell>
                  {/* <TableCell align="right">Employee ID</TableCell> */}
                  {/* <TableCell align="right">Address</TableCell> */}
                  {/* <TableCell align="right">Start Lat/Long</TableCell> */}
                  {/* <TableCell align="right">End Lat/Long</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {stableSort(filteredData, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                  <TableRow key={row.journeyid}>
                    <TableCell component="th" scope="row">{row.journeyid}</TableCell>
                    <TableCell align="center">{row.postCode}</TableCell>
                    <TableCell align="center">{row.estimatedTimeTaken}</TableCell>
                    <TableCell align="center">{row.distance}</TableCell>
                    <TableCell align="center">{row.carbonEmissionsResults}</TableCell>
                    <TableCell align="center">{MOTChange(row.MOTID)}</TableCell>
                    {/* <TableCell align="right">{row.employeeID}</TableCell> */}
                    {/* <TableCell align="right">{row.address}</TableCell> */}
                    {/* <TableCell align="right">{`${row.startLat}, ${row.startLong}`}</TableCell> */}
                    {/* <TableCell align="right">{`${row.endLat}, ${row.endLong}`}</TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            style={{ marginBottom: '50px' }}
            component="div"
            count={data.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
          />
        </Container>
      )}
          
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

export default CalenderPage;
