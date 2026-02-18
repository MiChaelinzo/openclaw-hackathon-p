export function formatRelativeTime(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  if (seconds < 5) return 'Just now'
  if (seconds < 60) return `${seconds}s ago`
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 30) return `${days}d ago`
  if (months < 12) return `${months}mo ago`
  return `${years}y ago`
}

export function formatDate(timestamp: number, format: 'short' | 'long' | 'full' = 'short'): string {
  const date = new Date(timestamp)
  
  switch (format) {
    case 'short':
      return date.toLocaleDateString(undefined, { 
        month: 'short', 
        day: 'numeric' 
      })
    case 'long':
      return date.toLocaleDateString(undefined, { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      })
    case 'full':
      return date.toLocaleDateString(undefined, { 
        weekday: 'long',
        month: 'long', 
        day: 'numeric', 
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      })
    default:
      return date.toLocaleDateString()
  }
}

export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const remainingSeconds = Math.floor(seconds % 60)

  if (hours > 0) {
    const remainingMinutes = minutes % 60
    return `${hours}h ${remainingMinutes}m`
  }
  
  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`
  }
  
  return `${remainingSeconds}s`
}

export function formatDateTime(timestamp: number, includeTime: boolean = false): string {
  const now = new Date()
  const date = new Date(timestamp)
  
  const isToday = date.getDate() === now.getDate() && 
                  date.getMonth() === now.getMonth() && 
                  date.getFullYear() === now.getFullYear()
                  
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  const isYesterday = date.getDate() === yesterday.getDate() && 
                      date.getMonth() === yesterday.getMonth() && 
                      date.getFullYear() === yesterday.getFullYear()

  const timeStr = date.toLocaleTimeString(undefined, { 
    hour: 'numeric', 
    minute: '2-digit' 
  })

  if (isToday) {
    return includeTime ? `Today at ${timeStr}` : 'Today'
  }

  if (isYesterday) {
    return includeTime ? `Yesterday at ${timeStr}` : 'Yesterday'
  }

  const dateStr = date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  })

  return includeTime ? `${dateStr} at ${timeStr}` : dateStr
}


