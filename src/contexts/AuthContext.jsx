import { createContext, useContext, useState } from "react";
import { USER_INFOS, USER_MOOD } from "../constants/appConstant";

const AuthContext = createContext({
    userId: '',
    username: '',
    inSession: null,
    setUserId: () => {},
    setUsername: () => {},
    setInSession: () => {},
    signIn: async () => {},
    signOut: async () => {},
});

const AuthContextProvider = ({ children }) => {
    const [userId, setUserId] = useState('');
    const [username, setUsername] = useState('');
    const [inSession, setInSession] = useState(null);

    const signIn = async (user) => {
        try {
            setUserId(user.userId);
            setUsername(user.username);
            setInSession(true);
            // ✅ On stocke aussi le token JWT
            localStorage.setItem(USER_INFOS, JSON.stringify(user));
            localStorage.setItem('jwt_token', user.token);
        } catch (error) {
            throw new Error(`Erreur lors de la connexion : ${error}`);
        }
    }

    const signOut = async () => {
        try {
            setUserId('');
            setUsername('');
            setInSession(null);
            localStorage.removeItem(USER_INFOS);
            localStorage.removeItem(USER_MOOD);
            localStorage.removeItem('jwt_token'); // ✅ Suppression du token
        } catch (error) {
            throw new Error(`Erreur lors de la déconnexion : ${error}`);
        }
    }

    const value = {
        userId,
        username,
        inSession,
        setUserId,
        setUsername,
        setInSession,
        signIn,
        signOut
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

const useAuthContext = () => useContext(AuthContext);

export { AuthContext, AuthContextProvider, useAuthContext };