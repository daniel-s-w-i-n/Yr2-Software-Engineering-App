// Import necessary modules from react-router-dom and the components used in the app
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoadingScreenComponent from './LoadingScreenComponent';
import LoginComponent from './LoginComponent';
import DashboardComponent from './DashboardComponent';
import AccountPage from './AccountPage'; 
import DataManager from './DataManager';
import CalenderPage from './CalenderPage';
import SignUpPage from './SignUpPage';
import VehicleSettings from './VehicleSettings';
import ProtectedRoutes from './ProtectedRoutes';


// Define the main App component handling the routing of the application
const App = () => {
  return (
    // Set up BrowserRouter to manage the application's navigation
    <BrowserRouter>
      {/* Define routes for different paths */}
      <Routes>

      <Route path="/" element={<LoadingScreenComponent />} />


        <Route  element ={<ProtectedRoutes />}>
           <Route path="/signUp" element={<SignUpPage />} />
           <Route path="/login" element={<LoginComponent />} />
           <Route path="/dashboard" element={<DashboardComponent />} />
           <Route path="/account" element={<AccountPage />} />
           <Route path="/dataManager" element={<DataManager />} />
           <Route path="/calendar" element={<CalenderPage />} />
           <Route path="/vehicleSettings" element={<VehicleSettings />} />
           

        </Route>
      </Routes>
    </BrowserRouter>
  );
};

// Export the App component as the default export
export default App;
