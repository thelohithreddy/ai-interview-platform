import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 40,
          textAlign: 'center',
          backgroundColor: 'var(--app-bg)',
        }}>
          <p style={{ fontSize: 48, margin: '0 0 16px' }}>⚠</p>
          <h1 style={{ color: 'var(--text-primary)', fontSize: 22, margin: '0 0 8px' }}>
            Something went wrong
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, maxWidth: 400, marginBottom: 24 }}>
            An unexpected error occurred. Try refreshing the page.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: 'var(--primary)',
              color: '#fff',
              border: 'none',
              padding: '10px 24px',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Refresh page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
