import
{
  BrowserRouter as Router,
  Route,
  Routes, 
  Navigate
}
from "react-router-dom"

import Layout from "./layouts/Layouts"
import Register from "./pages/Register"
import SignIn from "./pages/SignIn";
import AddHotel from "./pages/AddHotel";


function App() {
  return (
    <Router>
      <Routes>
          <Route path="/" element={
            <Layout>
              <p>Home Page</p>
            </Layout>
          }
        />
          <Route path="/search" element={
              <Layout>
                <p>Search page</p>
              </Layout>
            }
          />
        <Route path="/register" element={
            <Layout>
              <Register/>
            </Layout>
          }
        />
        <Route path="/sign-in" element={
            <Layout>
              <SignIn/>
            </Layout>
          }
        />

        {isLoggedIn && (
          <>
            <Route 
              path="/add-hotel" 
              element = {
                <Layout>
                  <AddHotel/>
                </Layout>
              }
            />
          </>
        )}
        <Route path="*" element={<Navigate to="/"/>}/>
      </Routes>
    </Router>
  )
}

export default App;
