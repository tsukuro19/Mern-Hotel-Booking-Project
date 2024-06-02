import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom"
import * as apiClient from "../api-client";
import ManageHotelForm from "../forms/ManageHotelForm/ManageHotelForm";
import { useAppContext } from "../context/AppContext";

const EditHotel=()=>{
    const { hotelId } = useParams();
    const { showToast } = useAppContext();
    const navigate=useNavigate();
    
    const { data: hotel } = useQuery(
        "fetchMyHotelById",
        () => apiClient.fetchMyHotelById(hotelId || ""),
        {
          enabled: !!hotelId,
        }
      );
    
    console.log(hotel);
    const { mutate, isLoading } = useMutation(apiClient.updateMyHotelById, {
        onSuccess: () => {
          showToast({ message: "Hotel Saved!", type: "SUCCESS" });
          navigate("/my-hotels");
        },
        onError: () => {
          showToast({ message: "Error Saving Hotel", type: "ERROR" });
        },
      });
    
      const handleSave = (hotelFormData: FormData) => {
        mutate(hotelFormData);
      };
    
      return  (<ManageHotelForm hotel={hotel} onSave={handleSave} isLoading={isLoading} />)
}

export default EditHotel;