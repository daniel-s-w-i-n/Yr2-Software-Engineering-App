// Import necessary dependencies
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, InputAdornment, IconButton, Grid, Box, Typography, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Alert, DialogContentText } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CloseIcon from '@mui/icons-material/Close';
import { jwtDecode } from 'jwt-decode';

const LoginComponent = () => {

  // State variables for login form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // State variables for password reset
  const [openForgotPassword, setOpenForgotPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordResetEmail, setPasswordResetEmail] = useState('');

  // State variables for password error handling
  const [passwordError, setPasswordError] = useState(false);
  const [newPasswordError, setNewPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);

  // State variables for snackbar notifications
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // State variables for email verification
  const [openEmailVerification, setOpenEmailVerification] = useState(false);

  // State variables for password reset via email  
  const [OpenSendCodeToEmail, setOpenSendCodeToEmail] = useState(false);
  const [userInputCode, setUserInputCode] = useState('');
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  // State variable for general error handling
  const [error, setError] = useState('');

  // useEffect to validate password format when password changes
  useEffect(() => {

    // Regular expression to enforce a password format with at least one digit and one special character
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    // Set passwordError state based on regex test result 
    setPasswordError(!regex.test(password));
  }, [password]);

  // useEffect to validate new password format when new password changes 
  useEffect(() => {
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
  // Set newPasswordError state based on regex test result
    setNewPasswordError(!regex.test(newPassword));
  }, [newPassword]);

  // useEffect to validate confirm password format when confirm password changes
  useEffect(() => {
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;

    // Set confirmPasswordError state based on regex test result
    setConfirmPasswordError(!regex.test(confirmPassword));
  }, [confirmPassword]);

  // Get the navigation function from the router 
  const navigate = useNavigate();

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Function to handle closing of the snackbar 
  const handleSnackbarClose = (event, reason) => {
    // If the user clicked away from the snackbar, do nothing  
    if (reason === 'clickaway') {
      return;
    }
  // Close the snackbar
  setSnackbarOpen(false);
  };

  // Function to handle login form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevents the default form submission behavior

    try {
      // Validate email format
      if (!email.includes('@')) {
        setSnackbarMessage('Email Must Include an @');
        setSnackbarOpen(true);
        return;
      }

      // Check if there's a password error
      if (passwordError) {
        setSnackbarMessage('Please enter a valid password');
        setSnackbarOpen(true);
        return;
      }

      // Send a POST request to the login endpoint
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST', // Sends a POST request to the specified URL
        headers: {
          'Content-Type': 'application/json', // Specifies that the request body is JSON
        },
        body: JSON.stringify({ username: email, password }), // Converts username and password to JSON string and sets it as the request body
      });

      if (!response.ok) { // Checks if the response status is not within the 200-299 range
        const errorData = await response.json(); // Parses the response body as JSON
        throw new Error(errorData.message || 'Authentication failed.'); // Throws an error with the message from the response or a default message
      }

      const responseData = await response.json(); // Parses the response body as JSON
      const { jwt } = responseData; // Destructures the 'jwt' property from the response data

      if (!jwt || jwt.trim() === '') { // Checks if the JWT token is missing or empty
        setSnackbarMessage('Invalid email or password'); // Display snackbar message
        setSnackbarOpen(true);
        throw new Error('Jwt token missing or empty'); // Throws an error if the JWT token is missing or empty
      }

      // Decode JWT token
      const decodedToken = jwtDecode(jwt);

      // Access the 'sub' claim
      const { sub } = decodedToken;

      // Store the JWT token in the browser's local storage
      localStorage.setItem('token', jwt);
      localStorage.setItem('email', sub);

      // Navigate to the '/dashboard' route
      navigate('/dashboard');
    } catch (error) {
      setSnackbarMessage('Invalid email or password');
    }
  };

  // Function to handle the click event for signing up
  const handleSignUpClick = () => {
    navigate('/signUp'); // Navigate to the sign-up page
  };

  // Function to handle the click event for forgot password
  const handleForgotPasswordClick = () => {
    setPasswordResetEmail(''); // Clear the password reset email state
    setOpenSendCodeToEmail(true);  // Open the dialog for sending a code to the email
  };

  // Function to send a verification code to the user's email
  const sendVerificationCode = async () => {

    // Validate email format
    if (!passwordResetEmail.includes('@')) {
      setSnackbarMessage('Please enter a valid email');
      setSnackbarOpen(true);
      return;
    }

    try {
    // Prepare data to be sent in the request
      const emailData = {
        email: passwordResetEmail
      };

    // Send a POST request to the backend server to save the email token
    const response = await fetch('http://localhost:8000/auth/saveEmailToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      }
      );

      // If the response status is not okay, throw an error
      if (!response.ok) {
        throw new Error('Backend server failed to send token to email');
      }

      // Close the dialog for sending a code to the email, reset user input code, and open email verification dialog
      setOpenSendCodeToEmail(false);
      setUserInputCode('');
      setOpenEmailVerification(true);

    } catch (error) {
      // Throw an error indicating failure to send token to email
      throw new Error('Backend server failed to send token to email');
    }
  }

  // Function to verify the email verification code
  const verifyCode = async () => {

    try {
    // Prepare data to be sent in the request
      const emailData = {
        email: passwordResetEmail,
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

      // If the email token is valid, close the email verification dialog and open the forgot password dialog   
      if (validEmailToken) {
        setOpenEmailVerification(false);
        setOpenForgotPassword(true);
      } else {

        // Display snackbar message if the code is invalid
        setSnackbarMessage('Invalid code, please try again');
        setSnackbarOpen(true);
      }
    } catch (error) {
       // If an error occurs while verifying the email or email token, log it for developers
       throw new Error('Error verifying email or email token:', error);
    }
  };

  const handleResetPassword = async (event) => {
    if (passwordResetEmail.includes('@') && newPassword.length >= 8 && newPassword === confirmPassword) {
      // Reset password logic here
      const response = await fetch('http://localhost:8080/auth/forgotPassword', {
        method: 'POST', // Sends a POST request to the specified URL
        headers: {
          'Content-Type': 'application/json', // Specifies that the request body is JSON
        },
        body: JSON.stringify({ passwordResetEmail, newPassword }), // Converts username and password to JSON string and sets it as the request body
      });

      if (!response.ok) { // Checks if the response status is not within the 200-299 range
        const errorData = await response.json(); // Parses the response body as JSON
        throw new Error(errorData.message || 'password reset failed'); // Throws an error with the message from the response or a default message
      }

      const responseData = await response.json(); // Parses the response body as JSON
      const { jwt } = responseData; // Destructures the 'jwt' property from the response data

      if (!jwt) { // Checks if the JWT token is missing
        throw new Error('jwt token not found'); // Throws an error if the JWT token is missing

      }
      setOpenForgotPassword(false);
      setSuccessDialogOpen(true);
    }
    else {
      setSnackbarMessage('Passwords do not match, try again'); 
      setSnackbarOpen(true);
    }
  };

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
        {/* Login Form on the Left */}
        <Grid item xs={12} md={6} style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ maxWidth: '500px', width: '100%' }}>
            <h1 style={{ marginTop: '1px', fontSize: '40px' }}>Welcome Back!</h1>

            <Typography variant="h6" sx={{ mb: '5px' }}>
              Please enter your details below to log in
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                margin="normal"
                required
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
                label="Password"
                variant="outlined"
                required
                type={showPassword ? 'text' : 'password'}
                margin="normal"
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
                        onClick={togglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                variant="contained"
                fullWidth
                type="submit"
                sx={{
                  mt: 2,
                  backgroundColor: '#239F3C',
                  borderRadius: '16px',
                  ':hover': {
                    backgroundColor: '#1e8a34',
                  },
                }}
              >
                Login
              </Button>

            </form>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: '310px' }}>
              <Typography sx={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={handleSignUpClick}>
                Sign Up
              </Typography>
              <Typography sx={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={handleForgotPasswordClick}>
                Forgot Password
              </Typography>
            </Box>
          </div>
        </Grid>

        <Grid item xs={12} md={6} style={{
          display: 'flex',
          background: `linear-gradient(to left, rgba(255,255,255,0) 50%, rgba(255,255,255,1) 100%), url('./map-image.png')`,
          backgroundPosition: 'center',
          backgroundSize: 'auto 100%',
          backgroundRepeat: 'no-repeat',
          height: '100vh',
        }}>
        </Grid>
      </Grid>

      <Dialog
        open={successDialogOpen}
        onClose={() => setSuccessDialogOpen(false)}
        aria-labelledby="success-dialog-title"
      >
        <DialogTitle id="success-dialog-title">
          Success
          <IconButton
            aria-label="close"
            onClick={() => setSuccessDialogOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your password has been successfully updated
          </DialogContentText>
        </DialogContent>
        <DialogActions>
        </DialogActions>
      </Dialog>

      <Dialog open={OpenSendCodeToEmail} onClose={() => setOpenSendCodeToEmail(false)}>
        <DialogTitle>Enter your email to receive a verification code</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="email"
            label="Email Address"
            type="email"
            required
            fullWidth
            variant="outlined"
            value={passwordResetEmail}
            onChange={(event) => setPasswordResetEmail(event.target.value)}
            error={!passwordResetEmail.includes('@') && passwordResetEmail.length > 0}
            helperText={!passwordResetEmail.includes('@') && passwordResetEmail.length > 0 ? 'Email must contain an @' : ''}
            sx={{
              borderRadius: '16px',
              '& .MuiOutlinedInput-root': {
                borderRadius: '16px',
              },
            }}
            aria-label="Email Address"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={sendVerificationCode}>Send verification code</Button>
        </DialogActions>
      </Dialog>

      {/* Verification Code Dialog */}
      <Dialog open={openEmailVerification} onClose={() => setOpenEmailVerification(false)}>
        <DialogTitle>Verification Needed</DialogTitle>
        <DialogContent>
          <DialogContentText>Please enter the verification code sent to your email.</DialogContentText>
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

      {error && (
        <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
          <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      )}

      {/* Forgot Password Dialog */}
      <Dialog
        open={openForgotPassword}
        onClose={() => setOpenForgotPassword(false)}
        aria-labelledby="position-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          Reset Your Password
          <IconButton
            aria-label="close"
            onClick={() => setOpenForgotPassword(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {/* New Password TextField */}
          <TextField
            margin="dense"
            id="newPassword"
            label="New Password"
            type="password"
            fullWidth
            required
            variant="outlined"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            error={newPasswordError}
            sx={{
              borderRadius: '16px',
              '& .MuiOutlinedInput-root': {
                borderRadius: '16px',
              },
            }}
          />
          {/* Confirm Password TextField */}
          <TextField
            margin="dense"
            id="confirmPassword"
            label="Confirm New Password"
            type="password"
            fullWidth
            required
            variant="outlined"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            error={confirmPasswordError}
            sx={{
              borderRadius: '16px',
              '& .MuiOutlinedInput-root': {
                borderRadius: '16px',
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleResetPassword}>Reset Password</Button>
        </DialogActions>
      </Dialog>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          width: '100%',
          backgroundColor: '#013035',
          color: 'white',
          textAlign: 'center',
          padding: '15px 0',
          position: 'absolute',
          bottom: 0,
        }}
      >
        <Typography>
          © 2024 Ecomute - All rights reserved - Team 39
        </Typography>
      </Box>
    </>
  );
};

export default LoginComponent;
