'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ReactNode, MouseEvent } from 'react';

interface PrefetchLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  prefetch?: boolean;
  replace?: boolean;
  scroll?: boolean;
}

export default function PrefetchLink({
  href,
  children,
  className,
  prefetch = true,
  replace = false,
  scroll = true,
  ...props
}: PrefetchLinkProps) {
  const router = useRouter();

  const handleMouseEnter = () => {
    // Prefetch agressivo no hover
    if (prefetch) {
      router.prefetch(href);
    }
  };

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Navegação otimizada
    e.preventDefault();

    if (replace) {
      router.replace(href, { scroll });
    } else {
      router.push(href, { scroll });
    }
  };

  return (
    <Link
      href={href}
      className={className}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      prefetch={prefetch}
      {...props}
    >
      {children}
    </Link>
  );
}
