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
    <div className="flex h-dvh items-center justify-center overflow-x-hidden bg-black px-4 md:h-screen">
      <div className="min-w-0 max-w-full font-mono text-green-400">

        <h1 className="mb-4 text-3xl leading-tight md:mb-3 md:text-3xl md:leading-normal">
          CyberBrolly DevOS v16
        </h1>

        <p className="mb-9 text-lg leading-7 md:mb-8 md:text-base md:leading-normal">
          System Ready.
        </p>

        <p className="mb-9 text-lg leading-7 md:mb-8 md:text-base md:leading-normal">
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
