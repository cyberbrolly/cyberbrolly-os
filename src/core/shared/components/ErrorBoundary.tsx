'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
  componentStack: string;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null, componentStack: '' };

  static getDerivedStateFromError(error: Error): State {
    return { error, componentStack: '' };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, componentStack: errorInfo.componentStack ?? '' });
    console.error('DevOS runtime error', error, errorInfo);
  }

  render() {
    const { error, componentStack } = this.state;

    if (!error) return this.props.children;

    return (
      <main className="flex min-h-dvh w-full items-start justify-center overflow-auto bg-black px-6 py-12 font-mono text-green-400 md:min-h-screen">
        <section className="w-full max-w-3xl border border-green-500/50 bg-black p-6 shadow-[0_0_24px_rgba(34,197,94,0.12)]">
          <h1 className="text-lg font-bold uppercase tracking-[0.2em] text-green-300">DevOS Runtime Error</h1>
          <p className="mt-6 break-words whitespace-pre-wrap text-sm leading-6 text-red-300">{error.message}</p>
          {error.stack ? (
            <pre className="mt-6 overflow-x-auto whitespace-pre-wrap break-words border-t border-green-500/20 pt-4 text-xs leading-5 text-green-500/80">{error.stack}</pre>
          ) : null}
          {componentStack ? (
            <pre className="mt-6 overflow-x-auto whitespace-pre-wrap break-words border-t border-green-500/20 pt-4 text-xs leading-5 text-green-500/60">{componentStack}</pre>
          ) : null}
        </section>
      </main>
    );
  }
}
