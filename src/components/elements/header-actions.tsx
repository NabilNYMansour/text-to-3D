"use client";

import { usePathname } from 'next/navigation';
import LinkButton from '../buttons/link-button';
import { Box, CirclePlus, Home } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { DotsLoader } from './loader';
import { useSidebar } from '../ui/sidebar';

const HeaderActions = () => {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();
  const sidebar = useSidebar();

  if (isLoaded) {
    return pathname.split("/")[1] !== "project" ?
      <LinkButton href="/project" variant="outline" className="cu-shadow select-none" onClick={() => sidebar.setOpen(false)}>
        <CirclePlus />New Project
      </LinkButton> :
      user ?
        <LinkButton href="/my-projects" variant="outline" className="cu-shadow select-none">
          <Box />My Projects
        </LinkButton> :
        <LinkButton href="/" variant="outline" className="cu-shadow select-none">
          <Home />Home
        </LinkButton>
  } else {
    return <div className='w-16'><DotsLoader /></div>;
  }
};

export default HeaderActions;