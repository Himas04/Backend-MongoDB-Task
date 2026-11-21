import Counter from '../components/Counter.jsx'
import Timer from '../components/Timer.jsx'

export default function Home() {
  return (
    <main>
      <h2>Home</h2>
      <p>This page shows the state and useEffect examples.</p>
      <Counter />
      <Timer />
    </main>
  )
}
