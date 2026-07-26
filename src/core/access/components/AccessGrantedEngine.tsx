'use client';

import { AuthenticationController } from "./AuthenticationController";

interface Props {
  onComplete: () => void;
}

export function AccessGrantedEngine({
  onComplete,
}: Props) {
  return (
    <AuthenticationController
      onComplete={onComplete}
    />
  );
}