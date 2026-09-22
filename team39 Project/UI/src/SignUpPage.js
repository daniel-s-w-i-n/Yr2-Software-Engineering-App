// Import necessary dependencies
import React, { useState, useEffect } from 'react';
import { 
  // Material-UI components
  TextField, Button, InputAdornment, IconButton, Grid, Box, Typography, Snackbar, Alert, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel, Link, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions 
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';

// SignUpComponent functional component

const SignUpComponent = () => {
    // State variables for form inputs

  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [department, setDepartment] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Mapping of department names to their corresponding IDs
  const departmentIDMapping = {
    HR: 0,
    Marketing: 1,
    IT: 2,
    Sales: 3,
    Management: 4,
  };

  // State variables for password input
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  // State variables for snackbar notification
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // State variables for terms dialog
  const [termsDialogOpen, setTermsDialogOpen] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // State variables for verification and success dialogs
  const [verificationDialogOpen, setVerificationDialogOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  // State variables for error handling and verification code input
  const [error, setError] = useState('');
  const [userInputCode, setUserInputCode] = useState('');

  // React Router navigation hook
  const navigate = useNavigate();

  // Function to handle closing of the snackbar
  const handleSnackbarClose = (event, reason) => {

      // If the user clicked away from the snackbar, do nothing
    if (reason === 'clickaway') {
      return;
      }
    // Close the snackbar
    setSnackbarOpen(false);
    };

  // useEffect to validate password format using a regular expression
  useEffect(() => {

      // Regular expression to enforce a password format with at least one digit and one special character
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    setPasswordError(!regex.test(password));
  }, [password]);

  // Function to toggle the visibility of the terms dialog
  const toggleTermsDialog = () => {
    setTermsDialogOpen(!termsDialogOpen);
  };

  // Function to toggle the visibility of the password input
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Function to handle form submission for signing up
  const handleSignUpSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    // Check if any required fields are empty
    if (!email || !firstName || !lastName || !department || !phoneNumber || !password) {
      setSnackbarMessage('Please fill in all fields.');
      setSnackbarOpen(true);
      return;
    }

    // Validate email format
    if (!email.includes('@')) {
      setSnackbarMessage('Email Must Include an @');
      setSnackbarOpen(true); // Display snackbar message
      return; // Exit function early
    }

    if (!termsAccepted) {
      setSnackbarMessage('You must accept the terms and conditions to proceed.');
      setSnackbarOpen(true); // Display snackbar message
      return; // Exit function early
    }

    if (passwordError) {
      setSnackbarMessage('Password does not meet requirements');
      setSnackbarOpen(true); // Display snackbar message
      return; // Exit function early
    }

    try {
      const phoneNumberExists = await checkPhoneNumberExists(phoneNumber);
      if (phoneNumberExists) {
        setSnackbarMessage('Phone number already exists, please try again');
        setSnackbarOpen(true); // Display snackbar message
        return; // Exit function early
      } 
    } catch (error) {
      // Throw the error for developers to handle
      throw new Error('Error occurred while checking if phone number exists:', error);
    }

    try {
      const emailExists = await checkEmailExists(email);
      if (emailExists) {
        setSnackbarMessage('Email already exists, please try again');
        setSnackbarOpen(true); // Display snackbar message
        return; // Exit function early
      } else {
        setVerificationDialogOpen(true); // Open verification dialog
        await sendVerificationCode(); //send a verification code to the email entered via the backend server
      }
    } catch (error) {
      throw new Error('An error occured during email validation process');
    }
  };

  // Function to check if a phone number already exists in the backend
  const checkPhoneNumberExists = async (phoneNumber) => {
    try {
      // Prepare data to be sent in the request
      const phoneNumberData = {
        phoneNumber: phoneNumber
      };
      // Send a POST request to the backend server to check if the phone number exists
      const response = await fetch('http://localhost:8080/auth/phoneNumberExists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(phoneNumberData), //Stringify an object with the phoneNumber property
      });
      // If the response status is not okay, throw an error

      if (!response.ok) {
        throw new Error('Backend server failed to check if phone Number exists');
      }

      // Parse response data
      const data = await response.json();
      const phoneNumberExists = data.phoneNumberExists;

      // Return whether the phone number exists or not
      return phoneNumberExists;

    // Throw an error if there's an issue with the backend server
    } catch {
      throw new Error('Backend server failed to check if phone Number exists');
    }
  };

  // Function to check if an email already exists in the backend
  const checkEmailExists = async (email) => {
    try {
    // Prepare data to be sent in the request
      const emailData = {
        username: email
      };

      // Send a POST request to the backend server to check if the email exists
      const response = await fetch('http://localhost:8080/auth/emailExists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData), // Make sure to stringify an object with the username property
      });
    
      // If the response status is not okay, throw an error
      if (!response.ok) {
        throw new Error('Backend server failed to check if email exists');
      }
      // Parse response data      
      const data = await response.json();
      const emailExists = data.emailExists;

      // Return whether the email exists or not
      return emailExists;

    // Throw an error if there's an issue with the backend server
    } catch {
      throw new Error('Backend server failed to check if email exists');
    }
  };

  // Function to send a verification code to the user's email
  const sendVerificationCode = async () => {

    try {
    // Prepare data to be sent in the request
      const emailData = {
        email: email
      };

      // Send a POST request to the backend server to save the email token
      const response = await fetch('http://localhost:8000/auth/saveEmailToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData), // Make sure to stringify an object with the email property
      });

      // If the response status is not okay, throw an error
      if (!response.ok) {
        throw new Error('Backend server failed to send token to email');
      }
    } catch {
      // Throw an error if there's an issue with the backend server
      throw new Error('Backend server failed to send token to email');
    }

  }

  // Function to verify the provided verification code with the backend 
  const verifyCode = async () => {
    // Prepare data to be sent in the request
    try {
      const emailData = {
        email: email,
        emailToken: userInputCode
      };

      // Send a POST request to the backend server to verify the email token
      const response = await fetch('http://localhost:8000/auth/verifyEmailToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      // If the response status is not okay, throw an error
      if (!response.ok) {
        throw new Error('Failed to verify email or email token');
      }

      // Parse response data
      const data = await response.json();
      const validEmailToken = data.verified;

      // If the email token is valid, close the verification dialog, open the success dialog, and save user data
      if (validEmailToken) {
        setVerificationDialogOpen(false);
        setSuccessDialogOpen(true);
        await saveUserData();
      } else {

        // If the email token is invalid, display a snackbar message to the user
        setSnackbarMessage('Invalid verification code, please try again');
        setSnackbarOpen(true);
      }
    } catch (error) {

    // Throw an error for developers to handle
    throw new Error('Error verifying email or email token:', error);
    }
  };

  // Function to save user data by registering the user
  const saveUserData = async () => {
    try {

      // Retrieve department ID from departmentIDMapping
      const departmentID = departmentIDMapping[department];

      // Prepare user data to be sent in the request
      const userData = {
        username: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
        departmentID: departmentID,
      };

      // Send a POST request to register the user
      const response = await fetch('http://localhost:8080/auth/register', { //replace this with url to server hosting
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      // Parse response data
      const data = await response.json();

      // If the response status is not okay, throw an error with the error message from the server
      if (!response.ok) {
        throw new Error(data.message || 'Failed to sign up');
      }

    // Close the verification dialog and open the success dialog
      setVerificationDialogOpen(false)
      setSuccessDialogOpen(true);

    // Return an object indicating failure along with an error message
    } catch (error) {
      return { success: false, error: 'Failed to sign up' };
    }
  }

  return (
    <>
      <Box sx={{ position: 'absolute', top: 15, left: 20 }}>
        <img src="./eviden-logo.png" alt="Eviden Logo" style={{ width: '350px' }} />
      </Box>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Grid container spacing={2} style={{ height: '100vh', alignItems: 'center' }}>
        <Grid item xs={12} md={6} style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ maxWidth: '500px', width: '100%' }}>
            <h1 style={{ marginTop: '30px', fontSize: '40px' }}>Create An Account</h1>
            <Typography variant="h6" sx={{ mb: '30px' }}>Fill in these details to get started</Typography>
            <form onSubmit={handleSignUpSubmit}>
              <TextField
                fullWidth
                label="First Name"
                variant="outlined"
                margin="dense"
                value={firstName}
                onChange={(event) => {
                  const regex = /^[A-Za-z-]*$/;
                  if (regex.test(event.target.value) || event.target.value === "") {
                    setFirstName(event.target.value);
                  }
                }}
                sx={{
                  borderRadius: '16px',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '16px',
                  },
                }}
              />
              <TextField
                fullWidth
                label="Last Name"
                variant="outlined"
                margin="dense"
                value={lastName}
                onChange={(event) => {
                  const regex = /^[A-Za-z-]*$/;
                  if (regex.test(event.target.value) || event.target.value === "") {
                    setLastName(event.target.value);
                  }
                }}
                sx={{
                  borderRadius: '16px',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '16px',
                  },
                }}
              />
              <FormControl fullWidth margin="dense" variant="outlined" sx={{ borderRadius: '16px', '& .MuiOutlinedInput-root': { borderRadius: '16px' } }}>
                <InputLabel id="department-label">Department</InputLabel>
                <Select
                  labelId="department-label"
                  id="department"
                  value={department}
                  onChange={(event) => setDepartment(event.target.value)}
                  label="Department"
                  sx={{ borderRadius: '16px' }}
                >
                  <MenuItem value="HR">HR</MenuItem>
                  <MenuItem value="Marketing">Marketing</MenuItem>
                  <MenuItem value="IT">IT</MenuItem>
                  <MenuItem value="Sales">Sales</MenuItem>
                  <MenuItem value="Management">Management</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                type="email"
                label="Email"
                variant="outlined"
                margin="dense"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                error={!email.includes('@') && email.length > 0}
                helperText={!email.includes('@') && email.length > 0 ? 'Email must contain an @' : ''}
                sx={{
                  borderRadius: '16px',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '16px',
                  },
                }}
              />
              <TextField
                fullWidth
                label="Phone Number"
                variant="outlined"
                type="text"
                margin="dense"
                value={phoneNumber}
                onChange={(event) => {
                  const regex = /^[+]?[0-9]*$/;
                  const inputValue = event.target.value;

                  if (regex.test(inputValue) && ((inputValue.startsWith('+') && inputValue.length <= 12) || (!inputValue.startsWith('+') && inputValue.length <= 11))) {
                    setPhoneNumber(inputValue);
                  }
                }}
                sx={{
                  borderRadius: '16px',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '16px',
                  },
                }}
              />
              <TextField
                fullWidth
                label="Password"
                variant="outlined"
                required
                type={showPassword ? 'text' : 'password'}
                margin="dense"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                error={passwordError}
                sx={{
                  borderRadius: '16px',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '16px',
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={togglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Box sx={{ mt: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      name="termsAccepted"
                      color="primary"
                    />
                  }
                  label={
                    <Typography>
                      I agree to the <Link href="#" onClick={toggleTermsDialog} underline="hover">Terms of Usage</Link>.
                    </Typography>
                  }
                />
              </Box>

              <Button
                variant="contained"
                fullWidth
                type="submit"
                disabled={!termsAccepted}
                sx={{
                  mt: 2,
                  backgroundColor: '#239F3C',
                  ':hover': {
                    backgroundColor: '#1e8a34',
                  },
                  borderRadius: '16px'
                }}
              >
                Sign Up
              </Button>

              <Dialog open={verificationDialogOpen} onClose={() => setVerificationDialogOpen(false)}>
                <DialogTitle>Verification Needed</DialogTitle>
                <DialogContent>
                  <DialogContentText>Please enter the verification code sent to your email</DialogContentText>
                  <TextField
                    autoFocus
                    margin="dense"
                    label="Verification Code"
                    type="text"
                    fullWidth
                    value={userInputCode}
                    onChange={(e) => setUserInputCode(e.target.value)}
                    error={!!error}
                    helperText={error}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={verifyCode}>Verify Email</Button>
                </DialogActions>
              </Dialog>

              {/* Success Dialog */}
              <Dialog
                open={successDialogOpen}
                onClose={() => setSuccessDialogOpen(false)}
                aria-labelledby="success-dialog-title"
              >
                <DialogTitle id="success-dialog-title">Success</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Your user details have been successfully saved!
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => navigate('/login')} color="primary">
                    Go to Login
                  </Button>
                </DialogActions>
              </Dialog>



              {error && (
                <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
                  <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
                    {error}
                  </Alert>
                </Snackbar>
              )}

              <Dialog open={termsDialogOpen} onClose={toggleTermsDialog}>
                <DialogTitle>Terms of Usage</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    ECOMUTE provides a platform for users to find eco-friendly commuting options, including carpool matching, emissions tracking, and sustainable route suggestions.
                  </DialogContentText>
                  <br />
                  <DialogContentText>
                    Our services are designed to help you reduce your carbon footprint and engage in more sustainable commuting practices.
                  </DialogContentText>
                  <br />
                  <DialogContentText>
                    <strong>User Responsibilities:</strong>
                  </DialogContentText>
                  <br />
                  <DialogContentText>
                    <strong>Account Registration:</strong> You must provide accurate and complete information during the registration process.
                  </DialogContentText>
                  <br />
                  <DialogContentText>
                    <strong>Privacy:</strong> Keep your login credentials confidential and notify us immediately of any unauthorised use of your account.
                  </DialogContentText>
                  <br />
                  <DialogContentText>
                    <strong>Compliance:</strong> You agree to comply with all local laws and regulations regarding transportation and environmental protection.
                  </DialogContentText>
                  <br />
                  <DialogContentText>
                    <strong>Content and Conduct:</strong>
                  </DialogContentText>
                  <br />
                  <DialogContentText>
                    <strong>User-Generated Content:</strong> You are responsible for the content you create on our platform. Do not share anything illegal, offensive, or harmful.
                  </DialogContentText>
                  <br />
                  <DialogContentText>
                    <strong>Respectful Interaction:</strong> Treat all users with respect and courtesy. Harassment, bullying, or any form of discrimination will not be tolerated.
                  </DialogContentText>
                  <br />
                  <DialogContentText>
                    <strong>Intellectual Property:</strong> The content and software provided by ECOMUTE are the property of ECOMUTE and are protected by copyright laws. You may not copy, modify, or distribute our materials without our express consent.
                  </DialogContentText>
                  <br />
                  <DialogContentText>
                    <strong>Disclaimers and Limitations of Liability:</strong> ECOMUTE is provided "as is," without warranties of any kind. We do not guarantee the accuracy, reliability, or timeliness of our services. We are not liable for any damages or losses resulting from your use of ECOMUTE.
                  </DialogContentText>
                  <br />
                  <DialogContentText>
                    <strong>Modifications to Terms of Service:</strong> ECOMUTE reserves the right to modify these terms at any time. We will notify you of any significant changes, and your continued use of our services constitutes your acceptance of the modified terms.
                  </DialogContentText>
                  <br />
                  <DialogContentText>
                    <strong>Governing Law:</strong> These terms are governed by the laws of the United Kingdom, without regard to its conflict of laws principles.
                  </DialogContentText>
                  <br />
                  <DialogContentText>
                    <strong>Contact Us:</strong> For any questions or concerns regarding these terms, please contact us at commuteteam@gmail.com. By clicking "I Agree," you acknowledge that you have read, understood, and agreed to be bound by these Terms of Service.
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={toggleTermsDialog}>Close</Button>
                </DialogActions>
              </Dialog>

              <Typography
                sx={{
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  mt: 2,
                  textAlign: 'center',
                }}
                onClick={() => navigate('/login')}
              >
                Have an account? Log In
              </Typography>
            </form>
          </div>
        </Grid>

        <Grid item xs={0} md={6} style={{
          background: `linear-gradient(to left, rgba(255,255,255,0) 50%, rgba(255,255,255,1) 100%), url('./map-image.png')`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          height: '100vh',
        }} />
      </Grid>

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

export default SignUpComponent;
