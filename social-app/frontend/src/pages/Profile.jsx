import { useEffect, useState } from 'react'
import api from '../api/client'

export default function Profile() {
  const [profile, setProfile] = useState(null)
  const [bio, setBio] = useState('')

  useEffect(() => {
    api.get('/users/me/').then(res => {
      setProfile(res.data)
      setBio(res.data.bio || '')
    })
  }, [])

  async function save() {
    const form = new FormData()
    form.append('bio', bio)
    const input = document.getElementById('avatar')
    if (input?.files?.[0]) form.append('avatar', input.files[0])
    const { data } = await api.put('/users/me/', form, { headers: { 'Content-Type': 'multipart/form-data' } })
    setProfile(data)
  }

  if (!profile) return <div>Loading...</div>

  return (
    <div className="bg-white border rounded p-4 space-y-3">
      <div className="flex items-center gap-3">
        {profile.avatar ? (
          <img src={profile.avatar} alt="avatar" className="w-16 h-16 rounded-full"/>
        ) : (
          <div className="w-16 h-16 rounded-full bg-gray-200"/>
        )}
        <div>
          <div className="font-semibold">@{profile.username}</div>
          <div className="text-sm text-gray-600">Bio: {profile.bio || '—'}</div>
        </div>
      </div>
      <textarea className="w-full border rounded p-2" value={bio} onChange={e=>setBio(e.target.value)} placeholder="Update your bio"/>
      <input id="avatar" type="file" accept="image/*" />
      <button className="bg-black text-white px-3 py-2 rounded" onClick={save}>Save</button>
    </div>
  )
}