// On transforme pages en fonction pour pouvoir injecter l'userId dynamiquement
// C'est nécessaire car /account/:id requiert l'id dans l'URL
export const getPages = (userId) => [
  {
    label: "Mon profil",
    path: `/account/${userId}`,
    keywords: ["profil", "compte", "utilisateur", "avatar", "identité"],
    category: "Paramètres"
  },
  {
    label: "Mot de passe",
    path: "/account/password",
    keywords: ["sécurité", "connexion", "login", "changer", "mot de passe"],
    category: "Paramètres"
  },
  {
    label: "Planning",
    path: "/planning",
    keywords: ["calendrier", "agenda", "événements", "organisation"],
    category: "Outils"
  },
  {
    label: "Ambiance",
    path: "/vibe",
    keywords: ["vibes", "luminosité", "musique", "ambiance"],
    category: "Ambiances"
  },
  {
    label: "Playlist",
    path: "/playlist",
    keywords: ["musique", "audio", "écoute", "sons"],
    category: "Musique"
  },
  {
    label: "AI Assistant",
    path: "/ai",
    keywords: ["assistant", "intelligence artificielle", "chatbot", "aide"],
    category: "Outils"
  }
];