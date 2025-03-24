'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
export default function EditClient({label='Back',className=''}) {
    const params = useParams();
    const router = useRouter();
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

    const [client, setClient] = useState<Client | null>(null);
    const [activeTab, setActiveTab] = useState('summary');
    useEffect(() => {
        // Fetch client data
        const fetchClient = async () => {
            try {
                const response = await fetch(`/api/clients/${clientId}`);
                const data = await response.json();
                setClient(data);
            } catch (error) {
                console.error('Error fetching client:', error);
            }
        };

        if (clientId) {
            fetchClient();
        }
    }, [clientId]);

    const formatDate = (dateString:any) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true
        }).format(date);
      };

    return (
        <div className="bg-gray-50 min-h-screen p-6">
            <button
      onClick={() => router.back()}
      className={`flex items-center text-gray-700 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${className}`}
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
      {label}
    </button>



            <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="flex items-center mb-4 md:mb-0">
                {client?.customer_id?.image_url ? (
                  <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-blue-500">
                    <Image 
                      src={client.customer_id.image_url} 
                      alt={client.customer_id.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 font-bold text-xl border-2 border-blue-500">
                    {client?.customer_id?.name?.split(' ').map(name => name[0]).join('')}
                  </div>
                )}
                <div className="ml-4">
                  <h1 className="text-2xl font-bold text-gray-800">{client?.customer_id?.name}</h1>
                  <p className="text-gray-600">{client?.customer_id?.email}</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                {client && (
                  <span className={`px-3 py-1 text-sm rounded-full font-medium ${
                    client.status === 'Active' ? 'bg-green-200 text-green-800' :
                    client.status === 'Pending' ? 'bg-yellow-200 text-yellow-800' :
                    'bg-gray-200 text-gray-800'
                  }`}>
                    {client.status}
                  </span>
                )}
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors w-full sm:w-auto">
                  Contact Client
                </button>
              </div>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 mb-6">
            <button 
              className={`px-4 py-2 font-medium ${activeTab === 'summary' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('summary')}
            >
              Client Summary
            </button>
            <button 
              className={`px-4 py-2 font-medium ${activeTab === 'interactions' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('interactions')}
            >
              Interaction History
            </button>
            <button 
              className={`px-4 py-2 font-medium ${activeTab === 'recommendations' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('recommendations')}
            >
              Recommendations
            </button>
          </div>
          
          {/* Content Area */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Client Summary Tab */}
            {activeTab === 'summary' && (
              <>
                <div className="bg-white rounded-lg shadow-md overflow-hidden col-span-1">
                  <div className="bg-blue-600 text-white px-6 py-3">
                    <h2 className="text-lg font-semibold">Client Details</h2>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Client ID</p>
                      <p className="font-medium text-gray-800">{client?.customer_id?._id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Financial Goals</p>
                      <p className="font-medium text-gray-800">{client?.financialGoals || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Risk Profile</p>
                      <span className={`inline-block px-3 py-1 text-sm rounded-full font-medium ${
                        client?.risk_profile === 'High' ? 'bg-red-100 text-red-800' :
                        client?.risk_profile === 'Moderate' ? 'bg-blue-100 text-blue-800' :
                        client?.risk_profile === 'Low' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {client?.risk_profile || 'Not specified'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md overflow-hidden col-span-1 lg:col-span-2">
                  <div className="bg-blue-600 text-white px-6 py-3">
                    <h2 className="text-lg font-semibold">Financial Overview</h2>
                  </div>
                  <div className="p-6">
                    <div className="flex flex-col space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-gray-500">Investment Accounts</p>
                        <p className="text-lg font-semibold text-gray-800">Not available</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-gray-500">Recommended Products</p>
                        <p className="text-lg font-semibold text-gray-800">Education Savings Plans</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
            
            {/* Interactions Tab */}
            {activeTab === 'interactions' && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden col-span-1 lg:col-span-3">
                <div className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Interaction History</h2>
                  <button className="bg-white text-blue-600 px-3 py-1 rounded-md text-sm font-medium hover:bg-blue-50">
                    Add Interaction
                  </button>
                </div>
                <div className="p-6">
                  {client && client.interactionHistory && client.interactionHistory.length > 0 ? (
                    <div className="space-y-4">
                      {client.interactionHistory.map((interaction, index) => (
                        <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                          <div className="flex justify-between items-center mb-2">
                            <p className="font-medium text-gray-800">{formatDate(interaction.date)}</p>
                            <span className="text-xs text-gray-500">ID: {interaction._id.substring(0, 8)}</span>
                          </div>
                          <p className="text-gray-600">{interaction.notes}</p>
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
            )}
            
            {/* Recommendations Tab */}
            {activeTab === 'recommendations' && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden col-span-1 lg:col-span-3">
                <div className="bg-blue-600 text-white px-6 py-3">
                  <h2 className="text-lg font-semibold">Recommendations & Actions</h2>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <button className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                    <div className="bg-blue-500 text-white p-3 rounded-full mr-4">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium text-gray-800">Create Education Plan</h3>
                      <p className="text-sm text-gray-500">Based on financial goals</p>
                    </div>
                  </button>
                  
                  <button className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="bg-gray-500 text-white p-3 rounded-full mr-4">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium text-gray-800">Schedule Meeting</h3>
                      <p className="text-sm text-gray-500">Follow-up discussion</p>
                    </div>
                  </button>
                  
                  <button className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="bg-gray-500 text-white p-3 rounded-full mr-4">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium text-gray-800">Portfolio Analysis</h3>
                      <p className="text-sm text-gray-500">Review investment strategy</p>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
  
    );
}