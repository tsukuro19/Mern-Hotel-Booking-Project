import Header from "../components/Header";
import Title from "../components/Title";

const Layout= ()=>{
    return  (
        <div className="flex flex-col min-h-screen">
            <Header/>
            <Title/>
        </div>
    );
};

export default Layout;