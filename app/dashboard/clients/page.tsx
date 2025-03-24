"use client"; // Enable client-side rendering

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import DeleteConfirmationModal from "./popup/page";
// Interface for interaction history
interface Interaction {
  date: string; // ISO 8601 date string
  notes: string;
}

// Interface for customer details
interface CustomerDetails {
  name: string;
  email: string;
  image_url: string;
}

// Main interface for the client document
interface Client {
  _id: string; // Assuming this is a string representation of an ObjectId
  customer_id: string; // String representation of the customer ID
  financialGoals: string;
  interactionHistory: Interaction[]; // Array of interaction history objects
  status: "Active" | "Inactive" | "Pending"; // Literal types for status
  risk_profile: "Low" | "Moderate" | "High" | "Very High"; // Literal types for risk profile
  customerDetails: CustomerDetails; // Nested customer details object
}
export default function ClientList() {
  const [clients, setClients] = useState<Client[]>([]);
  const router = useRouter(); // Change this line

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  // Fetch clients on component mount
  useEffect(() => {
    const fetchClients = async () => {
      const response = await axios.get("/api/clients");
      setClients(response.data);
    };

    fetchClients();
  }, []);
  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  // Update a client
  // const updateClient = async (clientId, updatedData) => {
  //     await fetch(`/api/clients/${clientId}`, {
  //         method: 'PUT',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify(updatedData),
  //     });
  //     // Refresh data after update
  //     const response = await fetch('/api/clients');
  //     setClients(await response.json());
  // };

  // Delete a client
  const deleteClient = async (clientId: string) => {
    try {
      setShowDeleteModal(true);

      // Send DELETE requests using Axios
    //   await Promise.all([
    //     axios.delete(`/api/clients/${clientId}`),
    //     axios.delete(`/api/customers/${clientId}`),
    //   ]);

      // Remove the deleted client from state
      setClients((prevClients) =>
        prevClients.filter((client) => client._id !== clientId)
      ); // Use _id to match the client ID
    } catch (error) {
      console.error("Error deleting client:", error);
      // Handle error (e.g., show a notification to the user)
    }
  };

  const viewClient = async (clientId: string) => {
    router.push(`/dashboard/clients/edit/${clientId}`);
  };

  // Get status color based on client status
  const getStatusColor = (status: any) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Pending review":
        return "bg-yellow-100 text-yellow-800";
      case "Needs attention":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-7 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Clients</h1>
          <p className="text-gray-600">
            A list of all clients in your advisory portfolio including their
            goals and status.
          </p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded">
          Add client
        </button>
      </div>

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        
      />

      <div className="shadow ring-1 ring-black ring-opacity-5 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <div className="h-100 overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Financial Goals
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Risk Profile
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Last Interaction
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="relative px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {clients.map((client) => (
                  <tr key={client.customer_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {client?.customerDetails?.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {client?.customerDetails?.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {client.financialGoals}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {client.risk_profile}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(client.interactionHistory[0].date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          client.status
                        )}`}
                      >
                        {client.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                      <button
                        className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-medium py-1 px-3 rounded text-xs mr-2"
                        onClick={() => viewClient(client?._id)}
                      >
                        View
                      </button>
                      <button className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-1 px-3 rounded text-xs mr-2">
                        Edit
                      </button>
                      <button
                        className="bg-red-100 hover:bg-red-200 text-red-700 font-medium py-1 px-3 rounded text-xs"
                        onClick={() => deleteClient(client.customer_id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-6">
        <div className="text-sm text-gray-700">
          Showing <span className="font-medium">10</span> of{" "}
          <span className="font-medium">10</span> clients
        </div>
        <div className="flex-1 flex justify-end">
          <button className="bg-white border border-gray-300 rounded-md shadow-sm px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 mr-3">
            Previous
          </button>
          <button className="bg-white border border-gray-300 rounded-md shadow-sm px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
