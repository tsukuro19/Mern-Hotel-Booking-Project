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
import Layout from "./layouts/Layouts";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import AddHotel from "./pages/AddHotel";


import { useAppContext } from "./context/AppContext";
import MyHotels from "./pages/MyHotels";
import EditHotel from "./pages/EditHotel";
import Search from "./pages/Search";
//import Detail from "./pages/Detail";
//import Booking from "./pages/Booking";
//import MyBookings from "./pages/MyBookings";
//import Home from "./pages/Home";

const App = () => {
  const { isLoggedIn } = useAppContext();
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              {/* <Home /> */}
              <p>Home</p>
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
              {/* <Detail /> */}
              <p>Detail</p>
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

        {isLoggedIn && (
          <>
            <Route
              path="/hotel/:hotelId/booking"
              element={
                <Layout>
                  {/* <Booking /> */}
                  <p>Booking</p>
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
                  {/* <MyBookings /> */}
                  <p>MyBookings</p>
                </Layout>
              }
            />
          </>
        )}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
