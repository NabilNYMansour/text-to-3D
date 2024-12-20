import { LoaderCircle } from "lucide-react";

export default function Loader({ size = 64, tailwind = "" }) {
  return <div className="flex-1 cu-flex-center">
    <LoaderCircle className={"animate-spin " + tailwind} size={size} />
  </div>;
}

export const FullPageLoader = () => <Loader tailwind="dark:text-primary" />;

export const DotsLoader = () => {
  return <div className='flex justify-center items-center gap-1.5'>
    <div className='w-1 h-1 bg-foreground rounded-full animate-bounce [animation-delay:-0.3s]' />
    <div className='w-1 h-1 bg-foreground rounded-full animate-bounce [animation-delay:-0.15s]' />
    <div className='w-1 h-1 bg-foreground rounded-full animate-bounce' />
  </div>
}
