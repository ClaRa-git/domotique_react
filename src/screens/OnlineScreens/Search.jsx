import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { pages } from "../../data/searchData";

export default function SearchPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  // Suggestions par défaut
  const suggestions = [
    "Mot de passe",
    "Planning",
    "Ambiance",
    "Playlist"
  ];

  // Filtrage élargi (label + mots-clés)
  const results = pages.filter((p) => {
    const q = query.toLowerCase();
    return (
      p.label.toLowerCase().includes(q) ||
      (p.keywords && p.keywords.some(k => k.toLowerCase().includes(q)))
    );
  });

  const handleSuggestionClick = (s) => setQuery(s);

  return (
    <div className="search-page" style={{ padding: "1rem" }}>
      <input
        type="text"
        placeholder="Rechercher..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          width: "100%",
          fontSize: "1.2rem",
          border: "none",
          borderBottom: "1px solid #ccc",
          padding: "0.5rem 0"
        }}
      />

      {/* Suggestions */}
      {!query && (
        <ul style={{ listStyle: "none", marginTop: "1rem", padding: 0 }}>
          {suggestions.map((s, i) => (
            <li
              key={i}
              onClick={() => handleSuggestionClick(s)}
              style={{
                color: "#777",
                cursor: "pointer",
                marginBottom: "0.5rem"
              }}
            >
              {s}
            </li>
          ))}
        </ul>
      )}

      {/* Résultats */}
      {query && (
        <ul style={{ listStyle: "none", marginTop: "1rem", padding: 0 }}>
          {results.length > 0 ? (
            results.map((p, i) => (
              <li
                key={i}
                onClick={() => navigate(p.path)}
                style={{
                  cursor: "pointer",
                  marginBottom: "0.5rem"
                }}
              >
                <strong>{p.label}</strong>
                <div style={{ fontSize: "0.9rem", color: "#888" }}>
                  {p.category}
                </div>
              </li>
            ))
          ) : (
            <li style={{ color: "#aaa" }}>Aucun résultat trouvé</li>
          )}
        </ul>
      )}
    </div>
  );
}