"use client";

import { Button } from '@/components/ui/button';
import { useMixpanel } from '@/lib/hooks';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NotFound() {
  const pathname = usePathname();
  useMixpanel("404", { pathname });
  return (
    <div className="p-10 cu-flex-center flex-col gap-4">
      <div className='text-9xl'>404</div>
      <div className='text-4xl'>¯\_(ツ)_/¯</div>
      <div className='text-muted-foreground text-center'>I don&apos;t know what you&apos;re looking for</div>
      <div>
        <Link key="Home" href="/">
          <Button variant="secondary" className='border'>
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}