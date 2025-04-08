import React, { createContext, useEffect, useState } from 'react'
import { useAuthContext } from '../contexts/AuthContext' 
import { RouterProvider } from 'react-router-dom'
import PageLoader from '../components/Loader/PageLoader'
import OnlineRouter from './OnlineRouter'
import OfflineRouter from './OfflineRouter'
import { USER_INFOS } from '../constants/appConstant'

// création d'un mini contexte pour la session
const SessionContext = createContext({ inSession: false })

// création d'un hook personnalisé pour utiliser le contexte de session
export const useSession = () => useContext(SessionContext)

const AppRouter = () => {
    // création d'un état pour la session
    const [inSession, setInSession] = useState(null);
    // récupération grace au hook des données du contexte d'authentification
    const { userId, setUserId, setUsername } = useAuthContext();
    // récupération des données de l'utilisateur dans le localStorage
    const userInfo = JSON.parse(localStorage.getItem(USER_INFOS));

    useEffect(() => {
        const checkUserSession = () => {
            if (userInfo) {
                setUserId(userInfo.userId);
                setUsername(userInfo.username);
                setInSession(true);
            }
            else {
                setInSession(false);
            }
        }

        checkUserSession();

    }, [userId])

    // affichage du loader le temps de chargement
    if (inSession === null) return <PageLoader />

    return (
        <SessionContext.Provider value={{ inSession }}>
            <RouterProvider router={inSession ? OnlineRouter : OfflineRouter} />
        </SessionContext.Provider>
    )
}

export default AppRouter