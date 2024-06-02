import { useMutation, useQuery } from "react-query";
import { Link } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";
import { RiDeleteBinLine } from "react-icons/ri";
import * as apiClient from "../api-client";
import { useAppContext } from "../context/AppContext";
import { useState } from "react";

interface Booking {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    checkIn: string;
    checkOut: string;
    totalCost: number;
    paymentSuccess: boolean;
}

const ListBookings = () => {
    const { showToast } = useAppContext();
    const navigate = useNavigate();
    const { hotelId } = useParams();


    const [isLoading, setIsLoading] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false); // State to track payment success
    const [refundSuccess, setRefundSuccess] = useState(false);
    const mutationPayment = useMutation(
        (paymentId: string) => apiClient.updatePaymentUser(paymentId, hotelId || ""),
        {
            onSuccess: () => {
                showToast({ message: "Booking Saved!", type: "SUCCESS" });
                setPaymentSuccess(true); // Update payment success state
                window.location.reload();
            },
            onError: () => {
                showToast({ message: "Error saving booking", type: "ERROR" });
            },
            onMutate: () => {
                setIsLoading(true);
            },
            onSettled: () => {
                setIsLoading(false);
            },
        }
    );

    const mutationRefund = useMutation(
        (paymentId: string) => apiClient.updatePaymentUserRefund(paymentId, hotelId || ""),
        {
            onSuccess: () => {
                showToast({ message: "Refund Saved!", type: "SUCCESS" });
                setRefundSuccess(true); // Update payment success state
                window.location.reload();
            },
            onError: () => {
                showToast({ message: "Error saving booking", type: "ERROR" });
            },
            onMutate: () => {
                setIsLoading(true);
            },
            onSettled: () => {
                setIsLoading(false);
            },
        }
    );

    const {data:hotels}=useQuery(
        "fetchHotelById",
        ()=>apiClient.fetchHotelById(hotelId || ""),
        {
            enabled:!!hotelId,
        }
    );
    
    

    if (!hotels) {
        return <span>No bookings found</span>;
    }

    const handlePayment = (paymentId: string) => {
        mutationPayment.mutate(paymentId);
    };

    const handleRefund = (paymentId: string) => {
        mutationRefund.mutate(paymentId);
    }

    let totalCostOfAllBookings = 0;
    let countBooking = 0;

    return (
        <div className="space-y-5">
            <h1 className="text-3xl font-bold">List of Hotel Bookings of {hotels.name}</h1>
            <div className="grid grid-col-1 gap-8">
                {hotels.bookings.map((booking) => {
                    if (booking.paymentSuccess === "success" || booking.paymentSuccess === "pending") {
                        countBooking++;
                        totalCostOfAllBookings += booking.totalCost;
                        return (
                            <div key={booking._id} className="flex flex-col justify-between border border-slate-300 rounded-lg p-8 gap-5">
                                <div>
                                    <div>
                                        <span className="font-bold mr-2">Name: </span>
                                        <span>
                                            {booking.firstName} {booking.lastName}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="font-bold mr-2">Dates: </span>
                                        <span>
                                            {new Date(booking.checkIn).toDateString()} -
                                            {new Date(booking.checkOut).toDateString()}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="font-bold mr-2">Guests:</span>
                                        <span>
                                            {booking.adultCount} adults, {booking.childCount} children
                                        </span>
                                    </div>
                                    <div>
                                        <span className="font-bold mr-2">Total cost: </span>
                                        <span>{booking.totalCost}</span>
                                    </div>
                                    <div>
                                        <span className="font-bold mr-2">Status payment: </span>
                                        <span>
                                            {booking.paymentSuccess === "pending" ? (
                                                <span>Pay directly</span>
                                            ) : (
                                                <span>Success</span>
                                            )}
                                        </span>
                                    </div>
                                    <span className="flex space-x-4 justify-end">
                                        {booking.paymentSuccess === "pending" ? (
                                            <button
                                                disabled={isLoading}
                                                onClick={() => handlePayment(booking._id)}
                                                className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-md"
                                            >
                                                {isLoading ? "Saving..." : "Confirm Booking"}
                                            </button>
                                        ) : (
                                            // Render refund button if payment success
                                            <button
                                                disabled={isLoading}
                                                onClick={() => handleRefund(booking._id)}
                                                className="bg-red-600 text-white p-2 font-bold hover:bg-blue-500 text-md"
                                            >
                                                {isLoading ? "Saving..." : "Refund"}
                                            </button>
                                        )}
                                    </span>
                                </div>
                            </div>
                        );
                    }
                     // Ensure return null if booking does not match the criteria
                })}
            </div>
            <div className="flex justify-center bg-blue-600 text-white text-xl font-bold p-2 hover:bg-blue-500">
                <span>Total Cost of All Bookings: {totalCostOfAllBookings}</span>
            </div>
        </div>
    );
};

export default ListBookings;
