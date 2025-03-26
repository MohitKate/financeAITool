"use client"; // Enable client-side rendering
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ClientFormData } from '@/app/lib/definitions';
import { useParams } from 'next/navigation';

const EditClientProfile = () => {
  const router = useRouter();
  const params = useParams();
    const clientId = params?.client_id;

    interface Client {
        customer_id: {
            _id: string;
            name: string;
            email: string;
            image_url?: string;
        };
        status: string;
        financialGoals?: string;
        risk_profile?: string;
        interactionHistory?: {
            _id: string;
            date: string;
            notes: string;
        }[];
    }
  const [formData, setFormData] = useState<Client| null>(null);

  const [newInteraction, setNewInteraction] = useState({
    date: '',
    notes: ''
  });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleAddInteraction = () => {
//     if (newInteraction.date && newInteraction.notes) {
//       setFormData(prev => ({
//         ...prev,
//         interactionHistory: [
//           ...prev.interactionHistory, 
//           { 
//             ...newInteraction, 
//             date: new Date(newInteraction.date).toISOString() 
//           }
//         ]
//       }));
//       // Reset new interaction fields
//       setNewInteraction({ date: '', notes: '' });
//     }
//   };

//   const handleRemoveInteraction = (indexToRemove) => {
//     setFormData(prev => ({
//       ...prev,
//       interactionHistory: prev.interactionHistory.filter((_, index) => index !== indexToRemove)
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSave(formData);
//   };

 useEffect(() => {
        // Fetch client data
        const fetchClient = async () => {
            try {
                const response = await fetch(`/api/clients/${clientId}`);
                const data = await response.json();
                console.log(data);
               setFormData(data);
            } catch (error) {
                console.error('Error fetching client:', error);
            }
        };

        if (clientId) {
            fetchClient();
        }
    }, [clientId]);

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <button
        onClick={() => router.back()}
        className="flex items-center text-gray-700 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mb-6"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 mr-1" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M10 19l-7-7m0 0l7-7m-7 7h18" 
          />
        </svg>
        Back
      </button>

      <div className="max-w-6xl mx-auto">
        <form >
          {/* Header Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-blue-500">
                  <Image 
                    src={formData?.customer_id?.image_url || '/default-avatar.png'}
                    alt={formData?.customer_id?.name ||''}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="ml-4 flex-grow">
                  <input 
                    type="text"
                    name="name"
                    defaultValue={formData?.customer_id?.name}
                    // onChange={handleInputChange}
                    className=" text-gray-800 w-full border-b border-gray-300 focus:border-blue-500 outline-none rounded-md"
                    placeholder="Client Name"
                  />
                  <input 
                    type="email"
                    name="email"
                    defaultValue={formData?.customer_id?.email}
                    // onChange={handleInputChange}
                    className="mt-1 text-gray-600 w-full border-b border-gray-300 focus:border-blue-500 outline-none rounded-md"
                    placeholder="Email Address"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <button 
                  type="submit"
                  className="ml-2 px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors w-full sm:w-auto"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
          
          {/* Client Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md overflow-hidden col-span-1">
              <div className="bg-blue-600 text-white px-6 py-3">
                <h2 className="text-lg font-semibold">Client Details</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Financial Goals</p>
                  <textarea 
                    name="financialGoals"
                    defaultValue={formData?.financialGoals}
                    // onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Enter financial goals"
                    // rows="3"
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Image URL</p>
                  <input 
                    type="text"
                    name="image_url"
                    defaultValue={formData?.customer_id?.image_url}
                    // onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Enter image URL"
                  />
                </div>
              </div>
            </div>
            
            {/* Interaction History Section */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden col-span-1 lg:col-span-2">
              <div className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center">
                <h2 className="text-lg font-semibold">Interaction History</h2>
              </div>
              <div className="p-6 space-y-4">
                {/* Add New Interaction */}
                <div className="border-b pb-4 mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                      type="datetime-local"
                      defaultValue={newInteraction.date}
                      onChange={(e) => setNewInteraction(prev => ({
                        ...prev, 
                        date: e.target.value
                      }))}
                      className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <input 
                      type="text"
                      defaultValue={newInteraction.notes}
                      onChange={(e) => setNewInteraction(prev => ({
                        ...prev, 
                        notes: e.target.value
                      }))}
                      placeholder="Interaction Notes"
                      className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <button 
                    type="button"
                    // onClick={handleAddInteraction}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Add Interaction
                  </button>
                </div>

                {/* Existing Interactions */}
                {formData?.interactionHistory?.length ?? 0 > 0 ? (
                  <div className="space-y-4">
                    {formData?.interactionHistory?.map((interaction, index) => (
                      <div 
                        key={index} 
                        className="border-l-4 border-blue-500 pl-4 py-2 flex justify-between items-center"
                      >
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <p className="font-medium text-gray-800">
                              {new Date(interaction.date).toLocaleString()}
                            </p>
                          </div>
                          <p className="text-gray-600">{interaction.notes}</p>
                        </div>
                        <button 
                          type="button"
                        //   onClick={() => handleRemoveInteraction(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-5 w-5" 
                            viewBox="0 0 20 20" 
                            fill="currentColor"
                          >
                            <path 
                              fillRule="evenodd" 
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" 
                              clipRule="evenodd" 
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No interaction history available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditClientProfile;