"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { useSound } from "../../shared/hooks/useSound";
import { DesktopScreen } from "./DesktopScreen";
import { MobileDesktopScreen } from "./MobileDesktopScreen";
import { useIsMobile } from "../../shared/hooks/useIsMobile";

export interface OpenWindow {
  id: string;
  z: number;
}

interface Props {
  initialWindow?: string | null;
}

export function DesktopEngine({
  initialWindow = null,
}: Props) {
  const isMobile = useIsMobile();
  const [openWindows, setOpenWindows] = useState<OpenWindow[]>(() =>
    initialWindow ? [{ id: initialWindow, z: 999 }] : [],
  );
  const [topZ, setTopZ] = useState(initialWindow ? 1000 : 1);
  const { play } = useSound();

  useEffect(() => {
    play("login", 0.3);
  }, [play]);

  const openApp = useCallback(
    (appId: string) => {
      setOpenWindows((windows) => {
        const existingWindow = windows.find((window) => window.id === appId);

        if (existingWindow) {
          return windows.map((window) =>
            window.id === appId ? { ...window, z: topZ } : window,
          );
        }

        return [...windows, { id: appId, z: topZ }];
      });
      setTopZ((z) => z + 1);
    },
    [topZ],
  );

  const focusWindow = useCallback(
    (appId: string) => {
      setOpenWindows((windows) =>
        windows.map((window) =>
          window.id === appId ? { ...window, z: topZ } : window,
        ),
      );
      setTopZ((z) => z + 1);
    },
    [topZ],
  );

  const closeWindow = useCallback((appId: string) => {
    setOpenWindows((windows) =>
      windows.filter((window) => window.id !== appId),
    );
  }, []);

  const activeWindow = useMemo(
    () =>
      openWindows.reduce<OpenWindow | null>(
        (active, window) => (!active || window.z > active.z ? window : active),
        null,
      ),
    [openWindows],
  );

  return isMobile ? (
    <MobileDesktopScreen
      openWindows={openWindows}
      activeWindow={activeWindow}
      onOpenApp={openApp}
      onCloseWindow={closeWindow}
    />
  ) : (
    <DesktopScreen
      openWindows={openWindows}
      onOpenApp={openApp}
      onFocusWindow={focusWindow}
      onCloseWindow={closeWindow}
    />
  );
}
