export default function Lista({ consultas, allConsultas, temas, temaColors, filtroTema, onFiltro, onEditar, onEliminar, loading }) {
  const temasFiltro = ['Todos', ...temas]

  if (loading) return (
    <div style={{ textAlign: 'center', padding: 60, color: '#888', fontSize: 16 }}>
      Cargando consultas...
    </div>
  )

  return (
    <div>
      {/* FILTROS */}
      <div style={styles.filtros}>
        {temasFiltro.map(t => (
          <button key={t} onClick={() => onFiltro(t)}
            style={{
              ...styles.filtroBtn,
              background: filtroTema === t ? (temaColors[t] || '#0f2744') : 'white',
              color: filtroTema === t ? 'white' : (temaColors[t] || '#0f2744'),
              borderColor: temaColors[t] || '#0f2744',
            }}>
            {t}
            {t !== 'Todos' && (
              <span style={{ marginLeft: 5, opacity: 0.7, fontSize: 10 }}>
                ({allConsultas.filter(c => (c.temas || []).includes(t)).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* LISTA */}
      {consultas.length === 0 ? (
        <div style={styles.empty}>No hay consultas para este tema.</div>
      ) : (
        consultas.map((c, i) => (
          <div key={c.id} style={{ ...styles.card, borderLeftColor: temaColors[(c.temas || [])[0]] || '#0f2744' }}>
            {/* Tags */}
            <div style={styles.tags}>
              {(c.temas || []).map(t => (
                <span key={t} style={{ ...styles.tag, background: temaColors[t] || '#0f2744' }}>{t}</span>
              ))}
            </div>

            {/* Pregunta */}
            <div style={styles.pregunta}>{i + 1}. {c.pregunta}</div>

            {/* Respuesta */}
            <div style={styles.respuesta}>{c.respuesta}</div>

            {/* Footer */}
            <div style={styles.footer}>
              <span style={styles.fecha}>{c.fecha}</span>
              {(onEditar || onEliminar) && (
                <div style={{ display: 'flex', gap: 6 }}>
                  {onEditar && <button onClick={() => onEditar(c)} style={styles.btnEdit}>✏️ Editar</button>}
                  {onEliminar && <button onClick={() => onEliminar(c.id)} style={styles.btnDel}>🗑 Eliminar</button>}
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  )
}

const styles = {
  filtros: { display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 24 },
  filtroBtn: { padding: '5px 12px', borderRadius: 20, border: '1.5px solid', cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: "'Source Sans 3', sans-serif", transition: 'all 0.15s' },
  empty: { background: 'white', borderRadius: 10, padding: 40, textAlign: 'center', color: '#888', fontSize: 15, border: '2px dashed #ddd' },
  card: { background: 'white', borderRadius: 10, padding: '18px 20px', marginBottom: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.07)', borderLeft: '3px solid transparent', transition: 'box-shadow 0.2s' },
  tags: { display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 8 },
  tag: { fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10, color: 'white', letterSpacing: 0.5 },
  pregunta: { fontSize: 14, fontWeight: 700, color: '#0f2744', marginBottom: 10, lineHeight: 1.4 },
  respuesta: { fontSize: 13, color: '#3a4a5a', lineHeight: 1.75, whiteSpace: 'pre-line' },
  footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  fecha: { fontSize: 11, color: '#aaa' },
  btnEdit: { background: '#e8f0fe', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: 12, color: '#0f2744', fontFamily: "'Source Sans 3', sans-serif" },
  btnDel: { background: '#fde8e8', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: 12, color: '#c0392b', fontFamily: "'Source Sans 3', sans-serif" },
}
