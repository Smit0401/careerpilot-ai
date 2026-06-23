import { Component } from "react"

export default class ErrorBoundary extends Component {
    state = { hasError: false }

    static getDerivedStateFromError() {
        return { hasError: true }
    }

    render() {
        if (this.state.hasError) {
            return (
                <main className="center-state">
                    <div className="state-card">
                        <p className="eyebrow">Unexpected error</p>
                        <h1>This page could not be displayed.</h1>
                        <p>Refresh the page to try again. Your saved reports are unaffected.</p>
                        <button className="button primary-button" onClick={() => window.location.reload()}>
                            Refresh page
                        </button>
                    </div>
                </main>
            )
        }

        return this.props.children
    }
}
