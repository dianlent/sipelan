'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface ChartCardProps {
  title: string
  subtitle?: string
  icon?: LucideIcon
  children: React.ReactNode
}

export default function ChartCard({ title, subtitle, icon: Icon, children }: ChartCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        {Icon && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <Icon className="w-5 h-5 text-gray-600" />
          </div>
        )}
      </div>
      <div>{children}</div>
    </motion.div>
  )
}
