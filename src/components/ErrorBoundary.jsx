import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: "",
      componentStack: ""
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error, info) {
    console.error("❌ Runtime Error:", error);
    console.error("📍 Component Stack:", info.componentStack);

    this.setState({
      componentStack: info.componentStack
    });

    // 🔔 Optional: send error to backend / Sentry
    // fetch("/log-error", { method: "POST", body: JSON.stringify({ error, info }) })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, fontFamily: "system-ui" }}>
          <h2 style={{ color: "red" }}>Something went wrong</h2>

          <p><strong>Reason:</strong></p>
          <pre style={{ color: "#b91c1c" }}>
            {this.state.errorMessage}
          </pre>

          <p><strong>Where it happened:</strong></p>
          <pre style={{ fontSize: 12, whiteSpace: "pre-wrap" }}>
            {this.state.componentStack}
          </pre>

          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: 12,
              padding: "8px 14px",
              background: "#2563eb",
              color: "white",
              borderRadius: 6,
              border: "none"
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
