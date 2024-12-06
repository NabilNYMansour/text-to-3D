import Link from 'next/link';
import React from 'react';
import { Button, ButtonProps } from '../ui/button';

interface LinkButtonProps extends ButtonProps {
  href: string;
}

const LinkButton: React.FC<LinkButtonProps> = ({ href, children, className, ...props }) => {
  return (
    <Link href={href} passHref>
      <Button className={className} {...props}>
        {children}
      </Button>
    </Link>
  );
};

export default LinkButton;