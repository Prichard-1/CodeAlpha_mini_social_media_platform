import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import api from '../api/client'

export default function Register() {
  const nav = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  async function submit(e) {
    e.preventDefault()
    try {
      await api.post('/users/register/', { username, password })
      const { data } = await api.post('/users/token/', { username, password })
      localStorage.setItem('access', data.access)
      localStorage.setItem('refresh', data.refresh)
      nav('/', { replace: true })
    } catch (err) {
      alert('Registration failed')
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-10">
      <h1 className="text-xl font-semibold mb-3">Create account</h1>
      <form onSubmit={submit} className="bg-white border rounded p-4 space-y-3">
        <input className="w-full border rounded p-2" placeholder="Username"
          value={username} onChange={e=>setUsername(e.target.value)} />
        <input className="w-full border rounded p-2" type="password" placeholder="Password"
          value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="w-full bg-black text-white rounded p-2">Register</button>
      </form>
    </div>
  )
}