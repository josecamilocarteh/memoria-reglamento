import { useState } from 'react'

export default function Formulario({ temas, temaColors, inicial, onGuardar, onCancelar }) {
  const hoy = new Date().toISOString().slice(0, 10)
  const [form, setForm] = useState({
    temas: inicial?.temas || [temas[0]],
    pregunta: inicial?.pregunta || '',
    respuesta: inicial?.respuesta || '',
    fecha: inicial?.fecha || hoy,
  })

  function toggleTema(t) {
    if (form.temas.includes(t)) {
      if (form.temas.length === 1) return
      setForm({ ...form, temas: form.temas.filter(x => x !== t) })
    } else {
      setForm({ ...form, temas: [...form.temas, t] })
    }
  }

  const valido = form.pregunta.trim() && form.respuesta.trim() && form.temas.length > 0

  return (
    <div style={styles.card}>
      <div style={styles.title}>{inicial ? 'Editar consulta' : 'Nueva consulta'}</div>

      <div style={styles.group}>
        <label style={styles.label}>Temas <span style={{ fontWeight: 400, color: '#999' }}>(selecciona los que apliquen)</span></label>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {temas.map(t => (
            <button key={t} type="button" onClick={() => toggleTema(t)}
              style={{
                padding: '5px 12px', borderRadius: 20, border: '1.5px solid', cursor: 'pointer', fontSize: 12, fontWeight: 600,
                fontFamily: "'Source Sans 3', sans-serif",
                background: form.temas.includes(t) ? (temaColors[t] || '#0f2744') : 'white',
                color: form.temas.includes(t) ? 'white' : (temaColors[t] || '#0f2744'),
                borderColor: temaColors[t] || '#0f2744',
              }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.group}>
        <label style={styles.label}>Pregunta</label>
        <textarea
          value={form.pregunta}
          onChange={e => setForm({ ...form, pregunta: e.target.value })}
          rows={3}
          placeholder="Escribe la pregunta sobre el reglamento..."
          style={styles.textarea}
        />
      </div>

      <div style={styles.group}>
        <label style={styles.label}>Respuesta</label>
        <textarea
          value={form.respuesta}
          onChange={e => setForm({ ...form, respuesta: e.target.value })}
          rows={10}
          placeholder="Escribe la respuesta según el reglamento..."
          style={styles.textarea}
        />
      </div>

      <div style={{ ...styles.group, maxWidth: 200 }}>
        <label style={styles.label}>Fecha</label>
        <input
          type="date"
          value={form.fecha}
          onChange={e => setForm({ ...form, fecha: e.target.value })}
          style={styles.input}
        />
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button
          onClick={() => valido && onGuardar(form)}
          disabled={!valido}
          style={{ ...styles.btnPrimary, opacity: valido ? 1 : 0.4, cursor: valido ? 'pointer' : 'not-allowed' }}>
          {inicial ? 'Guardar cambios' : 'Guardar consulta'}
        </button>
        <button onClick={onCancelar} style={styles.btnSecondary}>Cancelar</button>
      </div>
    </div>
  )
}

const styles = {
  card: { background: 'white', borderRadius: 12, padding: 28, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
  title: { fontFamily: "'Playfair Display', serif", fontSize: 22, color: '#0f2744', marginBottom: 24, fontWeight: 700 },
  group: { marginBottom: 20 },
  label: { display: 'block', fontSize: 12, fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  textarea: { width: '100%', padding: '10px 14px', borderRadius: 8, border: '1.5px solid #ddd', fontSize: 14, fontFamily: "'Source Sans 3', sans-serif", resize: 'vertical', boxSizing: 'border-box', lineHeight: 1.6 },
  input: { width: '100%', padding: '10px 14px', borderRadius: 8, border: '1.5px solid #ddd', fontSize: 14, fontFamily: "'Source Sans 3', sans-serif", boxSizing: 'border-box' },
  btnPrimary: { padding: '10px 24px', background: '#0f2744', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 14, fontFamily: "'Source Sans 3', sans-serif" },
  btnSecondary: { padding: '10px 18px', background: '#f0f0f0', color: '#333', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 14, fontFamily: "'Source Sans 3', sans-serif" },
}
