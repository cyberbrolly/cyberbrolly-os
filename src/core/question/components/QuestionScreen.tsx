interface Props {
  selected: number;
  onSelect: (index: number) => void;
  onComplete: (answer: "yes" | "skip") => void;
}

const options = ["YES", "SKIP"];

export function QuestionScreen({
  selected,
  onSelect,
  onComplete,
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
          <button
            type="button"
            key={option}
            onClick={() => {
              onSelect(index);
              onComplete(index === 0 ? "yes" : "skip");
            }}
            className="block min-h-11 min-w-44 touch-manipulation cursor-pointer text-left text-2xl"
          >
            {selected === index ? "▶ " : "  "}
            {option}
          </button>
        ))}

      </div>
    </div>
  );
}
