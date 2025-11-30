import { useEffect, useState } from 'react'
import api from '../api/client'

export default function Feed() {
  const [posts, setPosts] = useState([])
  const [body, setBody] = useState('')

  useEffect(() => {
    api.get('/social/follows/feed/').then(res => setPosts(res.data))
  }, [])

  async function createPost() {
    if (!body.trim()) return
    const { data } = await api.post('/social/posts/', { body })
    setPosts(ps => [data, ...ps])
    setBody('')
  }

  async function like(id) {
    await api.post(`/social/posts/${id}/like/`)
    setPosts(ps => ps.map(p => p.id===id ? { ...p, like_count: p.like_count+1 } : p))
  }

  async function unlike(id) {
    await api.post(`/social/posts/${id}/unlike/`)
    setPosts(ps => ps.map(p => p.id===id ? { ...p, like_count: Math.max(0,p.like_count-1) } : p))
  }

  return (
    <div className="space-y-4">
      <div className="bg-white border rounded p-4">
        <form className="flex gap-2" onSubmit={e => { e.preventDefault(); createPost() }}>
          <input className="flex-1 border rounded p-2" placeholder="What's on your mind?"
            value={body} onChange={e=>setBody(e.target.value)} />
          <button className="bg-black text-white px-3 rounded">Post</button>
        </form>
      </div>
      {posts.map(p => (
        <div key={p.id} className="bg-white border rounded p-4">
          <div className="font-semibold">@{p.author_username}</div>
          <p className="my-2">{p.body}</p>
          <div className="flex items-center gap-3 text-sm">
            <button onClick={() => like(p.id)}>Like ({p.like_count})</button>
            <button onClick={() => unlike(p.id)}>Unlike</button>
          </div>
        </div>
      ))}
    </div>
  )
}