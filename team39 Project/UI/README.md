Web Application Documentation
=============================

Semester 1 Overview
--------

This documentation outlines the step-by-step process, technologies utilized, and challenges encountered during the development of our web application. Our application is designed to offer a user-friendly dashboard interface for efficiently managing data and accessing various functionalities.

### 1\. Project Setup

-   **Tech Stack**:
    -   Frontend: React was utilized for building the web application's frontend. React Router facilitated client-side routing and navigation.
-   **Initial Setup**:
    -   The project was initiated using Create React App, offering a fundamental structure for development.
-   **File Structure**:
    -   The project embraced a modular pattern, organizing components, styles, and utilities into structured directories for improved maintainability.

### 2\. Components

-   **DashboardComponent**:
    -   This central component presents the main dashboard view. It features widgets displaying diverse data graphs and information related to energy consumption, carbon neutrality, CO2 emissions, and project details.
-   **LoginComponent**:
    -   Responsible for user authentication, the LoginComponent contains a form for entering credentials. Upon successful login, users are directed to the dashboard.
-   **ProtectedRouteComponent**:
    -   Implemented to secure routes based on authentication status. Unauthorized users are redirected to the login screen.
-   **AccountPage Component**:
    -   The core component responsible for rendering the account settings interface. It features segmented sections for managing user information, including profile details and various account settings options.

### 3\. Routing and Navigation

-   **React Router**:
    -   Facilitated navigation within the app by defining routes to display different components based on the URL path.
-   **Protected Routes**:
    -   Ensured that specific routes were accessible only when the user was logged in.

### 4\. Styling and UI

-   **Styling Approach**:
    -   Initially, inline styles were employed for basic styling. Future considerations may include adopting a CSS-in-JS solution like Styled Components or CSS modules for better maintainability and scoped styling.
-   **Responsive Design**:
    -   Ensured responsiveness across various screen sizes and orientations for a consistent user experience.

### 5\. Challenges Faced

-   **Authentication Flow**:
    -   Implementing a robust authentication flow and securely handling user sessions posed challenges, especially managing authentication state across components.
-   **Styling Consistency**:
    -   Maintaining consistent styling across different components and ensuring UI uniformity was challenging, particularly as the app complexity increased.
-   **Performance Optimization**:
    -   Initial concerns regarding performance optimization arose due to resource-intensive data visualization components.


Semester 2 Overview
--------
 
**Here is a step by step guide on the redevelopment of the Ecomute Webapp:**

**Step 1 - Redesign and Research:**

The first stage of our redevelopment was making sure that we could implement the design we were given by researching potential methods of doing so. We started by researching better react libraries to use, as we thought that our implementation of the webapp in pure react could be improved upon. This resulted in us finding a library called Material-UI, or MUI for short. It provided us with a robust and flexible toolkit to build a visually appealing and highly functional user interface. Here are some of the main reasons why we picked this library:
- Comprehensive - Contains a wide range of ready-to-use components that cover many UI needs, from simple buttons to complex data tables. This allows us to be more creative and implement elements we wouldn’t be able to do otherwise-
- Modern Design - It adheres to Google's Material Design principles, ensuring a modern, clean, and consistent design across all the different components. This also significantly speeds up the development process, as developers can trust that the components will work well together visually right out of the box.
- Performance and Optimization - MUI components are designed with performance in mind. The library supports tree-shaking, which means that only the parts of the library that are used are included in the final product. This results in faster load times and provides smoother interactions and transitions, enhancing the feeling of responsiveness for the users.

Using this new library, the Splash Page, the Login Page and the Sign Up page were all updated using the MUI library, using inbuilt components like the buttons, text boxes and popups. Then the basic functionality was added, only allowing a user with correct details to log into the app, and if they were to enter their details wrong, then appropriate error messages would pop up to inform the user what has gone wrong. To add further functionality to these pages, we made sure that there was a form of user input cleaning, making sure that the user could only enter in the expected text and nothing unexpected. These new designs have made the app look more ‘official’ and modern, allowing for a better overall user experience.

