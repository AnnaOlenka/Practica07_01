import { useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { useTheme }     from '../contexts/ThemeContext'
import { useFavorites } from '../contexts/FavoritesContext'

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const { favorites } = useFavorites()
  // useRef: acceso al input de búsqueda desde la navbar sin re-render
  const searchRef = useRef(null)

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand">📺 SeriesHub</NavLink>

      <NavLink to="/"          className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
        Buscar
      </NavLink>
      <NavLink to="/favorites" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
        Favoritos
        {favorites.length > 0 &&
          <span className="badge" style={{ marginLeft: '0.4rem' }}>{favorites.length}</span>
        }
      </NavLink>

      <div className="navbar-right">
        <button className="btn-ghost btn-sm" onClick={toggleTheme}>
          {theme === 'light' ? '🌙 Oscuro' : '☀️ Claro'}
        </button>
      </div>
    </nav>
  )
}