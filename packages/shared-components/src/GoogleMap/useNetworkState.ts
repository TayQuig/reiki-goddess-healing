import { useState, useEffect, useCallback } from "react";
import type { NetworkState } from "./GoogleMapEmbed.types";

/**
 * Custom hook for network state monitoring
 *
 * Features:
 * - Monitors online/offline status
 * - Detects connection recovery
 * - Provides connection type information when available
 * - Optimized for performance with proper cleanup
 */
export const useNetworkState = (): NetworkState => {
  const [networkState, setNetworkState] = useState<NetworkState>({
    isOnline: navigator.onLine,
    connectionType: undefined,
    wasOffline: false,
  });

  const updateNetworkState = useCallback(() => {
    const isOnline = navigator.onLine;
    const wasOffline = !isOnline && networkState.isOnline;

    // Get connection type if available (experimental feature)
    let connectionType: string | undefined;
    if ("connection" in navigator) {
      const connection = (navigator as any).connection;
      connectionType = connection?.effectiveType || connection?.type;
    }

    setNetworkState((prevState) => ({
      isOnline,
      connectionType,
      wasOffline: wasOffline || (isOnline && prevState.wasOffline),
    }));
  }, [networkState.isOnline]);

  const handleOnline = useCallback(() => {
    setNetworkState((prevState) => ({
      ...prevState,
      isOnline: true,
      wasOffline: !prevState.isOnline, // Mark as recovered if was offline
    }));
  }, []);

  const handleOffline = useCallback(() => {
    setNetworkState((prevState) => ({
      ...prevState,
      isOnline: false,
      wasOffline: false, // Reset recovery flag when going offline
    }));
  }, []);

  const handleConnectionChange = useCallback(() => {
    updateNetworkState();
  }, [updateNetworkState]);

  useEffect(() => {
    // Add event listeners for online/offline events
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Add connection change listener if available
    if ("connection" in navigator) {
      const connection = (navigator as any).connection;
      connection?.addEventListener("change", handleConnectionChange);
    }

    // Initial state update
    updateNetworkState();

    // Cleanup event listeners
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);

      if ("connection" in navigator) {
        const connection = (navigator as any).connection;
        connection?.removeEventListener("change", handleConnectionChange);
      }
    };
  }, [handleOnline, handleOffline, handleConnectionChange, updateNetworkState]);

  return networkState;
};
