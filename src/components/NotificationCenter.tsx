import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { 
  Bell, 
  CheckCircle, 
  Warning,
  Info,
  X
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  timestamp: number
  read: boolean
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useKV<Notification[]>('notifications', [])
  const [open, setOpen] = useState(false)

  const unreadCount = (notifications || []).filter(n => !n.read).length

  const handleMarkAsRead = (id: string) => {
    setNotifications((current) =>
      (current || []).map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const handleMarkAllRead = () => {
    setNotifications((current) =>
      (current || []).map(n => ({ ...n, read: true }))
    )
  }

  const handleDelete = (id: string) => {
    setNotifications((current) => (current || []).filter(n => n.id !== id))
  }

  const handleClearAll = () => {
    setNotifications([])
  }

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} weight="fill" className="text-success" />
      case 'error':
        return <Warning size={20} weight="fill" className="text-error" />
      case 'warning':
        return <Warning size={20} weight="fill" className="text-warning" />
      case 'info':
        return <Info size={20} weight="fill" className="text-info" />
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative gap-2">
          <Bell size={20} />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Notifications</h3>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button
                size="sm"
                variant="ghost"
                onClick={handleMarkAllRead}
                className="text-xs h-7"
              >
                Mark all read
              </Button>
            )}
            {(notifications || []).length > 0 && (
              <Button
                size="sm"
                variant="ghost"
                onClick={handleClearAll}
                className="text-xs h-7"
              >
                Clear all
              </Button>
            )}
          </div>
        </div>

        <div className="max-h-[400px] overflow-auto">
          {(notifications || []).length === 0 ? (
            <div className="p-8 text-center">
              <Bell size={48} className="mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                No notifications yet
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {(notifications || []).map(notification => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-4 hover:bg-accent/5 transition-colors",
                    !notification.read && "bg-primary/5"
                  )}
                >
                  <div className="flex gap-3">
                    <div className="shrink-0 mt-0.5">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="font-medium text-sm">{notification.title}</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(notification.id)}
                          className="h-6 w-6 p-0 shrink-0"
                        >
                          <X size={14} />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                          {new Date(notification.timestamp).toLocaleString()}
                        </p>
                        {!notification.read && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="text-xs h-6"
                          >
                            Mark as read
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
