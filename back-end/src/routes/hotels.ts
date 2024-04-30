import express, { Request, Response } from "express";
import Hotel from "../models/hotel";
import { HotelSearchResponse } from "../shared/types";

const router = express.Router();

// /api/hotels/search
router.get("/search", async (req: Request, res: Response) => {
    try {
        const country = req.query.destination?.toString() || "";
        const checkIn=req.query.checkIn?.toString()||"";
        const checkOut=req.query.checkOut?.toString()||"";
        const adultCount=req.query.adultCount?.toString()||"";
        const childCount=req.query.childCount?.toString()||"";
        let hotels,total;
        const pageSize = 5;
        const pageNumber = parseInt(
            req.query.page ? req.query.page.toString() : "1"
        );
        const skip = (pageNumber - 1) * pageSize;

         // Check if the destination query parameter is provided and not empty
         if (req.query.destination && req.query.destination !== "") {
            hotels = await Hotel.find({ country,adultCount,childCount }).skip(skip).limit(pageSize);
            total = await Hotel.find({ country,adultCount,childCount }).countDocuments();
        } else {
            hotels = await Hotel.find().skip(skip).limit(pageSize);
            total = await Hotel.countDocuments();
        }


        const response : HotelSearchResponse = {
            data: hotels,
            pagination: {
                total,
                page: pageNumber,
                pages: Math.ceil(total / pageSize),
            },
        };
        res.json(response);
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ message: "Something went wrong" });
    }
});

export default router;