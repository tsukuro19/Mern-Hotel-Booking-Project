import { useForm } from "react-hook-form"
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../context/AppContext";
import { Link, useLocation, useNavigate, } from "react-router-dom";
import { useEffect } from "react";
import {GoogleLogin} from "@react-oauth/google";
export type SignInFormData={
    email:string;
    password:string;
};

export type GoogleSignInToken = string;

export type SignInWithGoogleResponse = {
    user: {
        id: string;
        email: string;
        name: string;
        // Add other user properties here
    };
    token: string;
};


function getCookie(name: string) {
    const dc: string = document.cookie;
    const prefix: string = name + "=";
    let begin: number = dc.indexOf("; " + prefix);
    if (begin === -1) {
        begin = dc.indexOf(prefix);
        if (begin !== 0) return null;
    } else {
        begin += 2;
        let end: number = document.cookie.indexOf(";", begin);
        if (end === -1) {
            end = dc.length;
        }
        return decodeURI(dc.substring(begin + prefix.length, end));
    }
}


const SignIn=()=>{
    const {showToast}=useAppContext();
    const navigate=useNavigate();
    const queryClient = useQueryClient();
    const location=useLocation();

    const googleMutation = useMutation(apiClient.signInWithGoogle, {
        onSuccess: async () => {
            showToast({ message: "Google login successful", type: "SUCCESS" });
            await queryClient.invalidateQueries("validateToken");
            navigate(location.state?.from?.pathname || "/");
        },
        onError: (error: Error) => {
            showToast({ message: error.message, type: "ERROR" });
        }
    });

    const {register,
        formState:{errors},
        handleSubmit
    }=useForm<SignInFormData>();
    const mutation=useMutation(apiClient.signIn,{
        onSuccess:async ()=>{
            showToast({message:"Login successful",type:"SUCCESS"});
            await queryClient.invalidateQueries("validateToken");
            navigate(location.state?.from?.pathname || "/");
        },
        onError:(error:Error)=>{
            showToast({message:error.message, type:"ERROR"});
        }
    });

    const onSubmit=handleSubmit((data)=>{
        mutation.mutate(data);
    })

     // Check for the existence of the cookie on component mount
     useEffect(() => {
        const checkLoginStatus = async () => {
            const myCookie = getCookie("auth-token");
            if (myCookie !== null) {
                await queryClient.invalidateQueries("validateToken");
                navigate("/");
            }
        };
        checkLoginStatus();
    }, [navigate, queryClient]);

    return (
        <form className="flex flex-col gap-5" onSubmit={onSubmit}>
            <h2 className="text-3xl font-bold">Sign In</h2>
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
            <span>
                <span className="flex flex-row">
                    <span className="text-sm basis-1/4">
                        Not Registered? <Link to="/register" className="underline">Create an account here</Link>
                    </span>
                    <span className="text-sm">
                        <Link to="/forget-password">Forget Password</Link>
                    </span>
                </span>
                <span className="flex items-center justify-between">
                    <button type="submit" className="rounded-md bg-blue-500 text-white p-2 font-bold hover:bg-blue-700">
                        Login
                    </button>
                </span>
            </span>
            <GoogleLogin
                onSuccess={credentialResponse => {
                    const token = credentialResponse.credential;
                    if (token) {
                        googleMutation.mutate(token);
                    } else {
                        showToast({ message: "Google login failed", type: "ERROR" });
                    }
                }}
                onError={() => {
                    showToast({ message: "Google login failed", type: "ERROR" });
                }}
            />
        </form>
    )
};

export default SignIn;