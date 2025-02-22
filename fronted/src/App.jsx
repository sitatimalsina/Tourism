import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from "react-hot-toast";
import LandingPage from './pages/LandingPage';
import UserLogin from './pages/traveler/UserLogin';
import ServiceProviderLogin from './pages/serviceprovider/ServiceProviderLogin';
import UserSignup from './pages/traveler/UserSignup';
import UserPreferences from './pages/traveler/UserPreference';
import ExploreNepal from './pages/ExploreNepal';
import AdminPanel from './pages/serviceprovider/AdminPanel';
import ManageDestinations from './pages/serviceprovider/ManageDestination';
import AddDestination from './pages/serviceprovider/AddDestination';
import {useAuthContext} from "./context/AuthContext";
import AllDestinations from './pages/AllDestination';
import DestinationDetails from './pages/DestinationDetails';
import AdminManagePackages from './pages/serviceprovider/AdminManagePackages';
import AdminAddEditPackage from './pages/serviceprovider/AdminAddEditPackage';
import AllPackages from './pages/traveler/AllPackages';
import PackageDetails from './pages/traveler/PackageDetails';
import BookingPaymentForm from './pages/traveler/BookingPaymentForm';
import UserBookings from './pages/traveler/UserBooking';
import AdminBookings from './pages/serviceprovider/AdminBooking';
import EditDestination from './pages/serviceprovider/EditDestination';
import Contact from './pages/Contact';
import AboutUs from './pages/AboutUs';
import ManageUsers from "./pages/serviceprovider/ManageUsers";
import BookingHistory from './pages/serviceprovider/BookingHistory';
import ManageMessages from './pages/serviceprovider/ManageMessages';
import TermsOfUse from './pages/TermsOfUse';
// import PrivacyPolicy from './pages/PrivacyPolicy';
import ManagePhoto from './pages/serviceprovider/ManagePhoto';
function App() {
   
  const {authUser} = useAuthContext()
  return (
    <div>
      <Routes>
        <Route path="/" element={<ExploreNepal />} />
        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/user-signup" element={<UserSignup />} />
        <Route path="/service-provider-login" element={<ServiceProviderLogin />} />
        <Route path="/preferences" element={<UserPreferences />} />
        <Route path="/mode" element= {<LandingPage/>} />
        <Route path="/admin-dashboard" element={<AdminPanel />} />
        <Route path="/admin/destinations" element={<ManageDestinations />} />
        <Route path="/admin/add-destination" element={<AddDestination />} />
        <Route path="/destinations" element={<AllDestinations />} />
        <Route path="/destination/:id" element={<DestinationDetails />} /> 
        <Route path="/admin/package" element={<AdminManagePackages/>} /> 
        <Route path="/admin/add-package" element={<AdminAddEditPackage/>} /> 
        <Route path="/admin/edit-package/:packageId" element={<AdminAddEditPackage/>} /> 
        <Route path="/packages" element={<AllPackages />} />
        <Route path="/package/:packageId" element={<PackageDetails />} />
        <Route path="/book/:packageId" element={<BookingPaymentForm />} />
        <Route path="/my-bookings" element={<UserBookings />} />
        <Route path='/admin/bookings' element= {<AdminBookings/> }/>
        <Route path='/admin/edit-destination/:destinationId' element= {<EditDestination/> }/>
        <Route path="/contact-us" element={<Contact/>} />
        <Route path="/about" element={<AboutUs/>} />
        <Route path="/admin/userslist" element={<ManageUsers />} />
        <Route path="/admin/bookinghistory" element={<BookingHistory/>} />
        <Route path="/admin/manage-messages" element={<ManageMessages/>} />
        {/* <Route path="/privacy-policy" element={<PrivacyPolicy/>} />  */}
        <Route path="/terms-of-use" element={<TermsOfUse/>} />
        <Route path="/admin/manage-photos" element={<ManagePhoto/>} />
        
      </Routes>
      <Toaster />
    </div>
  )
}

export default App