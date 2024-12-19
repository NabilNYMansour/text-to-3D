import React from 'react';
import { Button, ButtonProps } from '../ui/button';

interface LinkButtonProps extends ButtonProps {
  href: string;
}

const LinkButton: React.FC<LinkButtonProps> = ({ href, ...props }) => {
  return (
    <a href={href}>
      <Button {...props}>
        {props.children}
      </Button>
    </a>
  );
};

export default LinkButton;