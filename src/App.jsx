import { Route, Routes } from "react-router-dom";
import Loading from "./Components/Loading";
import PassportApplicationForm from "./Components/PassportApplicationForm";
import Dashboard from "./Layouts/Dashboard";
import Root from "./Layouts/Root";
import Contact from "./Pages/Contact";
import DashboardHome from "./Pages/Dashboard/DashboardHome";
import ManageDeliveries from "./Pages/Dashboard/ManageDeliveries";
import PickupPoints from "./Pages/Dashboard/PickupPoints";
import Profile from "./Pages/Dashboard/Profile";
import ErrorPage from "./Pages/ErrorPage";
import FAQ from "./Pages/Faq";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import PrivateRoute from "./Routes/PrivateRoute";

function App() {
  return (
    <Routes>
      {/* Main Layout Route: Wraps all pages with the root layout (e.g., header, footer) */}
      <Route path="/" element={<Root />}>
        {/* Public Routes: Accessible to all users */}
        <Route index element={<Home />} />
        <Route path="contact" element={<Contact />} />
        <Route path="apply" element={<PassportApplicationForm />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="*" element={<ErrorPage />} />
        {/* <Route path="apply" element={<PassportApplicationForm />} /> */}
        <Route path="login" element={<Login />} />
        <Route path="signUp" element={<SignUp />} />

        {/* Dashboard Route: Protected route with nested routes for authenticated users */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          {/* Default Dashboard Route: Placeholder for initial loading */}
          <Route index element={<Loading />} />

          {/* Role-Specific Routes: Home pages for PassportOffice and ShapOSS */}
          <Route path="PassportOfficeHome" element={<DashboardHome />} />
          <Route path="ShapOSSHome" element={<DashboardHome />} />

          {/* PassportOffice Routes: For managing applications and users */}
          {/* <Route path="ManageApplications" element={<Loading />} />
          <Route path="AllApplications" element={<Loading />} />
          <Route path="ManageUsers" element={<Loading />} /> */}

          {/* ShapOSS Routes: For managing deliveries and pickup points */}
          <Route path="ManageDeliveries" element={<ManageDeliveries />} />
          <Route path="PickupPoints" element={<PickupPoints />} />

          {/* Common Routes: Shared across both roles */}
          <Route path="Profile" element={<Profile />} />
          {/* <Route path="Settings" element={<Loading />} /> */}
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
