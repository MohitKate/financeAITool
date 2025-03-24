import postgres from "postgres";
import connectToDatabase from "./mongoose";
import Revenues from "./../../pages/Models/Revenue";
import Customers from "./../../pages/Models/Customers";
import Invoices from "./../../pages/Models/Invoices"
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
} from "./definitions";
import { formatCurrency } from "./utils";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function fetchRevenue() {
  try {
    await connectToDatabase();
    // Fetch all revenue data from the collection
    const allData = await Revenues.find({});
    return allData;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch revenue data.");
  }
}

export async function fetchLatestInvoices() {
  try {
        
    const latestInvoices = await Invoices.find({})
      .sort({ invoiceDate: -1 }) // Changed from date to invoiceDate to match your schema
      .limit(5)
      .populate({
        path: 'customer_id',
        model: 'Customers',  // Changed to string reference
        select: 'name email image_url'
      })
      .lean();

    if (!latestInvoices || latestInvoices.length === 0) {
      return [];
    }

    // Transform and validate the data
    return latestInvoices.map((invoice: any) => {
      if (!invoice.customer_id) {
        console.error('Missing customer data for invoice:', invoice._id);
        return null;
      }

      return {
        id: invoice._id.toString(),
        amount: formatCurrency(invoice.amount),
        name: invoice.customer_id.name || 'Unknown',
        image_url: invoice.customer_id.image_url || '',
        email: invoice.customer_id.email || '',
      };
    }).filter(Boolean); // Remove any null entries

  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch the latest invoices.");
  }
}

// export async function fetchCardData() {
//   try {
//     // You can probably combine these into a single SQL query
//     // However, we are intentionally splitting them to demonstrate
//     // how to initialize multiple queries in parallel with JS.
//     const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
//     const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
//     const invoiceStatusPromise = sql`SELECT
//          SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
//          SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
//          FROM invoices`;

//     const data = await Promise.all([
//       invoiceCountPromise,
//       customerCountPromise,
//       invoiceStatusPromise,
//     ]);

//     const numberOfInvoices = Number(data[0][0].count ?? "0");
//     const numberOfCustomers = Number(data[1][0].count ?? "0");
//     const totalPaidInvoices = formatCurrency(data[2][0].paid ?? "0");
//     const totalPendingInvoices = formatCurrency(data[2][0].pending ?? "0");

//     return {
//       numberOfCustomers,
//       numberOfInvoices,
//       totalPaidInvoices,
//       totalPendingInvoices,
//     };
//   } catch (error) {
//     console.error("Database Error:", error);
//     throw new Error("Failed to fetch card data.");
//   }
// }

export async function fetchCardData() {
  try {
    await connectToDatabase();

            // Use Promise.all to run the queries concurrently
            const [invoiceCount, customerCount, invoiceStatus] = await Promise.all([
              Invoices.countDocuments({}),
                Customers.countDocuments({}),
                Invoices.aggregate([
                    {
                        $group: {
                            _id: null,
                            paid: {
                                $sum: {
                                    $cond: { if: { $eq: ['$status', 'paid'] }, then: '$amount', else: 0 }
                                }
                            },
                            pending: {
                                $sum: {
                                    $cond: { if: { $eq: ['$status', 'pending'] }, then: '$amount', else: 0 }
                                }
                            }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            paid: 1,
                            pending: 1
                        }
                    }
                ])
            ]);

            // Prepare the response
            const data = {
                invoiceCount,
                customerCount,
                invoiceStatus: invoiceStatus.length > 0 ? invoiceStatus[0] : { paid: 0, pending: 0 }
            };
            return data;

            //res.status(200).json(data);

  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch card data.");
  }
}


const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<InvoicesTable[]>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoices.");
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    const data = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of invoices.");
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    const data = await sql<InvoiceForm[]>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    const invoice = data.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    return invoice[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoice.");
  }
}

export async function fetchCustomers() {
  try {
    const customers = await sql<CustomerField[]>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

    return customers;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch all customers.");
  }
}

export async function fetchFilteredCustomers(query: string) {
  try {
    const data = await sql<CustomersTableType[]>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

    const customers = data.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch customer table.");
  }
}
