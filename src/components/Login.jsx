import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Login({ onClose }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError('Email o contraseña incorrectos'); setLoading(false); return }
    onClose()
  }

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <div style={styles.title}>Acceso administrador</div>
        <form onSubmit={handleLogin}>
          <div style={styles.group}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={styles.input}
              placeholder="tu@email.com"
              required
            />
          </div>
          <div style={styles.group}>
            <label style={styles.label}>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={styles.input}
              placeholder="••••••••"
              required
            />
          </div>
          {error && <div style={styles.error}>{error}</div>}
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button type="submit" disabled={loading} style={styles.btnPrimary}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
            <button type="button" onClick={onClose} style={styles.btnSecondary}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  )
}

const styles = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 },
  modal: { background: 'white', borderRadius: 12, padding: 32, width: '100%', maxWidth: 400, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' },
  title: { fontFamily: "'Playfair Display', serif", fontSize: 22, color: '#0f2744', marginBottom: 24, fontWeight: 700 },
  group: { marginBottom: 16 },
  label: { display: 'block', fontSize: 12, fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 },
  input: { width: '100%', padding: '10px 14px', borderRadius: 8, border: '1.5px solid #ddd', fontSize: 14, fontFamily: "'Source Sans 3', sans-serif", boxSizing: 'border-box' },
  error: { background: '#fde8e8', color: '#c0392b', padding: '8px 12px', borderRadius: 6, fontSize: 13, marginBottom: 12 },
  btnPrimary: { flex: 1, padding: '10px 20px', background: '#0f2744', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 14, fontFamily: "'Source Sans 3', sans-serif" },
  btnSecondary: { padding: '10px 16px', background: '#f0f0f0', color: '#333', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 14, fontFamily: "'Source Sans 3', sans-serif" },
}
