import { useMemo, useState, useCallback } from 'react'
import { useFavorites } from '../contexts/FavoritesContext'
import SeriesModal from '../components/SeriesModal'

export default function FavoritesPage() {
  const { favorites, removeFavorite, clearAll } = useFavorites()
  const [sortBy, setSortBy]   = useState('added')
  const [selected, setSelected] = useState(null)

  // useMemo: re-ordena la lista solo cuando favorites o sortBy cambia
  const sorted = useMemo(() => {
    return [...favorites].sort((a, b) => {
      if (sortBy === 'name')   return a.name.localeCompare(b.name)
      if (sortBy === 'rating') return (b.rating?.average ?? 0) - (a.rating?.average ?? 0)
      return 0 // 'added': mantiene orden de inserción
    })
  }, [favorites, sortBy])

  // useCallback: estabilizar handlers
  const handleSelect = useCallback((show) => setSelected(show), [])
  const handleClose  = useCallback(() => setSelected(null), [])

  return (
    <div className="page">
      <h1 className="page-title">♥ Mis Favoritos</h1>

      {favorites.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">🎬</div>
          <p>Aún no tienes series favoritas.</p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
            Ve a <strong>Buscar</strong> y toca ♡ en cualquier serie.
          </p>
        </div>
      ) : (
        <>
          <div className="filters" style={{ marginBottom: '1.2rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text2)' }}>
              {favorites.length} serie{favorites.length !== 1 ? 's' : ''}
            </span>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="added">Orden de agregado</option>
              <option value="name">Nombre A→Z</option>
              <option value="rating">Mejor rating</option>
            </select>
            <button
              className="btn-danger btn-sm"
              style={{ marginLeft: 'auto' }}
              onClick={() => { if (confirm('¿Borrar todos los favoritos?')) clearAll() }}
            >
              🗑️ Limpiar todo
            </button>
          </div>

          {sorted.map(show => (
            <div
              key={show.id}
              className="fav-row"
              onClick={() => handleSelect(show)}
            >
              <img
                src={show.image?.medium ?? 'https://via.placeholder.com/48x68?text=?'}
                alt={show.name}
              />
              <div className="fav-info">
                <div className="fav-title">{show.name}</div>
                <div className="fav-meta">
                  {show.genres?.slice(0, 2).join(' · ') || 'Sin género'}
                  {show.rating?.average ? ` · ⭐ ${show.rating.average}` : ''}
                </div>
              </div>
              <button
                className="btn-danger btn-sm"
                onClick={e => { e.stopPropagation(); removeFavorite(show.id) }}
                title="Quitar de favoritos"
              >
                ✕
              </button>
            </div>
          ))}
        </>
      )}

      {selected && <SeriesModal show={selected} onClose={handleClose} />}
    </div>
  )
}