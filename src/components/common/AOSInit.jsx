'use client';

import { useEffect } from 'react';

export default function AOSInit() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Dynamically import AOS
      import('aos').then((AOS) => {
        AOS.default.init({
          duration: 1000,
          once: false,
        });
      });
    }
  }, []);

  return null;
}