import { useState, useMemo, useCallback, useRef, Profiler } from 'react'
import { useFetch }    from '../hooks/useFetch'
import { useDebounce } from '../hooks/useDebounce'
import SeriesCard      from '../components/SeriesCard'
import SeriesModal     from '../components/SeriesModal'
import SkeletonGrid    from '../components/SkeletonGrid'

// Profiler callback: imprime en consola duración de renders
function onRender(id, phase, actualDuration) {
  console.log(`[Profiler] ${id} | ${phase} | ${actualDuration.toFixed(2)}ms`)
}

const SORT_OPTIONS = [
  { value: 'name',   label: 'Nombre A→Z' },
  { value: 'rating', label: 'Mejor rating' },
  { value: 'year',   label: 'Más reciente' },
]

export default function SearchPage() {
  const [query, setQuery]         = useState('')
  const [sortBy, setSortBy]       = useState('rating')
  const [genreFilter, setGenre]   = useState('all')
  const [selected, setSelected]   = useState(null)
  const [profilerInfo, setProfiler] = useState({ phase: '—', ms: '—' })

  // useRef: referencia al input para hacer focus sin re-render extra
  const inputRef = useRef(null)

  // Custom Hook: debounce de 450ms para no hacer fetch en cada tecla
  const debouncedQuery = useDebounce(query, 450)

  // Custom Hook useFetch: URL cambia con el query — AbortController interno
  const searchUrl = debouncedQuery.trim().length > 1
    ? `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(debouncedQuery)}`
    : 'https://api.tvmaze.com/shows?page=0'

  const { data: rawData, loading, error } = useFetch(searchUrl)

  // Normalizar respuesta: búsqueda devuelve [{show}, ...]; paginado devuelve [show, ...]
  const shows = useMemo(() => {
    if (!rawData) return []
    return debouncedQuery.trim().length > 1
      ? rawData.map(r => r.show).filter(Boolean)
      : rawData
  }, [rawData, debouncedQuery])

  // useMemo: calcular géneros únicos disponibles solo cuando cambia shows
  const availableGenres = useMemo(() => {
    const all = shows.flatMap(s => s?.genres ?? [])
    return ['all', ...new Set(all)].slice(0, 12)
  }, [shows])

  // useMemo: filtrar y ordenar — solo recalcula si shows/sortBy/genreFilter cambian
  const processed = useMemo(() => {
    let list = genreFilter === 'all'
      ? shows
      : shows.filter(s => s.genres?.includes(genreFilter))

    return [...list].sort((a, b) => {
      if (sortBy === 'name')
        return a.name.localeCompare(b.name)
      if (sortBy === 'rating')
        return (b.rating?.average ?? 0) - (a.rating?.average ?? 0)
      if (sortBy === 'year')
        return (b.premiered ?? '').localeCompare(a.premiered ?? '')
      return 0
    })
  }, [shows, sortBy, genreFilter])

  // useCallback: estabilizar handler para no recrear en cada render
  const handleSelect   = useCallback((show) => setSelected(show), [])
  const handleClose    = useCallback(() => setSelected(null), [])
  const handleClearSearch = useCallback(() => {
    setQuery('')
    inputRef.current?.focus()
  }, [])

  // Profiler personalizado: mostrar info en pantalla
  // Umbral 0.5ms para evitar loop de auto-renders triviales
  const handleRender = useCallback((id, phase, actualDuration) => {
    onRender(id, phase, actualDuration)
    if (actualDuration > 0.5) {
      setProfiler({ phase, ms: actualDuration.toFixed(2) })
    }
  }, [])

  return (
    <div className="page">
      <h1 className="page-title">🔍 Explorar Series</h1>

      {/* Barra de info del Profiler — se actualiza con cada render */}
      <div className="profiler-bar">
        <div>Profiler: <span>SeriesGrid</span></div>
        <div>Última fase: <span>{profilerInfo.phase}</span></div>
        <div>Duración real: <span>{profilerInfo.ms} ms</span></div>
        <div>Resultados: <span>{processed.length}</span></div>
      </div>

      {/* Búsqueda — useRef apunta a este input */}
      <div className="search-wrap">
        <input
          ref={inputRef}
          className="search-input"
          placeholder="Buscar series... (ej: Breaking Bad)"
          value={query}
          onChange={e => setQuery(e.target.value)}
          autoFocus
        />
        {query && (
          <button className="btn-ghost" onClick={handleClearSearch}>✕ Limpiar</button>
        )}
      </div>

      {/* Filtros — useMemo calcula géneros dinámicamente */}
      <div className="filters">
        <span style={{ fontSize: '0.85rem', color: 'var(--text2)' }}>Ordenar:</span>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
          {SORT_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        <span style={{ fontSize: '0.85rem', color: 'var(--text2)', marginLeft: '0.5rem' }}>
          Género:
        </span>
        <select value={genreFilter} onChange={e => setGenre(e.target.value)}>
          {availableGenres.map(g => (
            <option key={g} value={g}>{g === 'all' ? 'Todos' : g}</option>
          ))}
        </select>
      </div>

      {/* Estado de la petición */}
      {loading && (
        <div className="status-row">
          <span>⏳ Cargando{debouncedQuery ? ` resultados para "${debouncedQuery}"` : ' series populares'}...</span>
        </div>
      )}
      {error && (
        <div className="status-row" style={{ color: 'var(--danger)' }}>
          ✗ {error}
        </div>
      )}

      {/* Profiler envuelve el grid para medir renders */}
      <Profiler id="SeriesGrid" onRender={handleRender}>
        {loading
          ? <SkeletonGrid count={12} />
          : processed.length === 0 && !loading
            ? (
              <div className="empty">
                <div className="empty-icon">📭</div>
                <p>No se encontraron series para <strong>"{query}"</strong></p>
              </div>
            )
            : (
              <div className="series-grid">
                {processed.map(show => (
                  <SeriesCard key={show.id} show={show} onSelect={handleSelect} />
                ))}
              </div>
            )
        }
      </Profiler>

      {/* Modal de detalle */}
      {selected && <SeriesModal show={selected} onClose={handleClose} />}
    </div>
  )
}