'use client';

import { useState, useEffect } from 'react';
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";

interface TeamAdmin {
  _id: string;
  name: string;
  email: string;
  teamCode: string;
  password: string;
  status: 'approved' | 'pending' | 'rejected';
  createdAt: string;
  lastLogin?: string;
}

interface Team {
  code: string;
  name: string;
}

interface Notification {
  _id: string;
  type: string;
  title: string;
  message: string;
  data: {
    name: string;
    email: string;
    teamCode: string;
    message?: string;
  };
  read: boolean;
  createdAt: string;
}

export default function TeamAdminsPage() {
  const [teamAdmins, setTeamAdmins] = useState<TeamAdmin[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [requests, setRequests] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAdmin, setEditingAdmin] = useState<TeamAdmin | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    teamCode: '',
    password: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [teamsRes, notificationsRes] = await Promise.all([
        fetch('/api/teams'),
        fetch('/api/notifications')
      ]);

      const [teamsData, notificationsData] = await Promise.all([
        teamsRes.json(),
        notificationsRes.json()
      ]);

      setTeams(teamsData);
      
      // Filter team admin requests
      const teamAdminRequests = notificationsData.filter((n: Notification) => 
        n.type === 'team-admin-request'
      );
      setRequests(teamAdminRequests);

      // Get existing team admins (we'll create this API)
      try {
        const teamAdminsRes = await fetch('/api/team-admins');
        const teamAdminsData = await teamAdminsRes.json();
        setTeamAdmins(teamAdminsData);
      } catch (error) {
        console.log('Team admins API not available yet');
        setTeamAdmins([]);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRequest = async (notification: Notification) => {
    try {
      // Create team admin account
      const createResponse = await fetch('/api/team-admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: notification.data.name,
          email: notification.data.email,
          teamCode: notification.data.teamCode,
          password: 'temp123' // Default password
        })
      });

      if (createResponse.ok) {
        // Mark notification as approved
        await fetch('/api/notifications', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            notificationId: notification._id,
            action: 'approve'
          })
        });

        await fetchData();
        alert('Team admin approved successfully!');
      } else {
        const error = await createResponse.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error approving request:', error);
      alert('Error approving request');
    }
  };

  const handleRejectRequest = async (notification: Notification) => {
    if (!confirm('Are you sure you want to reject this request?')) return;

    try {
      await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notificationId: notification._id,
          action: 'reject'
        })
      });

      await fetchData();
      alert('Request rejected');
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('Error rejecting request');
    }
  };

  const handleEditAdmin = (admin: TeamAdmin) => {
    setEditingAdmin(admin);
    setFormData({
      name: admin.name,
      email: admin.email,
      teamCode: admin.teamCode,
      password: admin.password
    });
  };

  const handleUpdateAdmin = async () => {
    if (!editingAdmin) return;

    try {
      const response = await fetch('/api/team-admins', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminId: editingAdmin._id,
          ...formData
        })
      });

      if (response.ok) {
        await fetchData();
        setEditingAdmin(null);
        alert('Team admin updated successfully!');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error updating admin:', error);
      alert('Error updating admin');
    }
  };

  const handleDeleteAdmin = async (adminId: string, adminName: string) => {
    if (!confirm(`Are you sure you want to delete team admin "${adminName}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/team-admins?id=${adminId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchData();
        alert('Team admin deleted successfully!');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error deleting admin:', error);
      alert('Error deleting admin');
    }
  };

  if (loading) {
    return (
      <>
        <Breadcrumb pageName="Team Admin Management" />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Breadcrumb pageName="Team Admin Management" />

      <div className="space-y-6">
        {/* Pending Requests */}
        {requests.filter(r => !r.read).length > 0 && (
          <ShowcaseSection title="Pending Access Requests">
            <div className="space-y-4">
              {requests.filter(r => !r.read).map((request) => (
                <div key={request._id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-yellow-800">{request.data.name}</h3>
                      <p className="text-sm text-yellow-700">{request.data.email}</p>
                      <p className="text-sm text-yellow-600">
                        Requesting access for team: <strong>{request.data.teamCode}</strong>
                      </p>
                      {request.data.message && (
                        <p className="text-sm text-yellow-600 mt-2">
                          <strong>Message:</strong> {request.data.message}
                        </p>
                      )}
                      <p className="text-xs text-yellow-500 mt-2">
                        Requested: {new Date(request.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleApproveRequest(request)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectRequest(request)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ShowcaseSection>
        )}

        {/* Existing Team Admins */}
        <ShowcaseSection title="Team Administrators">
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Team Admin Management</h3>
            <div className="text-sm text-blue-700 space-y-1">
              <p><strong>Approve Requests:</strong> Review and approve team admin access requests</p>
              <p><strong>Manage Passwords:</strong> Update passwords for existing team admins</p>
              <p><strong>Access Control:</strong> Team admins can only access their assigned team data</p>
            </div>
          </div>

          {teamAdmins.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No team administrators found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-4 px-4 font-bold text-gray-700">Admin</th>
                    <th className="text-left py-4 px-4 font-bold text-gray-700">Team</th>
                    <th className="text-left py-4 px-4 font-bold text-gray-700">Password</th>
                    <th className="text-left py-4 px-4 font-bold text-gray-700">Status</th>
                    <th className="text-left py-4 px-4 font-bold text-gray-700">Last Login</th>
                    <th className="text-left py-4 px-4 font-bold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teamAdmins.map((admin) => (
                    <tr key={admin._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-gray-900">{admin.name}</div>
                          <div className="text-sm text-gray-500">{admin.email}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          {admin.teamCode}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                          {admin.password}
                        </code>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {admin.lastLogin ? new Date(admin.lastLogin).toLocaleDateString() : 'Never'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleEditAdmin(admin)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteAdmin(admin._id, admin.name)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </ShowcaseSection>

        {/* Edit Admin Modal */}
        {editingAdmin && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Edit Team Admin</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Team
                  </label>
                  <select
                    value={formData.teamCode}
                    onChange={(e) => setFormData(prev => ({ ...prev, teamCode: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {teams.map((team) => (
                      <option key={team.code} value={team.code}>
                        {team.code} - {team.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="text"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter new password"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setEditingAdmin(null)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateAdmin}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}