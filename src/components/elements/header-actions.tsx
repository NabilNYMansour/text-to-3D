"use client";

import { usePathname } from 'next/navigation';
import LinkButton from '../buttons/link-button';
import { Box, CirclePlus, Home } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { DotsLoader } from './loader';
import { useSidebar } from '../ui/sidebar';
import { useMemo } from 'react';
import HomeButton from '../buttons/home-button';
import ClerkUserButton from '../buttons/clerk-user-button';

const GoToAction = () => {
  const pathname = usePathname();
  const sidebar = useSidebar();
  const { user, isLoaded } = useUser();
  const pathnameSplit = useMemo(() => pathname.split("/"), [pathname]);

  if (isLoaded) {
    return pathnameSplit[1] !== "project" ?
      <LinkButton href="/project" variant="outline" className="cu-shadow select-none"
        onClick={() => sidebar.setOpen(false)}
      >
        <CirclePlus />New Project
      </LinkButton> :
      user ?
        <LinkButton href="/my-projects" variant="outline" className="cu-shadow select-none"
          onClick={() => sidebar.setOpen(true)}
        >
          <Box />My Projects
        </LinkButton> :
        <LinkButton href="/" variant="outline" className="cu-shadow select-none">
          <Home />Home
        </LinkButton>
  } else {
    return <div className='w-16'><DotsLoader /></div>;
  }
};

const HeaderActions = () => {
  const { user } = useUser();

  return <div className="flex-1 flex justify-end items-center gap-2">
    {user && <HomeButton />}
    <GoToAction />
    <ClerkUserButton />
  </div>
};

export default HeaderActions;