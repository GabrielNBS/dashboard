import { useState } from 'react';
import { Search, X } from 'lucide-react'; // Ícones do lucide-react

export default function SearchInput() {
  const [query, setQuery] = useState('');

  return (
    <div className="relative flex">
      {/* Ícone de busca */}
      <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" size={18} />

      {/* Campo de busca */}
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Buscar Ingrediente"
        className="w-full rounded-xl border border-gray-300 bg-white py-2 pr-10 pl-10 text-sm text-gray-700 shadow-sm transition outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
      />

      {/* Botão de limpar */}
      {query && (
        <button
          onClick={() => setQuery('')}
          className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:bg-gray-100"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
