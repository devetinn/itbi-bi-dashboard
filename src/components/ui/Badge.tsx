interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'info'
}

const variants = {
  default: 'bg-[#F0EFEA] text-[#4A4A4A] border-[#E8E6DF]',
  success: 'bg-[#E8F0EE] text-[#4A7C6F] border-[#C5DDD8]',
  warning: 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]',
  info: 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]',
}

export function Badge({ children, variant = 'default' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium border rounded-full ${variants[variant]}`}>
      {children}
    </span>
  )
}
