// "use client";

import { usePathname } from 'next/navigation';
import LinkButton from '../buttons/link-button';
import { CirclePlus, Home } from 'lucide-react';

const HeaderActions = () => {
  // const pathname = usePathname();
  return <LinkButton href="/project" variant="outline" className="cu-shadow">
    <CirclePlus />New Project
  </LinkButton>
};

export default HeaderActions;