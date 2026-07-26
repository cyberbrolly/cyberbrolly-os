interface Props {
  selected: number;
  onSelect: (index: number) => void;
}

const options = ["YES", "SKIP"];

export function QuestionScreen({
  selected,
  onSelect,
}: Props) {
  return (
    <div className="flex h-screen items-center justify-center bg-black">
      <div className="font-mono text-green-400">

        <h1 className="mb-3 text-3xl">
          CyberBrolly DevOS v16
        </h1>

        <p className="mb-8">
          System Ready.
        </p>

        <p className="mb-8">
          &gt; Would you like to know who built this system?
        </p>

        {options.map((option, index) => (
          <div
            key={option}
            onClick={() => onSelect(index)}
            className="cursor-pointer text-2xl"
          >
            {selected === index ? "▶ " : "  "}
            {option}
          </div>
        ))}

      </div>
    </div>
  );
}