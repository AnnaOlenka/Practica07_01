import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider }    from './contexts/ThemeContext'
import { FavoritesProvider } from './contexts/FavoritesContext'
import Navbar          from './components/Navbar'
import SearchPage      from './pages/SearchPage'
import FavoritesPage   from './pages/FavoritesPage'

export default function App() {
  return (
    // Providers anidados: cualquier hijo accede a tema y favoritos sin prop drilling
    <ThemeProvider>
      <FavoritesProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/"          element={<SearchPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
          </Routes>
        </BrowserRouter>
      </FavoritesProvider>
    </ThemeProvider>
  )
}