import { useEffect, useRef } from 'react'
import { useFavorites } from '../contexts/FavoritesContext'

export default function SeriesModal({ show, onClose }) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites()
  // useRef: enfocar el botón de cerrar al abrir el modal (accesibilidad)
  const closeRef = useRef(null)

  useEffect(() => {
    closeRef.current?.focus()
    // Limpieza: restaurar scroll del body
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // Cerrar con Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const fav = isFavorite(show.id)
  const summary = show.summary
    ? show.summary.replace(/<[^>]+>/g, '') // quitar HTML tags
    : 'Sin descripción disponible.'

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        {show.image?.original
          ? <img className="modal-banner" src={show.image.original} alt={show.name} />
          : <div style={{ height: 120, background: 'var(--bg2)' }} />
        }

        <div className="modal-header">
          <h2 style={{ color: 'var(--accent)', fontSize: '1.3rem' }}>{show.name}</h2>
          <button ref={closeRef} className="btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {show.genres?.map(g => (
              <span key={g} className="badge badge-gray">{g}</span>
            ))}
            {show.rating?.average &&
              <span className="badge">⭐ {show.rating.average}</span>
            }
            <span className={`badge ${show.status === 'Running' ? 'badge-green' : 'badge-gray'}`}>
              {show.status}
            </span>
            {show.network?.name &&
              <span className="badge badge-gray">📡 {show.network.name}</span>
            }
          </div>

          <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text2)', marginBottom: '1.2rem' }}>
            {summary}
          </p>

          <button
            className={fav ? 'btn-danger' : 'btn-primary'}
            onClick={() => fav ? removeFavorite(show.id) : addFavorite(show)}
          >
            {fav ? '♥ Quitar de favoritos' : '♡ Agregar a favoritos'}
          </button>
        </div>
      </div>
    </div>
  )
}