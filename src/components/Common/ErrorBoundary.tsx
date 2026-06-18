import { Component, type ErrorInfo, type ReactNode } from "react";
import * as Sentry from "@sentry/react";
import Button from "../UI/Button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.PROD) {
      Sentry.captureException(error, { extra: { componentStack: info.componentStack } });
    } else {
      console.error(error, info.componentStack);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-emerald px-4">
          <div className="max-w-md text-center space-y-4">
            <h1 className="font-display text-2xl text-ivory">Something went wrong</h1>
            <p className="text-ivory-muted text-sm">
              The game hit an unexpected error. Refresh the page or return to the menu.
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="primary" onClick={() => window.location.reload()}>
                Refresh
              </Button>
              <Button to="/" variant="secondary">
                Back to menu
              </Button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
