interface Props {
  text: string;
}

export function LoadingTask({
  text,
}: Props) {
  const dots = ".".repeat(
    Math.max(1, 40 - text.length)
  );

  return (
    <div className="font-mono text-green-400">
      {text}
      {dots}
      <span className="ml-2 text-green-300">
        OK
      </span>
    </div>
  );
}