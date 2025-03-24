import mongoose from "mongoose";

const clientSchema= new mongoose.Schema({
    customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customers', required: true },
    financialGoals: String,
    interactionHistory: [
      {
        date: Date,
        notes: String
      }
    ],
    status: { type: String, enum: ['Active', 'Inactive', 'Pending'], default: 'Active' }, // Added status field
    risk_profile: { type: String, enum: ['Low', 'Moderate', 'High', 'Very High'], default: 'Moderate' } // Added risk_profile field
});

const Clients=mongoose.model('Clients', clientSchema);

export default Clients;