import { createContext, useContext, useReducer } from 'react'
import { favoritesReducer, initialFavoritesState } from '../reducers/favoritesReducer'

const FavoritesContext = createContext(null)

export function FavoritesProvider({ children }) {
  // useReducer: estado complejo de favoritos gestionado con acciones
  const [state, dispatch] = useReducer(favoritesReducer, initialFavoritesState)

  const addFavorite    = (show) => dispatch({ type: 'ADD', payload: show })
  const removeFavorite = (id)   => dispatch({ type: 'REMOVE', payload: id })
  const clearAll       = ()     => dispatch({ type: 'CLEAR' })
  const isFavorite     = (id)   => state.items.some(i => i.id === id)

  return (
    <FavoritesContext.Provider
      value={{ favorites: state.items, addFavorite, removeFavorite, clearAll, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites fuera de FavoritesProvider')
  return ctx
}