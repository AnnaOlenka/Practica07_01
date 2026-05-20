import { memo, useCallback } from 'react'
import { useFavorites } from '../contexts/FavoritesContext'

// memo: solo re-renderiza si las props cambian — optimización de render
const SeriesCard = memo(function SeriesCard({ show, onSelect }) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites()
  const fav = isFavorite(show.id)

  // useCallback: no recrea la función en cada render del padre
  const handleFav = useCallback((e) => {
    e.stopPropagation()
    fav ? removeFavorite(show.id) : addFavorite(show)
  }, [fav, show, addFavorite, removeFavorite])

  const rating = show.rating?.average
    ? `⭐ ${show.rating.average}`
    : '—'

  return (
    <div className="series-card" onClick={() => onSelect(show)}>
      <img
        src={show.image?.medium ?? 'https://via.placeholder.com/210x295?text=No+image'}
        alt={show.name}
        loading="lazy"
      />
      <div className="series-card-body">
        <div className="series-card-title">{show.name}</div>
        <div className="series-card-meta">{show.genres?.slice(0, 2).join(' · ') || 'Sin género'}</div>
        <div className="series-card-meta">{rating}</div>
      </div>
      <div className="series-card-footer">
        <span className={`badge ${show.status === 'Running' ? 'badge-green' : 'badge-gray'}`}>
          {show.status ?? 'N/A'}
        </span>
        <button
          className={`btn-sm ${fav ? 'btn-danger' : 'btn-ghost'}`}
          onClick={handleFav}
          title={fav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          {fav ? '♥' : '♡'}
        </button>
      </div>
    </div>
  )
})

export default SeriesCard