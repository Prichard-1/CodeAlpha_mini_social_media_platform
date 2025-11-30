import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import api from '../api/client'

export default function Login() {
  const nav = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  async function submit(e) {
    e.preventDefault()
    try {
      const { data } = await api.post('/users/token/', { username, password })
      localStorage.setItem('access', data.access)
      localStorage.setItem('refresh', data.refresh)
      nav('/', { replace: true })
    } catch (err) {
      alert('Login failed')
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-10">
      <h1 className="text-xl font-semibold mb-3">Login</h1>
      <form onSubmit={submit} className="bg-white border rounded p-4 space-y-3">
        <input className="w-full border rounded p-2" placeholder="Username"
          value={username} onChange={e=>setUsername(e.target.value)} />
        <input className="w-full border rounded p-2" type="password" placeholder="Password"
          value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="w-full bg-black text-white rounded p-2">Login</button>
      </form>
    </div>
  )
}