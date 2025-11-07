'use client'

import { motion } from 'framer-motion'

interface ProgressBarProps {
  label: string
  value: number
  max: number
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple'
}

const colorClasses = {
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
  red: 'bg-red-500',
  purple: 'bg-purple-500'
}

export default function ProgressBar({ label, value, max, color = 'blue' }: ProgressBarProps) {
  const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-semibold text-gray-900">
          {value} / {max}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full ${colorClasses[color]} rounded-full`}
        />
      </div>
      <div className="text-right mt-1">
        <span className="text-xs text-gray-500">{percentage.toFixed(1)}%</span>
      </div>
    </div>
  )
}
