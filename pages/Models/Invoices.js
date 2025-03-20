import mongoose from 'mongoose';
import {Schema} from "mongoose"

const invoiceSchema = new mongoose.Schema({
    customer_id: {
        type: Schema.Types.ObjectId, // Use Schema.Types.ObjectId
        ref: 'Customers', // Reference the Customer model
        required: true
      },
  invoiceDate: {
    type: Date,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: true
  }
});


const Invoice = mongoose.models.Invoices || mongoose.model('Invoices', invoiceSchema);

export default Invoice;