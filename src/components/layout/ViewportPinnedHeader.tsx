"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";

const subscribe = () => () => {};
const getPortalRoot = () => document.getElementById("header-portal-root");
const getServerPortalRoot = () => null;

/** Portals header controls outside clipped page sections. The wrappers use
 * display: contents so each fixed control can blend directly with the page.
 */
export function ViewportPinnedHeader({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const portalRoot = useSyncExternalStore(subscribe, getPortalRoot, getServerPortalRoot);

  if (!portalRoot) return null;

  return createPortal(
    <div className={className}>
      {children}
    </div>,
    portalRoot,
  );
}
