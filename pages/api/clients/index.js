import connectToDatabase from "../../../app/lib/mongoose";
import Clients from "./../../Models/Clients";
import Customers from "./../../Models/Customers";
import mongoose from "mongoose";

export default async function handler(req, res) {
  await connectToDatabase();
  const { method } = req;
  switch (method) {
    case "GET":
      //const clients = await db.collection('clients').find({}).toArray();
      const allData = await Clients.aggregate([
        {
          $addFields: {
            customerObjectId: { $toObjectId: "$customer_id" }, // Convert customer_id to ObjectId
          },
        },
        {
          $lookup: {
            from: "customers",
            localField: "customerObjectId", // Use converted ObjectId field
            foreignField: "_id",
            as: "customerDetails",
          },
        },
        {
          $unwind: "$customerDetails", // Flatten customerDetails array
        },
        {
          $project: {
            _id: 1,
            customer_id: 1,
            financialGoals: 1,
            interactionHistory: 1,
            status: 1,
            risk_profile: 1,
            "customerDetails.name": 1,
            "customerDetails.email": 1,
            "customerDetails.image_url": 1,
          },
        },
      ]);
      res.status(200).json(allData);
      break;
    case "POST":
      const data = req.body;
      const {
        name,
        email,
        image_url,
        financialGoals,
        interactionHistory,
        status,
        risk_profile,
      } = req.body;
      // Validate if data exists
      if (!data) {
        return res.status(400).json({ error: "Request body is missing" });
      }

      // Create new client with proper error handling
      try {
        const newCustomer = new Customers({ name, email, image_url });
        const savedCustomer = await newCustomer.save();
        // Step 2: Use the newly created customer's ID for Clients collection
        const newClient = new Clients({
          customer_id: savedCustomer._id.toString(), // Reference to Customers collection
          financialGoals,
          interactionHistory,
          status,
          risk_profile,
        });

        // Save client data
        const savedClient = await newClient.save();
        return res.status(201).json({
          success: true,
          message: "Client data saved successfully",
        });
      } catch (createError) {
        console.error("Error creating client:", createError);
        return res.status(400).json({
          error: "Failed to create client",
          details: createError.message,
        });
      }
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
