'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirects the user to '/signin' upon component mount
    router.push('/signin');
  }, [router]); // Dependency array with router to ensure effect runs once

  return null; // Render nothing while redirecting
}
