import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuthContext } from '../contexts/AuthContext'; 
import { RouterProvider } from 'react-router-dom';
import PageLoader from '../components/Loader/PageLoader';
import OnlineRouter from './OnlineRouter';
import OfflineRouter from './OfflineRouter';
import { USER_INFOS } from '../constants/appConstant';

// Création d'un mini contexte pour la session
const SessionContext = createContext({ inSession: false });

// Création d'un hook personnalisé pour utiliser le contexte de session
export const useSession = () => useContext(SessionContext);

const AppRouter = () => {
    // Récupération des données de contexte d'authentification
    const { userId, setUserId, setUsername, inSession, setInSession } = useAuthContext();

    // Récupération des données de l'utilisateur dans localStorage
    const userInfo = JSON.parse(localStorage.getItem(USER_INFOS));

    useEffect(() => {
        const checkUserSession = () => {
            if (userInfo) {
                // Si des informations utilisateur sont présentes dans localStorage
                setUserId(userInfo.userId);   // Met à jour l'ID utilisateur
                setUsername(userInfo.username); // Met à jour le nom d'utilisateur
                setInSession(true);             // Met l'état de la session à 'true'
            } else {
                setInSession(false);            // Sinon, la session est 'false'
            }
        };

        // Vérification de la session utilisateur dès le montage du composant
        checkUserSession();

    }, [setUserId, setUsername, setInSession, userId]); // Les dépendances incluent 'userInfo'

    // Affichage du loader le temps de chargement de la session
    if (inSession === null) return <PageLoader />;

    return (
        <SessionContext.Provider value={{ inSession }}>
            {/* Utilisation de OnlineRouter ou OfflineRouter en fonction de l'état de la session */}
            <RouterProvider router={inSession ? OnlineRouter : OfflineRouter} />
        </SessionContext.Provider>
    );
};

export default AppRouter;
