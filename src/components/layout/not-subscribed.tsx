import Link from "next/link"
import { Button } from "../ui/button"
import { CircleDollarSign } from "lucide-react"

export const NotSubscribed = ({ title }: { title: string }) => {
  return <div className='cu-flex-center flex-col gap-2 p-2 h-full text-center'>
    <h2 className="text-lg font-semibold">{title}</h2>
    <p className="text-sm text-muted-foreground">You need to be subscribed to access this feature</p>
    <Link href="/pricing">
      <Button className='text-primary cu-shadow' variant="outline">
        <CircleDollarSign /> See Pricing
      </Button>
    </Link>
  </div>
}

export default NotSubscribed;