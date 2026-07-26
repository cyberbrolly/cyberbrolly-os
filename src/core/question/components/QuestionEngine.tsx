useEffect(() => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowUp") {
      setSelected(0);
    }

    if (event.key === "ArrowDown") {
      setSelected(1);
    }

    if (event.key === "Enter") {
      onComplete(selected === 0 ? "yes" : "skip");
    }
  };

  window.addEventListener("keydown", handleKeyDown);

  return () => {
    window.removeEventListener("keydown", handleKeyDown);
  };
}, [selected, onComplete]);