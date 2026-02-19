"use client";

import { useSyncExternalStore } from "react";

/**
 * Hook to check if component is mounted (client-side)
 * This avoids hydration mismatch issues
 */
function subscribe() {
  return () => {};
}

function getSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

export function useMounted() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
