import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { UserPlus, RefreshCw } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import PageHeader from '../../components/common/PageHeader';
import UserTable from '../../components/admin/UserTable';
import SearchInput from '../../components/common/SearchInput';
import FilterDropdown from '../../components/common/FilterDropdown';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import AddUserModal from '../../components/admin/AddUserModal';
import { adminApi } from '../../api/admin';
import { demoUsers } from '../../utils/demoData';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.getUsers();
      const rawUsers = res.data?.data || res.data || [];
      const formatted = rawUsers.map((u) => ({
        ...u,
        role: u.role || u.roles?.[0]?.name || 'reporter',
        is_active: u.is_active ?? true,
      }));
      setUsers(formatted);
    } catch (err) {
      setUsers(demoUsers);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = users.filter((u) => {
    if (roleFilter && u.role !== roleFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
    }
    return true;
  });

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminApi.changeRole(userId, { role: newRole });
      setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
      toast.success(`User role updated to ${newRole}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update user role');
    }
  };

  const handleToggleActive = async (userId) => {
    try {
      const res = await adminApi.toggleActive(userId);
      const newStatus = res.data?.is_active;
      setUsers(users.map((u) => (u.id === userId ? { ...u, is_active: newStatus ?? !u.is_active } : u)));
      toast.success('User account status updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to toggle account status');
    }
  };

  const handleDeleteUser = async () => {
    if (deleteId) {
      try {
        await adminApi.deleteUser(deleteId);
        setUsers(users.filter((u) => u.id !== deleteId));
        toast.success('User account deleted');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete user account');
      } finally {
        setDeleteId(null);
      }
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="User Account Directory"
          description="Manage registered citizen reporters, response unit officers, and system administrators"
          action={
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center space-x-2 bg-brand hover:bg-brand-soft text-white font-bold text-xs px-4 py-2.5 rounded-none shadow-md transition cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add New User</span>
            </button>
          }
        />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-none p-4 shadow-sm">
          <SearchInput value={search} onChange={setSearch} placeholder="Search user by name or email..." />
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <FilterDropdown
              label="All Roles"
              value={roleFilter}
              options={[
                { id: 'super_admin', label: 'Super Admin' },
                { id: 'admin', label: 'Admin' },
                { id: 'response_team', label: 'Response Team' },
                { id: 'reporter', label: 'Reporter' },
              ]}
              onChange={setRoleFilter}
            />
            <button
              onClick={fetchUsers}
              className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-none transition cursor-pointer"
              title="Refresh Directory"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        <UserTable
          users={filteredUsers}
          onRoleChange={handleRoleChange}
          onToggleActive={handleToggleActive}
          onDeleteUser={(id) => setDeleteId(id)}
        />
      </div>

      {/* Add User Modal */}
      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onUserCreated={() => fetchUsers()}
      />

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete User Account?"
        message="Are you sure you want to permanently remove this user account from the system?"
        isDangerous={true}
        onConfirm={handleDeleteUser}
        onClose={() => setDeleteId(null)}
      />
    </AdminLayout>
  );
}
