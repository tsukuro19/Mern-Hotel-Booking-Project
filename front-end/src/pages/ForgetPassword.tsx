import { useForm } from "react-hook-form";
import * as apiClient from "../api-client";
import { useMutation, useQuery} from "react-query";
import { useAppContext } from "../context/AppContext";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom"

export type ForgetPasswordForm={
    email:string;
};

interface UserRes {
    user: {
      _id: string;
    };
  }

const ForgetPassword=()=>{
    const {showToast}=useAppContext();
    const navigate=useNavigate();
    const location=useLocation();
    let userRes: UserRes | undefined;;

    const {register,
        formState:{errors},
        handleSubmit
    }=useForm<ForgetPasswordForm>();
    const mutation=useMutation(apiClient.forgetPassword,{
        onSuccess:async (data)=>{
            userRes=data;
            showToast({message:"User have exist",type:"SUCCESS"});
            navigate(location.state?.from?.pathname || (userRes ? `/change-password/${userRes.user._id}` : "/change-password"));
        },
        onError:(error:Error)=>{
            showToast({message:error.message, type:"ERROR"});
        }
    });
    
    console.log(userRes);

    const onSubmit=handleSubmit((data)=>{
        mutation.mutate(data);
    })

    return(
        <form className="flex flex-col gap-5" onSubmit={onSubmit}>
            <h2 className="text-3xl font-bold">Forget Password</h2>
            <label className="text-gray-700 text-sm font-bold flex-1">
                Email
                <input 
                type="email"
                className="border rounded w-full py-1 px-2 font-normal"
                {...register("email",{required:"This field is required"})}
                ></input>
                {errors.email && (
                        <span className="text-red-500">{errors.email.message}</span>
                )}
            </label>
            <span>
                <span className="flex items-center justify-between">
                    <button type="submit" className="rounded-md bg-blue-500 text-white p-2 font-bold hover:bg-blue-700">
                        Next
                    </button>
                </span>
            </span>
        </form>
    )
}


export default ForgetPassword;