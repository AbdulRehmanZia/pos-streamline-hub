import React, { useState, useEffect, useContext, useCallback } from "react";
import { api } from "../Instance/api";
import { Trash2, Edit, Loader, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { UserContext } from "../context/UserContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../components/ui/sheet";
import MemberForm from "./MemberForm";
import ConfirmModal from "./ConfirmModal";

export default function MemberTable({ refreshKey }) {
  const { user } = useContext(UserContext);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalItems: 0
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);

 const fetchMembers = useCallback(async () => {
  try {
    setLoading(true);
    setError(null);

    const res = await api.get(
  `user/?page=${pagination.page}&limit=${pagination.limit}&search=${searchTerm}`
);

    // Debugging log
    console.log("API Response:", res);
    console.log("Search Term Sent:", searchTerm);
console.log("Response:", res.data);


    if (!res || !res.data) {
      throw new Error("Invalid API response structure");
    }

    // Extract from ApiResponse structure
    const membersData = Array.isArray(res.data.data) ? res.data.data : [];
    const meta = res.data.meta || {};

    setMembers(membersData);
    setPagination(prev => ({
      ...prev,
      totalPages: meta.totalPages || 1,
      totalItems: meta.totalUsers || membersData.length
    }));
  } catch (error) {
    console.error("Error fetching members", error);
    setError("Failed to load members");
    toast.error("Failed to load members");
    setMembers([]); 
  } finally {
    setLoading(false);
  }
}, [pagination.page, pagination.limit, searchTerm]);


  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMembers();
    }, 500);
    return () => clearTimeout(timer);
  }, [refreshKey, pagination.page, pagination.limit, searchTerm, fetchMembers]);

  useEffect(() => {
    if (members.length === 0 && pagination.page > 1) {
      setPagination(prev => ({ ...prev, page: prev.page - 1 }));
    }
  }, [members.length, pagination.page]);

  const handleDeleteClick = (id) => {
    setMemberToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/admin/members/delete-member/${memberToDelete}`);
      toast.success("Member deleted successfully");
      
      // Optimistic update
      setMembers(prev => prev.filter(member => member.id !== memberToDelete));
      setPagination(prev => ({
        ...prev,
        totalItems: prev.totalItems - 1
      }));
      
      fetchMembers();
      
      setDeleteModalOpen(false);
      setMemberToDelete(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete member");
      console.error("Error deleting member", error);
      fetchMembers(); // Refresh data on error
      setDeleteModalOpen(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  const handleLimitChange = (e) => {
    const newLimit = parseInt(e.target.value);
    setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleEditClick = (member) => {
    setSelectedMember(member);
    setIsEditSheetOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin h-10 w-10 text-[#1C3333]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-[#1C3333]">
        <AlertCircle className="h-12 w-12 mb-4 text-[#FF6F61]" />
        <p className="text-lg font-medium">{error}</p>
        <button
          onClick={fetchMembers}
          className="mt-4 px-4 py-2 bg-[#1C3333] text-white rounded-md hover:bg-[#1C3333]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1C3333]"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-[#1C3333]/20 overflow-hidden">
      <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md bg-[#F4F9F9]">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-[#1C3333]">
              {selectedMember ? "Edit Member" : "New Member"}
            </SheetTitle>
          </SheetHeader>
          <MemberForm
            initialData={selectedMember}
            onMemberAdded={() => {
              setPagination(prev => ({ ...prev, page: 1 }));
              fetchMembers();
              setIsEditSheetOpen(false);
            }}
            onClose={() => setIsEditSheetOpen(false)}
          />
        </SheetContent>
      </Sheet>

      <div className="px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#1C3333]/20 bg-[#F4F9F9] gap-3">
        <div className="w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search members..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-3 py-2 border border-[#1C3333]/30 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1C3333] focus:border-[#1C3333] text-[#1C3333] bg-white"
          />
        </div>
        
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-normal">
          <span className="text-sm text-[#1C3333]">
            Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{" "}
            <span className="font-medium">
              {Math.min(pagination.page * pagination.limit, pagination.totalItems)}
            </span>{" "}
            of <span className="font-medium">{pagination.totalItems}</span> results
          </span>
          <select
            value={pagination.limit}
            onChange={handleLimitChange}
            className="text-sm border-[#1C3333]/30 rounded-md focus:ring-[#1C3333] focus:border-[#1C3333] text-[#1C3333]"
          >
            <option value="5">5 per page</option>
            <option value="10">10 per page</option>
            <option value="20">20 per page</option>
            <option value="50">50 per page</option>
          </select>
        </div>
        <div className="flex space-x-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="px-3 py-1 border border-[#1C3333]/30 rounded-md text-sm font-medium text-[#1C3333] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#1C3333]/10"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
            className="px-3 py-1 border border-[#1C3333]/30 rounded-md text-sm font-medium text-[#1C3333] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#1C3333]/10"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#1C3333]/20">
          <thead className="bg-[#F4F9F9]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#1C3333] uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#1C3333] uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#1C3333] uppercase tracking-wider">
                Role
              </th>
              {user?.role === "admin" && (
                <th className="px-6 py-3 text-right text-xs font-medium text-[#1C3333] uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#1C3333]/20">
            {Array.isArray(members) && members.length > 0 ? (
              members.map((member) => (
                <tr key={member.id} className="hover:bg-[#F4F9F9]">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-[#1C3333]">{member.fullname}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[#1C3333]">{member.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[#1C3333]">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        member.role === 'admin' 
                          ? 'bg-[#1C3333] text-white' 
                          : 'bg-[#1C3333]/10 text-[#1C3333]'
                      }`}>
                        {member.role}
                      </span>
                    </div>
                  </td>
                  {user?.role === "admin" && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEditClick(member)}
                          className="text-[#1C3333] hover:text-[#1C3333]/70 p-1 rounded-md hover:bg-[#1C3333]/10"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(member.id)}
                          disabled={member.role === 'admin'} 
                          className={`p-1 rounded-md hover:bg-[#FF6F61]/10 ${
                            member.role === 'admin' 
                              ? 'text-gray-400 cursor-not-allowed' 
                              : 'text-[#FF6F61] hover:text-[#FF6F61]/80'
                          }`}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={user?.role === "admin" ? 4 : 3} className="py-4 text-center text-[#1C3333]/70">
                  No members found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        open={deleteModalOpen}
        title="Delete Member"
        message="Are you sure you want to delete this member? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  );
}