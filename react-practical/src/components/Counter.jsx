import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  return (
    <section>
      <h3>State Example</h3>
      <p>Count: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Add 1
      </button>
    </section>
  )
}