Now these next steps are the steps taken to redevelop the main dashboard:

**Step 2 - Basic Map Integration and Functionality:**

- We first started by implementing the basic elements of the page, being the header, the footer and how the main section was going to be laid out. We also changed the header so that it contained less buttons navigating to pages, because due to the new requirements, some pages, like the AI Page and Data Manager Page became redundant. Moving on to the main section between the header and the footer, we decided to split it into three sections, a section for the interactive map, a section for the user to input their information and another to produce the graphs and statistics from the users data. For the interactive map, we decided to use Leaflet for these reasons:
	- Simplicity - The Leaflet API makes it very easy to  implement basic map functionalities like displaying a map, adding markers, and drawing routes. This simplicity allowed for quick development and iteration, which we need to be doing as we are under time constraints.
- Performance - It makes sure maps load quickly and run smoothly on all devices. This performance is critical for our webapp, as users expect real-time interactions without any lag.
- Extensibility - The library supports numerous plugins, allowing for developers to add complex functionalities to their maps without significant overhead. For our webapp, this meant the ability to incorporate routing, geocoding, and other advanced features as the application evolved.

We used the MapContainer and Marker components from react-leaflet, which allowed us to implement location selection in two ways, when the user places a marker on the map OR by typing in their postcode and displaying a predefined destination - in this case being the Eviden headquarters in central London. A challenge we experienced was getting the marker icons to appear correctly, so there is only one placed marker by the user on the screen and not multiple, which we solved by constantly updating the map with the new information. 

Once we got the map and the user input working, we created some calculators which gave us a distance between the point provided by the user and the end point and an estimated time based on the mode of transport being used, which consisted of: walking, cycling, public transport, petrol, electric and diesel cars. We have these displays currently on the website in the centre section below the area the user will input their postcode, so we can test if what we are doing is working. We then added some boxes on the third section of the webapp, just as a preliminary visual on where the graphs will be going.

**Step 3 - Advanced Map Interactions, Input Validation and Geographic Restrictions:**

Once the basic components of the page and of the map were implemented, we could now focus on the more advanced functions of the map, which were restricting the user to picking only a specific area in the map and to implement some sort of visual route drawing going from a start position to the predefined end point. 

To implement this route drawing we used the OSRM backend for routing, bettering the LocationPicker for map clicks, and handling postcode search for start position setting. The OSRM is a routing engine designed to provide fast and accurate route planning services for road networks. Utilising data from OpenStreetMap (OSM), OSRM calculates the shortest path between two or more points and delivers detailed instructions and information essential for navigation. A challenge we faced when doing this was making sure that only one route showed up on the map at any given point, as the calculateRoute functions would produce the routes but not remove them.

After doing this, we thought that we should restrict the user from picking any random postcode or point on the map as this could cause issues in the database, so we restricted user input to valid London postcodes and prevented marker placement outside the M25 boundaries, as it would be unrealistic for people to work in Central London to live outside the M25. How we did this was by using regex patterns for postcode validation and added checks against a simplified M25 bounding box. By completing this, we have created a comprehensive yet simple validation mechanism for London postcodes and accurately representing the M25 boundary.

**Step 4 - Carbon Emissions Visualization**

Now to another key part of our project, the Carbon Emission calculator and visualisation. The UI team worked together with the AI team, making sure the calculators are made to produce accurate results. Once the calculators were made, they were sent to the UI where we implemented them into our code - the calculators were made in javascript so they were very easy to integrate into the front-end React code. We had to edit them slightly so that they updated based on the distance between the start and end pointers, but that was it. 

What the calculator does is take distance in metres and transportation mode to calculate CO2 emissions. For walking, cycling, and buses, it multiplies the distance by emissions per kilometre. For petrol and diesel cars, it calculates fuel consumed based on distance and fuel efficiency, then multiplies by CO2 per litre. For electric cars, it calculates energy consumed based on distance and energy efficiency, then multiplies by emissions per kWh. The result is returned as a string with two decimal places.

