import { DesktopScreen } from "./DesktopScreen";
import { MobileDesktopScreen } from "./MobileDesktopScreen";
import { useIsMobile } from "../../shared/hooks/useIsMobile";

interface Props {
  initialWindow?: string | null;
}

export function DesktopEngine({
  initialWindow = null,
}: Props) {
  const isMobile = useIsMobile();
  return isMobile ? (
    <MobileDesktopScreen initialWindow={initialWindow} />
  ) : (
    <DesktopScreen
      initialWindow={initialWindow}
    />
  );
}
