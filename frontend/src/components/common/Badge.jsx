const statusColors = {
  // Ticket status colors
  new: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  resolved: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-800',

  // Priority colors
  low: 'bg-gray-100 text-gray-700',
  medium: 'bg-blue-100 text-blue-700',
  high: 'bg-orange-100 text-orange-700',
  critical: 'bg-red-200 text-red-800',
};

const defaultColors = {
  default: 'bg-gray-100 text-gray-800',
  primary: 'bg-odpp-blue text-white',
  success: 'bg-odpp-green text-white',
  warning: 'bg-odpp-amber text-white',
  danger: 'bg-odpp-red text-white',
  info: 'bg-blue-100 text-blue-800',
};

export default function Badge({
  children,
  variant = 'default',
  status,
  priority,
  size = 'md',
  className = ''
}) {
  // Determine which color scheme to use
  let colorClasses;

  if (status && statusColors[status]) {
    colorClasses = statusColors[status];
  } else if (priority && statusColors[priority]) {
    colorClasses = statusColors[priority];
  } else if (defaultColors[variant]) {
    colorClasses = defaultColors[variant];
  } else {
    colorClasses = defaultColors.default;
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${colorClasses} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status, className = '' }) {
  const statusLabels = {
    new: 'New',
    in_progress: 'In Progress',
    resolved: 'Resolved',
    closed: 'Closed',
  };

  return (
    <Badge status={status} className={className}>
      {statusLabels[status] || status}
    </Badge>
  );
}

export function PriorityBadge({ priority, className = '' }) {
  const priorityLabels = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    critical: 'Critical',
  };

  return (
    <Badge priority={priority} className={className}>
      {priorityLabels[priority] || priority}
    </Badge>
  );
}
