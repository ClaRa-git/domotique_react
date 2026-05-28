import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPages } from "../../data/searchData";
import { useAuthContext } from "../../contexts/AuthContext";
import { FaSearch } from "react-icons/fa";
import { RiArrowRightSFill } from "react-icons/ri";

export default function Search() {
  const navigate = useNavigate();
  const { userId } = useAuthContext(); // récupère l'id de l'utilisateur connecté

  const [query, setQuery] = useState("");

  // On construit les pages en passant userId pour générer /account/:id
  const pages = getPages(userId);

  const suggestions = ["Mon profil", "Mot de passe", "Planning", "Ambiance", "Playlist"];

  const results = pages.filter((p) => {
    const q = query.toLowerCase();
    return (
      p.label.toLowerCase().includes(q) ||
      (p.keywords && p.keywords.some((k) => k.toLowerCase().includes(q)))
    );
  });

  return (
    <div className="flex flex-col px-6 pt-6 pb-4 min-h-screen">

      {/* Barre de recherche */}
      <div className="flex items-center gap-3 border-b-2 border-primary pb-3 mb-6">
        <FaSearch size={20} className="text-primary opacity-50" />
        <input
          type="text"
          placeholder="Rechercher..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          className="flex-1 text-lg bg-transparent outline-none text-primary placeholder-primary/40 font-medium"
        />
      </div>

      {/* Suggestions par défaut */}
      {!query && (
        <ul className="flex flex-col gap-1">
          {suggestions.map((s, i) => (
            <li
              key={i}
              onClick={() => setQuery(s)}
              className="flex justify-between items-center py-3 px-2 rounded-lg text-primary/60 cursor-pointer hover:bg-offwhite transition-colors"
            >
              <span className="font-medium">{s}</span>
              <RiArrowRightSFill size={20} className="text-secondary-pink" />
            </li>
          ))}
        </ul>
      )}

      {/* Résultats filtrés */}
      {query && (
        <ul className="flex flex-col gap-2">
          {results.length > 0 ? (
            results.map((p, i) => (
              <li
                key={i}
                onClick={() => navigate(p.path)}
                className="flex justify-between items-center py-3 px-3 rounded-lg cursor-pointer bg-offwhite hover:bg-secondary-pink/20 transition-colors"
              >
                <div>
                  <p className="font-semibold text-primary">{p.label}</p>
                  <p className="text-sm text-secondary-pink">{p.category}</p>
                </div>
                <RiArrowRightSFill size={24} className="text-secondary-orange" />
              </li>
            ))
          ) : (
            <li className="text-center text-primary/40 mt-8 font-medium">
              Aucun résultat trouvé
            </li>
          )}
        </ul>
      )}
    </div>
  );
}