import ErrorHandler from "../error/error.js";
import { Reservation } from '../models/reservationSchema.js';

export const sendReservation = async (req, res, next) => {
    const { firstName, lastName, email, date, time, phone } = req.body;
    
    if (!firstName || !lastName || !email || !date || !time || !phone) {
        return next(new ErrorHandler("Please fill the entire reservation form!", 400));
    }

    try {
        // Create a reservation object with the provided data
        const reservation = new Reservation({
            firstName,
            lastName,
            email,
            date,
            time,
            phone
        });

        // Save the reservation to the database
        await reservation.save();

        res.status(201).json({
            success: true,
            message: "Reservation Sent Successfully",
        });
    } catch (error) {
        console.log(error);
        if (error.name === "ValidationError") {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return next(new ErrorHandler(validationErrors.join(" , "), 400));
        }
        return next(error);
    }
}
