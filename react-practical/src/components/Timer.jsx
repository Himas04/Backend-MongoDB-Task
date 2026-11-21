import { useEffect, useState } from 'react'

export default function Timer() {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setSeconds((value) => value + 1)
    }, 1000)

    return () => clearInterval(id)
  }, [])

  return (
    <section>
      <h3>useEffect Example</h3>
      <p>Timer seconds: {seconds}</p>
    </section>
  )
}
