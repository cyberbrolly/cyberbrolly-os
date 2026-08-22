import { OSEngine } from "@/core/OS/OSEngine";
import { ErrorBoundary } from "@/core/shared/components/ErrorBoundary";

export default function Home() {
  return (
    <ErrorBoundary>
      <OSEngine />
    </ErrorBoundary>
  );
}
