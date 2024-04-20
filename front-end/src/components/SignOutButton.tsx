import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../context/AppContext";

const SignOutButton=()=>{
    const {showToast}=useAppContext();
    const queryClient = useQueryClient();

    const mutation=useMutation(apiClient.signOut,{
        onSuccess:async ()=>{
            await queryClient.invalidateQueries("validateToken");
            showToast({message:"Signed Out",type:"SUCCESS"});
        },
        onError:(error:Error)=>{
            showToast({message:error.message, type:"ERROR"});
        }
    });

    const handleClick=()=>{
        mutation.mutate();
    }

    return (
        <button onClick={handleClick} className="text-blue-600 px-3 font-bold bg-white hover:bg-gray-100">Sign Out</button>
    );
};

export default SignOutButton;