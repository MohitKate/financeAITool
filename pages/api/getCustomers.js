import connectToDatabase from "./../../app/lib/mongoose";
import Customers from "../Models/Customers";
import Invoice from "../Models/Invoices";   




export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            await connectToDatabase();

            // Fetch all revenue data from the collection
            const customersallData = await Customers.find({});
            console.log(customersallData);
            for (const customer of customersallData) {
                const customerId = customer._id;
        
                // Update invoices that have a matching customer_id
                const result = await Invoice.updateMany(
                  { customer_id: customerId }, // Find invoices with matching customer_id
                  { $set: { customer_id: customerId } },
                  { $unset: { _id: "" } } // Update the customer_id to the customer's _id (already the case, but ensures it's correct type)
                );
              }
        
              res.status(200).json({ message: 'Invoices updated successfully!' });
            res.status(200).json(customersallData);
            
        } catch (error) {
            console.error("Error fetching revenue data:", error);
            res.status(500).json({ message: "Something went wrong!" });
        }
    } else {
        res.status(405).json({ message: "Method not allowed!" });
    }
}