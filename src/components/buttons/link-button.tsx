import Link from 'next/link';
import React from 'react';
import { Button, ButtonProps } from '../ui/button';

interface LinkButtonProps extends ButtonProps {
  href: string;
  prefetch?: boolean;
}

const LinkButton: React.FC<LinkButtonProps> = ({ href, prefetch, ...props }) => {
  return (
    <a href={href}>
      <Button {...props}>
        {props.children}
      </Button>
    </a>
  );
};

export default LinkButton;