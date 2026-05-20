// useReducer: gestiona la lista de favoritos con acciones claras
export const initialFavoritesState = {
  items: JSON.parse(localStorage.getItem("favorites") || "[]"),
  count: 0,
};

export function favoritesReducer(state, action) {
  let newItems;

  switch (action.type) {
    case "ADD":
      // Evitar duplicados
      if (state.items.find((i) => i.id === action.payload.id)) return state;
      newItems = [...state.items, action.payload];
      localStorage.setItem("favorites", JSON.stringify(newItems));
      return { ...state, items: newItems };

    case "REMOVE":
      newItems = state.items.filter((i) => i.id !== action.payload);
      localStorage.setItem("favorites", JSON.stringify(newItems));
      return { ...state, items: newItems };

    case "CLEAR":
      localStorage.removeItem("favorites");
      return { ...state, items: [] };

    default:
      throw new Error(`Acción desconocida: ${action.type}`);
  }
}
