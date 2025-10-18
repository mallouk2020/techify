"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useRef } from "react";

// تم تعطيل timeout الجلسة - الجلسة ستستمر حتى يسجل المستخدم الخروج يدويا
// أو حتى انتهاء صلاحية JWT بعد سنة واحدة
// SESSION_TIMEOUT: 365 days
const SESSION_TIMEOUT = 365 * 24 * 60 * 60 * 1000; // 365 days in milliseconds

export function useSessionTimeout() {
  const { data: session, status } = useSession();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    if (status === "authenticated" && session) {
      const startTimeout = () => {
        // Clear existing timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        // Set new timeout - تم تمديده إلى سنة واحدة
        timeoutRef.current = setTimeout(() => {
          signOut({ 
            callbackUrl: "/login?expired=true",
            redirect: true 
          });
        }, SESSION_TIMEOUT);
      };

      // Start the initial timeout
      startTimeout();

      // Reset timeout on user activity
      const resetTimeout = () => {
        startTimeout();
      };

      // Listen for user activity - لكن الـ timeout طويل جداً لن يتم الوصول إليه عملياً
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
      events.forEach(event => {
        document.addEventListener(event, resetTimeout, true);
      });

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        events.forEach(event => {
          document.removeEventListener(event, resetTimeout, true);
        });
      };
    }
  }, [session, status]);
}
