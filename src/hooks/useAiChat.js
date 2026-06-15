import { useState, useCallback } from 'react';
import axios from 'axios';
import { API_ROOT } from '../constants/apiConstant';
import { USER_INFOS } from '../constants/appConstant';

// Récupère le token JWT depuis le localStorage (stocké dans USER_INFOS)
const getAuthToken = () => {
    try {
        const userInfos = JSON.parse( localStorage.getItem( USER_INFOS ) );
        return userInfos?.token || null;
    } catch {
        return null;
    }
};

// Hook pour gérer la conversation avec Noctys (IA)
// Le back attend : POST /api/ai/chat { messages: [{role, content}] }
// Il répond soit { ready: false, message } soit { ready: true, criteria, explanation, vibes }
const useAiChat = () => {

    const [ messages, setMessages ] = useState( [
        {
            role: 'noctys',
            content: "Bonjour ! Je suis **Noctys**, votre assistant Hoomy. 🌙\n\nDites-moi comment vous vous sentez, et je choisirai l'ambiance parfaite pour vous."
        }
    ] );

    const [ recommendedVibes, setRecommendedVibes ] = useState( [] );
    const [ detectedCriteria, setDetectedCriteria ] = useState( null );
    const [ isLoading, setIsLoading ]               = useState( false );
    const [ error, setError ]                       = useState( null );

    // Construit l'historique au format attendu par le back (on saute le message d'accueil)
    const buildApiHistory = useCallback( ( currentMessages ) => {
        return currentMessages
            .filter( ( _, i ) => i > 0 )
            .map( ( msg ) => ({
                role: msg.role === 'user' ? 'user' : 'assistant',
                content: msg.content
            }) );
    }, [] );

    const sendMessage = useCallback( async ( userText ) => {
        if ( !userText.trim() || isLoading ) return;

        const newUserMsg      = { role: 'user', content: userText.trim() };
        const updatedMessages = [ ...messages, newUserMsg ];
        setMessages( updatedMessages );
        setIsLoading( true );
        setError( null );
        setRecommendedVibes( [] );

        try {
            const token = getAuthToken();

            const apiMessages = [
                ...buildApiHistory( messages ),
                { role: 'user', content: userText.trim() }
            ];

            const response = await axios.post(
                `${ API_ROOT }/api/ai/chat`,
                { messages: apiMessages },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        // JWT requis par le firewall Symfony
                        ...(token ? { 'Authorization': `Bearer ${ token }` } : {})
                    }
                }
            );

            const data = response.data;
            let noctysText = '';

            if ( data.ready === false ) {
                noctysText = data.message || "Pouvez-vous me donner plus de détails sur votre état ?";
            } else if ( data.ready === true ) {
                setDetectedCriteria( data.criteria );
                setRecommendedVibes( data.vibes || [] );
                noctysText = data.explanation
                    ? `${ data.explanation }\n\nVoici les ambiances qui correspondent à votre humeur :`
                    : "Voici les ambiances qui correspondent à votre humeur :";
            } else {
                noctysText = "Je n'ai pas pu analyser votre réponse. Pouvez-vous réessayer ?";
            }

            setMessages( [ ...updatedMessages, { role: 'noctys', content: noctysText } ] );

        } catch ( err ) {
            console.error( 'Erreur Noctys :', err );

            // Message d'erreur contextuel selon le status HTTP
            let errContent = "Je rencontre une difficulté technique. Veuillez réessayer dans un instant. 🌙";
            if ( err.response?.status === 401 ) {
                errContent = "Votre session a expiré. Veuillez vous reconnecter.";
            } else if ( err.response?.status === 500 ) {
                errContent = "Ollama n'est pas disponible. Assurez-vous qu'il est bien lancé (`ollama serve`).";
            }

            setMessages( [ ...updatedMessages, { role: 'noctys', content: errContent } ] );
            setError( errContent );
        } finally {
            setIsLoading( false );
        }
    }, [ messages, isLoading, buildApiHistory ] );

    const resetChat = useCallback( () => {
        setMessages( [
            {
                role: 'noctys',
                content: "Bonjour ! Je suis **Noctys**, votre assistant Hoomy. 🌙\n\nDites-moi comment vous vous sentez, et je choisirai l'ambiance parfaite pour vous."
            }
        ] );
        setRecommendedVibes( [] );
        setDetectedCriteria( null );
        setError( null );
    }, [] );

    return { messages, recommendedVibes, detectedCriteria, isLoading, error, sendMessage, resetChat };
};

export default useAiChat;