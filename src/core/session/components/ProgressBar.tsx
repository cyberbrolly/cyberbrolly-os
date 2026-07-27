interface Props {
  progress: number;
}

export function ProgressBar({
  progress,
}: Props) {
  const totalBlocks = 20;

  const filled = Math.round(
    (progress / 100) * totalBlocks
  );

  return (
    <div className="font-mono text-green-400">
      [
      {"█".repeat(filled)}
      {"░".repeat(totalBlocks - filled)}
      ] {progress}%
    </div>
  );
}