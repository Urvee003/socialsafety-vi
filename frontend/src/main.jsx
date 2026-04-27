import 'leaflet/dist/leaflet.css';
import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'


class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: '40px', fontFamily: 'monospace', color: '#ef4444', background: '#0f172a', minHeight: '100vh' }}>
          <h2>⚠️ App crashed — check console</h2>
          <pre style={{ marginTop: '16px', whiteSpace: 'pre-wrap' }}>{this.state.error?.message}</pre>
          <pre style={{ marginTop: '8px', fontSize: '0.8rem', color: '#94a3b8' }}>{this.state.error?.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
