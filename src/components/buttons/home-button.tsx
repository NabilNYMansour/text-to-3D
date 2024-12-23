import Link from "next/link";
import { Button } from "../ui/button";
import { Home } from "lucide-react";

const HomeButton = () => {
  return <Link href="/" passHref>
    <Button variant="ghost" size="icon">
      <Home />
    </Button>
  </Link>
};

export default HomeButton;