Now to display the different graphs we used a library called ReCharts, as we wanted to implement radial (doughnut), bar, and line charts to show the emissions data. ReCharts is a composable charting library built on React components, offering a straightforward way to integrate charts into React applications, using the power of D3.js under the hood but abstracting away its complexity. We chose to use Recharts because it is:
- Easy of Use - It simplifies the process of adding charts to a React application, allowing developers to work with familiar JSX syntax and React's component lifecycle
- Reactive and Dynamic - Because it is built for React, Recharts charts are reactive and update dynamically with state or prop changes. This responsiveness is key for the Ecomute application, where emissions data can change based on user inputs like commuting mode or distance
- Composability - Recharts adopts a component-based approach to building charts, allowing developers to compose charts with components such as <Line>, <Bar>, <Area>, etc. This composability made it easier to experiment with different types of visualisations and to combine them in innovative ways to present emissions data effectively

**Step 5 -  Navigation and Interactivity:**

We’ve kept the base smooth navigation between different parts of the webapp that we had before, as we think this is key to the users experience. We did this before using React Router for page transitions, interactive login and loading pages, and dynamic updates based on user selections.

**Step 6 - User Validation and database integration:**

We have also worked together with the backend Team and have connected the website to the database so we now have a way to safely secure users passwords by hashing them and storing them in a separate location and not in the front end code - documentation on the actual creation of this can be found on the backend team branch

**Step 7 - User Customizability:**

We have created an account settings page which will allow you to alter details about yourself, journey and other aspects to ensure your information is up to date. You are able to change your full name, email, phone number, username and bio. We will be implementing separate pages for notifications, appearance, privacy and security, and help and support. This should give the user a lot of flexibility in terms of how they want to use the app, e.g. If they want to be notified for each potential carpool opportunity or be notified once per month (within notifications). Appearance would have some accessibility options such as dark and light mode - with the possibility of various font sizes. Help and support would have some FAQs along with some contact details for customer support.

**Step 8 - User feedback and Improvement:**

As a team, after the first iteration of the UI was implemented, we got together and analysed the new UI design. The main feedback we got was that it was too cluttered and so we updated the section of a user interface designed for selecting a mode of transport and entering a starting postcode, making the map bigger as well. The updates focus on improving the form's aesthetics, usability, and overall alignment with modern web design principles. The improvements included adjusting to the layout, spacing, visual elements, and interactive feedback to create a more engaging and user-friendly experience. Here they are in more detail:
- Layout and Structure:
    - The form is enclosed in a Box component that serves as the main container, ensuring all child components are aligned and organised. This container is set to take up 50% of its parent container's width and is flexibly designed to adapt to various screen sizes while maintaining its structural integrity.

- Styling Improvements:
    - Background and Borders - The form's background is set to match the application's theme for a seamless integration. Rounded corners and a shadow effect are applied for a soft, more modern look.
    - Typography - The headings, so all of the components included in Typography tags, are styled to stand out, with increased bottom margin for better separation from other elements. Text is centrally aligned for consistency as well.
    - Input Fields and Buttons - The postcode input field (TextField) utilises the 'filled' variant for a modern, minimalistic appearance. Custom styling is applied to allow the background colour to change on hover and focus, enhancing user interaction. The search button (IconButton) is styled to visually respond to user actions, with theme-consistent hover effects.

- Mode of Transport Selection:
    - Each mode of transport is represented by an icon, with the current selection highlighted, providing immediate visual feedback to the user. They are also arranged in the centre and evenly spaced.

- More Responsive Design:
    - The form's design considers responsiveness, with flex properties and width percentages ensuring it adapts well to different screen sizes. Spacing and layout adjustments make sure that the form remains aesthetically pleasing and functional across devices..