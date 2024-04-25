import {Link} from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import SignOutButton from "../components/SignOutButton";

const Header=()=>{
    const {isLoggedIn}=useAppContext();
    return (
        <div className="bg-blue-800 py-4">
            <div className="container mx-auto flex justify-between">
                <span className="text-3xl text-white font-bold tracking-tight ">
                    <Link to="/">BookingApp.com</Link>
                </span>
                <span className="flex space-x-5">
                    {isLoggedIn?
                    (<>
                        <Link to="/my-bookings">My Bookings</Link>
                        <Link to="/my-hotels">My Hotels</Link>
                        <SignOutButton/>
                    </>):(
                        <Link to="/sign-in" className=" rounded-md text-base flex items-center bg-white text-blue-600 px-6 py-2 font-bold hover:bg-gray-100">Sign-in</Link>
                    )}
                </span>
            </div>
        </div>
    );
};

export default Header;