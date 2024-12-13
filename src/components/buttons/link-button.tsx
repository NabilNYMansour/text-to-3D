import Link from 'next/link';
import React from 'react';
import { Button, ButtonProps } from '../ui/button';

interface LinkButtonProps extends ButtonProps {
  href: string;
  prefetch?: boolean;
}

const LinkButton: React.FC<LinkButtonProps> = ({ href, prefetch, ...props }) => {
  return (
    <Link href={href}>
      <Button {...props}>
        {props.children}
      </Button>
    </Link>
  );
};

export default LinkButton;