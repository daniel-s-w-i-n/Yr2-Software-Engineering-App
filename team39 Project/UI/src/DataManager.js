// Importing React library to use React features and importing hook for navigation
import React from 'react';
import { useNavigate } from 'react-router-dom';

// Define a functional component called AccountPage
const DataManager = () => {
  const navigate = useNavigate();

  // Function to handle signing out
  const handleSignOut = () => {
    localStorage.removeItem('token'); // removes the jwt token from local storage when user signs out 


    navigate('/'); // navigates to the root (start of application)
  };

  // Styles for different sections of the page
  const   dataManagerPageStyle  = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: '#ffffff',
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: '20px',
    borderBottom: '1px solid #ccc',
    backgroundColor: '#FF7B55',
    color: 'black',
    cursor: 'pointer',
  };

  const logoStyle = {
    height: '65px',
    width: '220px',
    marginLeft: '50px',
  };

  const contentStyle = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: '20px',
    width: '100%',
    height: '541px',
  };

  const menuStyle = {
    display: 'flex',
    flexDirection: 'column',
    padding: '10px',
    width: '200px',
    height: '400px',
    marginLeft: '20px',
  };
  
  const buttonStyle = {
    padding: '20px 20px',
    marginBottom: '20px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '27px',
    backgroundColor: '#d9d9d9',
    border: '1px solid #ddd',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    transition: 'background-color 0.2s ease',
    borderRadius: '10px',
    width: 'auto',
    minWidth: '300px',
  };
  
  const accountSettingsStyle = {
    textAlign: 'center',
    fontSize: '24px',
  };

  const footerStyle = {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    width: '100%',
    padding: '20px',
    backgroundColor: '#FF7B55',
    color: 'white',
    fontSize: '12px',
  };

  const companyLogoStyle = {
    height: '50px',
    marginLeft: '20px',
  };

  const handleButtonHover = (event) => {
    event.target.style.backgroundColor = '#f2f2f2';
    event.target.style.width = '350px';
    event.target.style.transition = 'width 0.3s ease, background-color 0.3s ease';
  };
  
  const handleButtonLeave = (event) => {
      event.target.style.backgroundColor = '#d9d9d9';
      event.target.style.width = '300px';
  };

  // Render the component with defined styles and functionality
  return (
    <div style={dataManagerPageStyle}>
      {/* Header section with logo and navigation */}
      <div style={headerStyle} className="dashboard-header">
      <img
        src="/eviden-logo2.png"
        alt="Eviden Logo"
        style={logoStyle}
        className="dashboard-logo"
      />
      <div>
        {/* Navigation links */}
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          <li 
            style={{ 
              display: 'inline', 
              marginRight: '20px', 
              fontWeight: 'bold', 
              fontSize: '20px',
              transition: 'color 0.3s ease',
            }} 
            onMouseOver={(e) => (e.target.style.color = 'white')}
            onMouseOut={(e) => (e.target.style.color = 'black')}
            onClick={() => navigate('/dashboard')} 
            > Dashboard |
          </li>
            
          <li 
            style={{ 
              display: 'inline', 
              marginRight: '20px', 
              fontWeight: 'bold', 
              fontSize: '20px',
              transition: 'color 0.3s ease',
            }} 
            onMouseOver={(e) => (e.target.style.color = 'white')}
            onMouseOut={(e) => (e.target.style.color = 'black')}

            > Data Manager |
          </li>
          
          <li 
            style={{ 
              display: 'inline', 
              marginRight: '20px', 
              fontWeight: 'bold', 
              fontSize: '20px',
              transition: 'color 0.3s ease',
            }} 
            onClick={() => navigate('/aipage')}
            onMouseOver={(e) => (e.target.style.color = 'white')}
            onMouseOut={(e) => (e.target.style.color = 'black')}
          
            >A.I |
          </li>

          <li
          style={{
            display: 'inline',
            marginRight: '20px',
            fontWeight: 'bold',
            fontSize: '20px',
            cursor: 'pointer',
            color: 'black',
            transition: 'color 0.3s ease',
          }}
          onClick={() => navigate('/account')} 
          onMouseOver={(e) => (e.target.style.color = 'white')}
          onMouseOut={(e) => (e.target.style.color = 'black')}
          >
          Account |
          </li>

          <li 
            style={{ 
              display: 'inline', 
              marginRight: '20px', 
              fontWeight: 'bold', 
              fontSize: '20px',
              transition: 'color 0.3s ease',
            }} 
            onMouseOver={(e) => (e.target.style.color = 'white')}
            onMouseOut={(e) => (e.target.style.color = 'black')}
          >FAQs |</li>
  
          <li
            style={{
              display: 'inline',
              marginRight: '20px',
              fontWeight: 'bold',
              fontSize: '20px',
              cursor: 'pointer',
              color: 'black', 
              transition: 'color 0.3s ease', 
            }}
            onClick={handleSignOut}
            onMouseOver={(e) => (e.target.style.color = 'white')}
            onMouseOut={(e) => (e.target.style.color = 'black')}
          > Sign Out |
          </li>
        </ul>
      </div>
    </div>

    {/* Data Manager section */}
    <div style={accountSettingsStyle}>
        <h1>Data Manager</h1>
    </div>

    {/* Main content section */}
    <div style={contentStyle}>
      <div style={menuStyle}>
        <button style={buttonStyle} onMouseOver={handleButtonHover} onMouseOut={handleButtonLeave} onClick={() => navigate('/account')}>Account</button>
        <button style={buttonStyle} onMouseOver={handleButtonHover} onMouseOut={handleButtonLeave}>Notifications</button>
        <button style={buttonStyle} onMouseOver={handleButtonHover} onMouseOut={handleButtonLeave}>Appearance</button>
        <button style={buttonStyle} onMouseOver={handleButtonHover} onMouseOut={handleButtonLeave} onClick={() => navigate('/account')} >Settings</button>
        <button style={buttonStyle} onMouseOver={handleButtonHover} onMouseOut={handleButtonLeave} onClick={() => navigate('/FAQs')} >Help & Support</button>
      </div>
    </div>
  
    {/* Footer section */}
    <div style={footerStyle}>
        <img src="./team-logo.png" alt="Team Logo" style={companyLogoStyle} />
        <p style={{ marginRight: '20px', fontWeight: 'bold', color: 'black' }}>Created by Team 39</p>
    </div>
  </div>
  );
};

export default DataManager;