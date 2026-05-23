import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import Login from './components/Login'
import Lista from './components/Lista'
import Formulario from './components/Formulario'

const TEMAS = [
  'Votaciones', 'Urgencias', 'Comisiones', 'Sesiones', 'Indicaciones',
  'Tramitación legislativa', 'Fiscalización', 'Acusación constitucional',
  'Acuerdos de Comités', 'Homenajes', 'Otros'
]

const TEMA_COLORS = {
  'Votaciones': '#1a3a5c',
  'Urgencias': '#7b2d2d',
  'Comisiones': '#1a5c3a',
  'Sesiones': '#4a3a7c',
  'Indicaciones': '#7c5a1a',
  'Tramitación legislativa': '#1a5c5c',
  'Fiscalización': '#5c1a4a',
  'Acusación constitucional': '#3a3a3a',
  'Acuerdos de Comités': '#2d4a7c',
  'Homenajes': '#8b5e3c',
  'Otros': '#5a5a5a',
}

export default function App() {
  const [session, setSession] = useState(null)
  const [consultas, setConsultas] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtroTema, setFiltroTema] = useState('Todos')
  const [view, setView] = useState('lista') // lista | nueva | editar
  const [editando, setEditando] = useState(null)
  const [showLogin, setShowLogin] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    fetchConsultas()
  }, [])

  async function fetchConsultas() {
    setLoading(true)
    const { data, error } = await supabase
      .from('consultas')
      .select('*')
      .order('created_at', { ascending: true })
    if (!error) setConsultas(data || [])
    setLoading(false)
  }

  function showToast(msg, type = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  async function handleGuardar(form) {
    if (editando) {
      const { error } = await supabase
        .from('consultas')
        .update({ temas: form.temas, pregunta: form.pregunta, respuesta: form.respuesta, fecha: form.fecha })
        .eq('id', editando.id)
      if (error) { showToast('Error al guardar', 'error'); return }
      showToast('Consulta actualizada')
    } else {
      const { error } = await supabase
        .from('consultas')
        .insert([{ temas: form.temas, pregunta: form.pregunta, respuesta: form.respuesta, fecha: form.fecha }])
      if (error) { showToast('Error al guardar', 'error'); return }
      showToast('Consulta guardada')
    }
    setView('lista')
    setEditando(null)
    fetchConsultas()
  }

  async function handleEliminar(id) {
    if (!confirm('¿Eliminar esta consulta?')) return
    const { error } = await supabase.from('consultas').delete().eq('id', id)
    if (!error) { showToast('Consulta eliminada'); fetchConsultas() }
  }

  function handleEditar(consulta) {
    setEditando(consulta)
    setView('editar')
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setShowLogin(false)
  }

  const consultasFiltradas = filtroTema === 'Todos'
    ? consultas
    : consultas.filter(c => (c.temas || []).includes(filtroTema))

  return (
    <div style={styles.root}>
      {/* HEADER */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div>
            <div style={styles.eyebrow}>República de Chile</div>
            <h1 style={styles.title}>Memoria del Reglamento</h1>
            <div style={styles.subtitle}>Cámara de Diputadas y Diputados · Reglamento 2023</div>
          </div>
          <div style={styles.headerRight}>
            <div style={styles.countBadge}>{consultas.length} consulta{consultas.length !== 1 ? 's' : ''}</div>
            {session ? (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button onClick={() => { setEditando(null); setView('nueva') }} style={styles.btnPrimary}>+ Nueva</button>
                <button onClick={handleLogout} style={styles.btnSecondary}>Salir</button>
              </div>
            ) : (
              <button onClick={() => setShowLogin(true)} style={styles.btnSecondary}>Admin</button>
            )}
          </div>
        </div>
      </header>

      {/* TOAST */}
      {toast && (
        <div style={{ ...styles.toast, background: toast.type === 'error' ? '#fde8e8' : '#d4edda', color: toast.type === 'error' ? '#c0392b' : '#155724' }}>
          {toast.type === 'error' ? '❌' : '✅'} {toast.msg}
        </div>
      )}

      {/* LOGIN MODAL */}
      {showLogin && !session && (
        <Login onClose={() => setShowLogin(false)} />
      )}

      <main style={styles.main}>
        {(view === 'nueva' || view === 'editar') && session ? (
          <Formulario
            temas={TEMAS}
            temaColors={TEMA_COLORS}
            inicial={editando}
            onGuardar={handleGuardar}
            onCancelar={() => { setView('lista'); setEditando(null) }}
          />
        ) : (
          <Lista
            consultas={consultasFiltradas}
            allConsultas={consultas}
            temas={TEMAS}
            temaColors={TEMA_COLORS}
            filtroTema={filtroTema}
            onFiltro={setFiltroTema}
            onEditar={session ? handleEditar : null}
            onEliminar={session ? handleEliminar : null}
            loading={loading}
          />
        )}
      </main>
    </div>
  )
}

const styles = {
  root: { fontFamily: "'Source Sans 3', sans-serif", minHeight: '100vh', background: '#f7f8fa', color: '#1a1a2e' },
  header: { background: '#0f2744', position: 'relative', overflow: 'hidden' },
  headerInner: { maxWidth: 900, margin: '0 auto', padding: '32px 24px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, flexWrap: 'wrap' },
  eyebrow: { fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: '#c9a84c', marginBottom: 6, fontWeight: 600 },
  title: { fontFamily: "'Playfair Display', serif", fontSize: 28, color: 'white', margin: 0, lineHeight: 1.2 },
  subtitle: { fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 4, fontWeight: 300 },
  headerRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 },
  countBadge: { background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', color: '#e8c96a', fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 20 },
  btnPrimary: { padding: '8px 20px', background: '#c9a84c', color: '#0f2744', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 14, fontFamily: "'Source Sans 3', sans-serif" },
  btnSecondary: { padding: '8px 16px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13, fontFamily: "'Source Sans 3', sans-serif" },
  toast: { position: 'fixed', top: 20, right: 20, padding: '12px 20px', borderRadius: 8, fontSize: 14, fontWeight: 600, zIndex: 1000, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' },
  main: { maxWidth: 900, margin: '0 auto', padding: '28px 24px 60px' },
}
