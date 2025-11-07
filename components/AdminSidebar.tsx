'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  FileText,
  Users,
  Building,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  MessageSquare,
  Bell
} from 'lucide-react'

interface AdminSidebarProps {
  user: any
  onLogout: () => void
}

export default function AdminSidebar({ user, onLogout }: AdminSidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  const menuItems = [
    {
      title: 'MAIN MENU',
      items: [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/admin', badge: null },
        { icon: FileText, label: 'Pengaduan', href: '/admin/pengaduan', badge: '5' },
        { icon: Users, label: 'Pengguna', href: '/admin/users', badge: null },
      ]
    },
    {
      title: 'ANALYTICS',
      items: [
        { icon: BarChart3, label: 'Laporan', href: '/admin/reports', badge: null },
      ]
    },
    {
      title: 'OTHERS',
      items: [
        { icon: Settings, label: 'Pengaturan', href: '/admin/settings', badge: null },
      ]
    }
  ]

  return (
    <>
      {/* Sidebar */}
      <motion.aside
        initial={{ width: 280 }}
        animate={{ width: collapsed ? 80 : 280 }}
        className="fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-50 flex flex-col"
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          {!collapsed ? (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">SIPelan</h1>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mx-auto">
              <span className="text-white font-bold text-xl">S</span>
            </div>
          )}
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto p-4">
          {menuItems.map((section, idx) => (
            <div key={idx} className="mb-6">
              {!collapsed && (
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
                  {section.title}
                </h3>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} px-3 py-2.5 rounded-lg transition-all ${
                        isActive
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon className="w-5 h-5" />
                        {!collapsed && <span className="font-medium">{item.label}</span>}
                      </div>
                      {!collapsed && item.badge && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs font-bold rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          {!collapsed ? (
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                {user?.nama_lengkap?.charAt(0) || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{user?.nama_lengkap}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-3">
              {user?.nama_lengkap?.charAt(0) || 'A'}
            </div>
          )}
          
          <button
            onClick={onLogout}
            className={`w-full flex items-center ${collapsed ? 'justify-center' : 'justify-start space-x-2'} px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all`}
          >
            <LogOut className="w-4 h-4" />
            {!collapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </motion.aside>

      {/* Mobile Overlay */}
      <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setCollapsed(true)} />
    </>
  )
}
