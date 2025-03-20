import connectToDatabase from "../../app/lib/mongoose";
import Revenues from "../Models/Revenue";

export default async function handler(req,res){
     if (req.method === "GET") {
            try {
                await connectToDatabase();
    
                // Fetch all revenue data from the collection
                const allData = await Revenues.find({});
                console.log(allData);
                res.status(200).json(allData);
    
            } catch (error) {
                console.error("Error fetching revenue data:", error);
                res.status(500).json({ message: "Something went wrong!" });
            }
        } else {
            res.status(405).json({ message: "Method not allowed!" });
        }
}