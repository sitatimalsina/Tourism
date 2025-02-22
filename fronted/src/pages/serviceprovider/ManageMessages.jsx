import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AdminHeader from "../../components/Admin/Header";
import Sidebar from "../../components/Admin/Sidebar";

const ManageMessages = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);

  // Fetch all messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch("/api/contact");
        if (!res.ok) throw new Error("Failed to fetch messages");
        const data = await res.json();
        setMessages(data);
      } catch (error) {
        toast.error(error.message || "Failed to fetch messages");
      }
    };
    fetchMessages();
  }, []);

  // Handle message deletion
  const handleDelete = async (contactId) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;

    try {
      const res = await fetch(`/api/contact/${contactId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete message");
      }

      // Optimistic update: Remove the deleted message from the state
      setMessages((prevMessages) => prevMessages.filter((msg) => msg._id !== contactId));
      toast.success("Message deleted successfully!");
    } catch (error) {
      toast.error(error.message || "Error deleting message");
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <AdminHeader />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
          <h1 className="text-3xl font-semibold text-gray-700 mb-6">Manage Enquiry</h1>
          {messages.length === 0 ? (
            <p className="text-gray-600 text-center">No messages found.</p>
          ) : (
            <div className="bg-white p-4 shadow-lg rounded-lg overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">Enquiry</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map((message) => (
                    <tr key={message._id} className="border-b hover:bg-gray-100">
                      <td className="p-3">{message.name}</td>
                      <td className="p-3">{message.email}</td>
                      <td className="p-3">{message.message}</td>
                      <td className="p-3">
                        <button
                          onClick={() => handleDelete(message._id)}
                          className="px-3 py-1 text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ManageMessages;