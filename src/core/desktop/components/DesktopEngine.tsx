import { DesktopScreen } from "./DesktopScreen";

interface Props {
  initialWindow?: string | null;
}

export function DesktopEngine({
  initialWindow = null,
}: Props) {
  return (
    <DesktopScreen
      initialWindow={initialWindow}
    />
  );
}
