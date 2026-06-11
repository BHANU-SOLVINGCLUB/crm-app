import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  message?: string
}

export default class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, message: error.message }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('CRM app error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
          <div className="max-w-md rounded-2xl border border-white/10 bg-white/10 p-6 text-center">
            <h1 className="text-xl font-bold">Something went wrong</h1>
            <p className="mt-2 text-sm text-theme-muted">Please refresh the page and try again.</p>
            {this.state.message && (
              <p className="mt-3 rounded-xl bg-black/20 px-3 py-2 text-left text-xs text-slate-200">
                {this.state.message}
              </p>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
