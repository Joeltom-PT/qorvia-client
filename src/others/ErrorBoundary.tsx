import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-blue-900 p-6">
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg border border-red-300">
          <h1 className="text-3xl font-bold text-red-800 mb-4">Something went wrong.</h1>
          <p className="text-red-600 mb-6">We are experiencing technical difficulties. Please try again later.</p>
          <button 
            onClick={this.handleReload} 
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            Reload Page
          </button>
        </div>
      </div>
      )
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
