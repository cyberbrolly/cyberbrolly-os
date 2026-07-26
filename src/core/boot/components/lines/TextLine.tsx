'use client';

interface Props {
  text: string;
}

export function TextLine({ text }: Props) {
  return <div>{text}</div>;
}