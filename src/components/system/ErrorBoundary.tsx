import React from 'react';

interface State { hasError: boolean; error?: Error }
export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError(error: Error): State { return { hasError: true, error }; }
  componentDidCatch(error: Error, info: any){
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary atrapó un error', error, info);
  }
  render(){
    if(this.state.hasError){
      return (
        <div className="p-6 text-sm text-red-600 dark:text-red-400 space-y-3">
          <h2 className="font-semibold">Ha ocurrido un error.</h2>
          <pre className="whitespace-pre-wrap text-xs bg-red-50 dark:bg-red-950/30 p-3 rounded border border-red-200 dark:border-red-800 max-h-60 overflow-auto">
            {this.state.error?.message}
          </pre>
          <button
            onClick={() => location.reload()}
            className="px-3 py-1 rounded bg-accent text-accent-contrast text-xs hover:brightness-110 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Recargar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
