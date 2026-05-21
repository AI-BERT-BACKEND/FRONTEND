import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '40px',
          textAlign: 'center',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          background: '#0F0E0F',
          color: '#fff',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>Ups! Algo salió mal.</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '24px' }}>
            La aplicación ha encontrado un error inesperado.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(90deg, #FF5B2E, #C4107A)',
              border: 'none',
              borderRadius: '12px',
              color: '#fff',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            Recargar aplicación
          </button>
          {process.env.NODE_ENV === 'development' && (
            <pre style={{
              marginTop: '24px',
              padding: '16px',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '8px',
              textAlign: 'left',
              maxWidth: '80%',
              overflow: 'auto',
              fontSize: '12px',
              color: '#F7306D'
            }}>
              {this.state.error?.toString()}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
