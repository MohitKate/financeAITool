
import  connectToDatabase  from "../../../app/lib/mongoose";
import Clients from '../../Models/Clients';
import mongoose from "mongoose";
import Customers from "../../Models/Customers";

export default async function handler(req, res) {
  await connectToDatabase();
  const client_id = req.query;
  console.log(client_id);
  if (!mongoose.Types.ObjectId.isValid(client_id?.client_id)) {
    console.error('Invalid ObjectId format:', client_id);
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid customer ID format' 
    });
  }
  if (req.method === 'GET') {
    const clientData = await Clients.findOne({ _id: client_id?.client_id}).populate('customer_id', 'name email image_url');
    if (!clientData) return res.status(404).json({ message: 'Client not found' });
    res.status(200).json(clientData);
  } else if (req.method === 'PUT') {
    const data = req.body;
    const result = await Clients.updateOne(
      {_id: client_id?.client_id },
      { $set: data }
    );
    if (result.matchedCount === 0) return res.status(404).json({ message: 'Client not found' });
    res.status(200).json({ message: 'Client updated' });
  } else if (req.method === 'DELETE') {
    const result = await Clients.deleteOne({ customer_id: client_id?.client_id });
    const result2 = await Customers.deleteOne({ _id: new mongoose.Types.ObjectId(client_id?.client_id) });
    if (result.deletedCount === 0) return res.status(404).json({ message: 'Client not found' });
    res.status(200).json({ message: 'Client deleted' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}