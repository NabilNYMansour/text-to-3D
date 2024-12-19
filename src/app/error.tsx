"use client";

import { Button } from '@/components/ui/button';
import { captureException } from '@sentry/nextjs';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    captureException(error);
  }, [error]);

  return (
    <div className="p-10 cu-flex-center flex-col gap-4">
      <div className='text-9xl'>Error</div>
      <div className='text-4xl'>:(</div>
      <div className='text-muted-foreground text-center'>An error occurred</div>
      <div>
        <Link key="Home" href="/">
          <Button variant="secondary" className='border' onClick={() => reset()}>
            Try again
          </Button>
        </Link>
      </div>
    </div>
  );
}