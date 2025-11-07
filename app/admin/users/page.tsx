'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Users, UserPlus, Edit, Trash2, Search, Filter, 
  Mail, Phone, Building, Shield, Clock, RefreshCw
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/contexts/AuthContext'
import AdminSidebar from '@/components/AdminSidebar'

interface User {
  id: string
  username: string
  email: string
  nama_lengkap: string
  role: string
  bidang_id?: number
  kode_bidang?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function UsersManagementPage() {
  const router = useRouter()
  const { user, isLoading: authLoading, isAuthenticated, logout } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/login')
      return
    }
    loadUsers()
  }, [user, authLoading, isAuthenticated, router])

  useEffect(() => {
    let filtered = users
    
    if (searchQuery) {
      filtered = filtered.filter(u => 
        u.nama_lengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    if (roleFilter !== 'all') {
      filtered = filtered.filter(u => u.role === roleFilter)
    }
    
    setFilteredUsers(filtered)
  }, [users, searchQuery, roleFilter])

  const loadUsers = async () => {
    setIsLoadingData(true)
    try {
      console.log('Loading users from database...')
      const response = await fetch('/api/users')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      
      console.log('Users API response:', result)
      
      if (result.success) {
        console.log('Users loaded:', result.data.length)
        setUsers(result.data)
        setFilteredUsers(result.data)
      } else {
        console.error('API returned error:', result)
        throw new Error(result.message || 'Gagal memuat data')
      }
    } catch (error: any) {
      console.error('Error loading users:', error)
      console.error('Error stack:', error.stack)
      
      let errorMessage = 'Gagal memuat data user dari database'
      if (error.message) {
        errorMessage = error.message
      }
      
      toast.error(errorMessage, {
        duration: 5000
      })
      setUsers([])
      setFilteredUsers([])
    } finally {
      setIsLoadingData(false)
    }
  }

  const getRoleBadge = (role: string) => {
    const badges = {
      admin: 'bg-red-100 text-red-700 border-red-200',
      bidang: 'bg-blue-100 text-blue-700 border-blue-200',
      masyarakat: 'bg-green-100 text-green-700 border-green-200'
    }
    return badges[role as keyof typeof badges] || 'bg-gray-100 text-gray-700'
  }

  const getRoleLabel = (role: string) => {
    const labels = {
      admin: '👑 Administrator',
      bidang: '🏢 Staff Bidang',
      masyarakat: '👤 Masyarakat'
    }
    return labels[role as keyof typeof labels] || role
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Memuat...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar user={user} onLogout={() => {
        logout()
        toast.success('Logout berhasil')
      }} />
      
      <div className="lg:pl-[280px]">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Manajemen User</h2>
            <p className="text-sm text-gray-500 mt-1">Kelola pengguna sistem SIPelan</p>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8">
          {/* Main Content */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div className="flex-1 flex gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari user..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Semua Role</option>
                  <option value="admin">Admin</option>
                  <option value="bidang">Bidang</option>
                  <option value="masyarakat">Masyarakat</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={loadUsers}
                  disabled={isLoadingData}
                  className="flex items-center space-x-2 px-3 sm:px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoadingData ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
                
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  <span className="hidden sm:inline">Tambah User</span>
                </button>
              </div>
            </div>

            {/* Users Table */}
            {isLoadingData ? (
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <div className="overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">User</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Role</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Terdaftar</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3].map((i) => (
                      <tr key={i} className="border-b border-gray-100 animate-pulse">
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                            <div>
                              <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                              <div className="h-3 bg-gray-200 rounded w-24"></div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="h-4 bg-gray-200 rounded w-40"></div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="h-6 bg-gray-200 rounded w-24"></div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="h-4 bg-gray-200 rounded w-32"></div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="h-4 bg-gray-200 rounded w-28"></div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex justify-end space-x-2">
                            <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                            <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                  </div>
                </div>
              </div>
            ) : (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">User</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Role</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Terdaftar</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                            {user.nama_lengkap.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{user.nama_lengkap}</p>
                            <p className="text-sm text-gray-500">@{user.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Mail className="w-4 h-4" />
                          <span className="text-sm">{user.email}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${getRoleBadge(user.role)}`}>
                          {getRoleLabel(user.role)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${
                          user.is_active 
                            ? 'bg-green-100 text-green-700 border-green-200' 
                            : 'bg-red-100 text-red-700 border-red-200'
                        }`}>
                          {user.is_active ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">
                            {new Date(user.created_at).toLocaleDateString('id-ID')}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Tidak ada user ditemukan</p>
                </div>
              )}
                </div>
              </div>
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
