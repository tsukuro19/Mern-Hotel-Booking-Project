// import
// {
//   BrowserRouter as Router,
//   Route,
//   Routes, 
//   Navigate
// }
// from "react-router-dom"

// import Layout from "./layouts/Layouts"
// import Register from "./pages/Register"
// import SignIn from "./pages/SignIn";
// import AddHotel from "./pages/AddHotel";
// import { useAppContext } from "./context/AppContext";
// import MyHotels from "./pages/MyHotels";


// const App = () => {
//   const {isLoggedIn}=useAppContext();
//   return (
//     <Router>
//       <Routes>
//           <Route path="/" element={
//             <Layout>
//               <p>Home Page</p>
//             </Layout>
//           }
//         />
//           <Route path="/search" element={
//               <Layout>
//                 <p>Search page</p>
//               </Layout>
//             }
//           />
//         {!isLoggedIn && <>
//             <Route path="/register" element={
//               <Layout>
//                 <Register/>
//               </Layout>
//             }
//           />
//         </>}
//         {!isLoggedIn && <>
//             <Route path="/sign-in" element={
//               <Layout>
//                 <SignIn/>
//               </Layout>
//             }
//           />
//         </>}
//         {isLoggedIn && (
//           <>
//             <Route 
//               path="/add-hotel" 
//               element={
//                 <Layout>
//                   <AddHotel/>
//                 </Layout>
//               }
//             />
//             <Route 
//               path="/my-hotels" 
//               element={
//                 <Layout>
//                   <MyHotels/>
//                 </Layout>
//               }
//             />
//           </>
//         )}
//         <Route path="*" element={<Navigate to="/"/>}/>
//       </Routes>
//     </Router>
//   )
// }

// export default App;

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import Layout from "./layouts/Layouts";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import AddHotel from "./pages/AddHotel";


import { useAppContext } from "./context/AppContext";
import MyHotels from "./pages/MyHotels";
import EditHotel from "./pages/EditHotel";
import Search from "./pages/Search";
import Detail from "./pages/Details";
import Booking from "./pages/Booking";
import Home from "./pages/Home";
import MyBookings from "./pages/MyBookings";
import ForgetPassword from "./pages/ForgetPassword";
import ChangePassword from "./pages/ChangePassword";
import ListBookings from "./pages/ListBooking";
//import Detail from "./pages/Detail";
//import Booking from "./pages/Booking";
//import MyBookings from "./pages/MyBookings";
//import Home from "./pages/Home";

const App = () => {
  const { isLoggedIn } = useAppContext();
  return (
    <GoogleOAuthProvider clientId="808290140719-lc5hdfdevhc72b9771qfhq9i065d4vf8.apps.googleusercontent.com">
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/search"
          element={
            <Layout>
              <Search />
            </Layout>
          }
        />
        <Route
              path="/detail/:hotelId"
              element={
                <Layout>
                  <Detail/>
                </Layout>
              }
            />


        <Route
          path="/register"
          element={
            <Layout>
              <Register />
            </Layout>
          }
        />
        <Route
          path="/sign-in"
          element={
            <Layout>
              <SignIn />
            </Layout>
          }
        />

        <Route
          path="/forget-password"
          element={
            <Layout>
              <ForgetPassword/>
            </Layout>
          }
        />

        <Route
            path="/change-password/:userId"
            element={
              <Layout>
                <ChangePassword/>
              </Layout>
            }
          />

        {isLoggedIn && (
          <>
            <Route
              path="/hotel/:hotelId/booking"
              element={
                <Layout>
                  {/* <Booking /> */}
                  <Booking/>
                </Layout>
              }
            />

            <Route
              path="/add-hotel"
              element={
                <Layout>
                  <AddHotel />
                </Layout>
              }
            />
            <Route
              path="/edit-hotel/:hotelId"
              element={
                <Layout>
                  <EditHotel />
                </Layout>
              }
            />

          <Route
              path="/list-booking/:hotelId"
              element={
                <Layout>
                  <ListBookings/>
                </Layout>
              }
            />
            <Route
              path="/my-hotels"
              element={
                <Layout>
                  <MyHotels />
                </Layout>
              }
            />
            <Route
              path="/my-bookings"
              element={
                <Layout>
                  <MyBookings/>
                </Layout>
              }
            />
          </>
        )}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
