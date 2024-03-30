import {Link} from "react-router-dom";

const Header=()=>{
    return (
        <div className="bg-blue-800 py-6">
            <div className="container mx-auto flex justify-between">
                <span className="text-3xl text-white font-bold tracking-tight ">
                    <Link to="/">BookingApp.com</Link>
                </span>
                <span className="flex space-x-5">
                    <Link to="/sign-in" className=" rounded-full text-lg flex items-center bg-white text-blue-600 px-10 py-2 font-bold hover:bg-gray-100">Sign-in</Link>
                </span>
            </div>
        </div>
    );
};

export default Header;