import { createContext, useContext, useState } from "react";
import { USER_INFOS } from "../constants/appConstant";

// définition du contexte d'authentification avec les données initialisées à vide
const AuthContext = createContext({
    userId: '', // state pour l'identifiant de l'utilisateur
    username: '', // state pour le pseudo de l'utilisateur
    setUserId: () => {}, // méthode pour mettre à jour l'identifiant de l'utilisateur
    setUsername: () => {}, // méthode pour mettre à jour le pseudo de l'utilisateur
    signIn: async () => {}, // méthode pour se connecter
    signOut: async () => {}, // méthode pour se déconnecter
});

// définition de la mécanique du contexte d'authentification
const AuthContextProvider = ({ children }) => {
    const [userId, setUserId] = useState('');
    const [username, setUsername] = useState('');

    // définition de la méthode signIn pour la connexion
    const signIn = async (user) => {
        try {
            // remplissage des states avec les données de l'utilisateur
            setUserId(user.userId);
            setUsername(user.username);
            // stockage des données de l'utilisateur dans le localStorage
            localStorage.setItem(USER_INFOS, JSON.stringify(user));   
        } catch (error) {
            throw new Error(`Erreur lors de la connexion : ${error}`);
        }
    }

    // définition de la méthode signOut pour la déconnexion
    const signOut = async () => {
        try {
            // remise à zéro des states
            setUserId('');
            setUsername('');
            // suppression des données de l'utilisateur du localStorage
            localStorage.removeItem(USER_INFOS);
        } catch (error) {
            throw new Error(`Erreur lors de la déconnexion : ${error}`);            
        }   
    }

    // définition des valeurs du contexte
    const value = {
        userId,
        username,
        setUserId,
        setUsername,
        signIn,
        signOut
    }

    // rendu du contexte avec les valeurs définies
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>     
}

// création d'un hook personnalisé pour utiliser le contexte d'authentification
const useAuthContext = () => useContext(AuthContext);

export { AuthContext, AuthContextProvider, useAuthContext };