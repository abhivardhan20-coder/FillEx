import type { AnchorHTMLAttributes } from 'react';

type AppLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  href: string;
};

/**
 * Uses native document navigation so every route remains usable even when the
 * optional client-side router cannot initialize in the hosted environment.
 */
export function AppLink({ href, children, ...props }: AppLinkProps) {
  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
}
