import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import * as apiClient from "../api-client";
import { useAppContext } from "../context/AppContext";

export type ChangePasswordForm={
    userId:string;
    password:string;
    confirmPassword:string;
};


const ChangePassword=()=>{
    const {userId}=useParams();
    const {showToast}=useAppContext();
    const navigate=useNavigate();
    const location=useLocation();

    const {
        register,
        watch, 
        handleSubmit,
        formState:{errors}
    }=useForm<ChangePasswordForm>();

    const mutation=useMutation((formData: ChangePasswordForm) => apiClient.changePassword(userId!, formData),{
        onSuccess:async ()=>{
            showToast({message:"Change password success",type:"SUCCESS"});
            navigate(location.state?.from?.pathname || "/sign-in");
        },
        onError:(error:Error)=>{
            showToast({message:error.message, type:"ERROR"});
        }
    });

    const onSubmit=handleSubmit((data)=>{
        mutation.mutate(data);
    })

    return(
        <form className="flex flex-col gap-5" onSubmit={onSubmit}>
            <h2 className="text-3xl font-bold">Change Password</h2>
            <label className="text-gray-700 text-sm font-bold flex-1">
                Password
                <input 
                type="password"
                className="border rounded w-full py-1 px-2 font-normal"
                {...register("password",
                {
                    required:"This field is required",
                    minLength:{
                        value:6,
                        message:"Password must be at least 6 character"
                    }
                })}
                ></input>
                {errors.password && (
                    <span className="text-red-500">{errors.password.message}</span>
                )}
            </label>
            <label className="text-gray-700 text-sm font-bold flex-1">
                Confirm Password
                <input 
                type="password"
                className="border rounded w-full py-1 px-2 font-normal"
                {...register("confirmPassword",
                {
                    validate:(val)=>{
                        if(!val){
                            return "This field is required";
                        }else if(watch("password")!==val){
                            return "Your password do not match";
                        }
                    }
                })}
                ></input>
                {errors.confirmPassword && (
                    <span className="text-red-500">{errors.confirmPassword.message}</span>
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

export default ChangePassword;