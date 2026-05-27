import React from 'react';

export class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error(error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <section>
          <div className="full-height">
            <h1>Something went wrong</h1>
            <p>{this.state.error?.message}</p>
          </div>
        </section>
      );
    }
    return this.props.children;
  }
}
