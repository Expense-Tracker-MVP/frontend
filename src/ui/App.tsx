import { useState } from 'react'
import reactLogo from './assets/react.svg'

import './App.css'

/**
 * Renders the application UI: a linked React logo, a "Vite + React" heading, an interactive counter button, and instructional text.
 *
 * The counter button displays the current count and increments it when clicked.
 *
 * @returns The rendered JSX element for the application UI
 */
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App