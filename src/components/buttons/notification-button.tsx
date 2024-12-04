"use client";

import { Bell, BellOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useUser } from '@clerk/nextjs';
import Loader from '../elements/loader';

interface NotificationButtonProps {
  count?: number
  onClick?: () => void
  className?: string
}

export function NotificationButton({ count, onClick, className }: NotificationButtonProps) {
  const { user, isLoaded } = useUser();

  const displayCount = count !== undefined && count > 99 ? '99+' : count;

  return (
    <Button
      variant="outline"
      size="icon"
      className={cn('relative', className)}
      onClick={onClick}
      aria-label={`Notifications ${count ? `(${count} unread)` : ''}`}
      disabled={!user}
    >
      {isLoaded ? user ? <Bell /> : <BellOff /> : <Loader />}
      {count !== undefined && count > 0 && (
        <span
          className={cn(
            "absolute -top-2 -right-2 flex items-center justify-center rounded-full bg-primary text-primary-foreground font-medium",
            displayCount === '99+' ? "h-6 w-6 text-[0.65rem]" : "h-5 w-5 text-[0.7rem]"
          )}
        >
          {displayCount}
        </span>
      )}
    </Button>
  )
}
