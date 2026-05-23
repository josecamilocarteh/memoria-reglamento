export default function Hemiciclo() {
  const partidos = [
    { nombre: 'RN', escanos: 10, color: '#1d6fce', bloque: 'Oficialismo', full: 'Renovación Nacional' },
    { nombre: 'UDI', escanos: 5, color: '#f59e0b', bloque: 'Oficialismo', full: 'UDI' },
    { nombre: 'Republicano', escanos: 5, color: '#1e3a8a', bloque: 'Oficialismo', full: 'Partido Republicano' },
    { nombre: 'Evópoli', escanos: 4, color: '#06b6d4', bloque: 'Oficialismo', full: 'Evópoli' },
    { nombre: 'Indep. Of.', escanos: 1, color: '#94a3b8', bloque: 'Oficialismo', full: 'Independiente Oficialismo' },
    { nombre: 'PS', escanos: 7, color: '#dc2626', bloque: 'Oposición', full: 'Partido Socialista' },
    { nombre: 'PPD', escanos: 4, color: '#f97316', bloque: 'Oposición', full: 'PPD' },
    { nombre: 'PDC', escanos: 3, color: '#3b82f6', bloque: 'Oposición', full: 'Partido Demócrata Cristiano' },
    { nombre: 'PC', escanos: 3, color: '#7f1d1d', bloque: 'Oposición', full: 'Partido Comunista' },
    { nombre: 'FA', escanos: 2, color: '#a855f7', bloque: 'Oposición', full: 'Frente Amplio' },
    { nombre: 'FREVS', escanos: 2, color: '#22c55e', bloque: 'Oposición', full: 'FREVS' },
    { nombre: 'Liberal', escanos: 1, color: '#fbbf24', bloque: 'Oposición', full: 'Partido Liberal' },
    { nombre: 'Indep. Op.', escanos: 3, color: '#64748b', bloque: 'Oposición', full: 'Independiente Oposición' },
  ]

  const rows = [
    { r: 95, seats: 15 },
    { r: 130, seats: 17 },
    { r: 165, seats: 18 },
  ]

  const allSeats = []
  partidos.forEach(p => {
    for (let i = 0; i < p.escanos; i++) allSeats.push(p)
  })

  const cx = 300, cy = 290
  const circles = []
  let seatIdx = 0

  rows.forEach(({ r, seats }) => {
    for (let i = 0; i < seats && seatIdx < allSeats.length; i++, seatIdx++) {
      const angle = Math.PI - (i / (seats - 1)) * Math.PI
      const x = cx + r * Math.cos(angle)
      const y = cy - r * Math.sin(angle)
      circles.push({ x, y, seat: allSeats[seatIdx], id: seatIdx })
    }
  })

  return (
    <div style={styles.wrap}>
      <div style={styles.header}>
        <div style={styles.title}>Senado de la República de Chile</div>
        <div style={styles.subtitle}>Conformación Oficial · Período 2026–2030 · 50 escaños</div>
      </div>

      <div style={{ overflowX: 'auto', display: 'flex', justifyContent: 'center' }}>
        <svg width="600" height="320" viewBox="0 0 600 320" style={{ overflow: 'visible' }}>
          {/* Arco base */}
          <path
            d={`M ${cx - 195} ${cy} A 195 195 0 0 1 ${cx + 195} ${cy}`}
            fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2"
          />
          {/* Línea divisoria */}
          <line x1={cx} y1={cy - 75} x2={cx} y2={cy - 180}
            stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeDasharray="5,3" />
          {/* Escaños */}
          {circles.map(({ x, y, seat, id }) => (
            <circle key={id} cx={x} cy={y} r={9}
              fill={seat.color} stroke="#0f1923" strokeWidth="2"
              style={{ cursor: 'pointer' }}>
              <title>{seat.full} · {seat.bloque} · {seat.escanos} escaños</title>
            </circle>
          ))}
          {/* Etiquetas */}
          <text x="90" y="308" fill="#93c5fd" fontSize="11" textAnchor="middle" fontWeight="700">OFICIALISMO</text>
          <text x="90" y="320" fill="#6b93c4" fontSize="10" textAnchor="middle">25 escaños</text>
          <text x="510" y="308" fill="#fca5a5" fontSize="11" textAnchor="middle" fontWeight="700">OPOSICIÓN</text>
          <text x="510" y="320" fill="#c47a7a" fontSize="10" textAnchor="middle">25 escaños</text>
          <text x={cx} y="308" fill="white" fontSize="13" textAnchor="middle" fontWeight="700">50</text>
          <text x={cx} y="320" fill="#888" fontSize="10" textAnchor="middle">escaños</text>
        </svg>
      </div>

      {/* Leyenda */}
      <div style={styles.legendWrap}>
        <div style={{ ...styles.bloqueTitle, color: '#93c5fd' }}>🔵 Bloque Oficialismo — 25 escaños</div>
        <div style={styles.legendGrid}>
          {partidos.filter(p => p.bloque === 'Oficialismo').map(p => (
            <div key={p.nombre} style={styles.legendItem}>
              <div style={{ ...styles.dot, background: p.color }} />
              {p.full} — {p.escanos}
            </div>
          ))}
        </div>
        <div style={{ ...styles.bloqueTitle, color: '#fca5a5', marginTop: 16 }}>🔴 Bloque Oposición — 25 escaños</div>
        <div style={styles.legendGrid}>
          {partidos.filter(p => p.bloque === 'Oposición').map(p => (
            <div key={p.nombre} style={styles.legendItem}>
              <div style={{ ...styles.dot, background: p.color }} />
              {p.full} — {p.escanos}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const styles = {
  wrap: { background: '#0f1923', borderRadius: 12, padding: '28px 24px', maxWidth: 700, margin: '0 auto' },
  header: { textAlign: 'center', marginBottom: 20 },
  title: { color: 'white', fontSize: 17, fontWeight: 700, marginBottom: 4 },
  subtitle: { color: '#888', fontSize: 12 },
  legendWrap: { marginTop: 20 },
  bloqueTitle: { fontSize: 11, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 8, paddingBottom: 4, borderBottom: '1px solid rgba(255,255,255,0.1)' },
  legendGrid: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  legendItem: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#ccc' },
  dot: { width: 10, height: 10, borderRadius: '50%', flexShrink: 0 },
}
