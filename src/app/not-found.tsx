import { Button } from '@/components/ui/button';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="p-10 cu-flex-center flex-col gap-4">
      <div className='text-9xl'>404</div>
      <div className='text-4xl'>¯\_(ツ)_/¯</div>
      <div className='text-muted-foreground text-center'>I don&apos;t know what you&apos;re looking for</div>
      <div>
        <Link key="Home" href="/">
          <Button variant="secondary" className='font-bold border'>
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}