'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { initOrderAttribution } from '@/lib/orderAttribution';

export function OrderAttributionTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    initOrderAttribution();
  }, [pathname, searchParams]);

  return null;
}
