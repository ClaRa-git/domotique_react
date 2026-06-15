import React, { useEffect, useRef, useState } from 'react'
import { IoSend } from 'react-icons/io5'
import { FaCheck } from 'react-icons/fa'
import { API_ROOT } from '../../constants/apiConstant'
import useAiChat from '../../hooks/useAiChat'
import ChatBubble from '../../components/Ai/ChatBubble'
import axios from 'axios'
import { USER_INFOS } from '../../constants/appConstant'

const QUICK_SUGGESTIONS = [
    "Je me sens fatigué 😴",
    "Je veux une ambiance festive 🎉",
    "J'ai besoin de calme 🌿",
    "Je suis de bonne humeur 😊",
];

// Carte de vibe recommandée par Noctys
const VibeCard = ( { vibe, onActivate, isActivating } ) => {
    const scorePercent = Math.round( ( 1 - Math.min( vibe.score, 2 ) / 2 ) * 100 );

    return (
        <div className='flex items-center justify-between bg-white border border-primary/10 rounded-xl px-4 py-3 mb-2 shadow-sm'>
            <div>
                <p className='font-bold text-primary text-sm'>{ vibe.label }</p>
                <p className='text-xs text-secondary-pink'>{ scorePercent }% de correspondance</p>
            </div>
            <button
                onClick={ () => onActivate( vibe.id ) }
                disabled={ isActivating }
                className='flex items-center gap-1 bg-secondary-orange text-white text-xs font-bold px-3 py-2 rounded-full disabled:opacity-50 transition hover:bg-secondary-pink'
            >
                <FaCheck size={ 10 } />
                Activer
            </button>
        </div>
    );
};

// Page de chat avec Noctys
// ⚠️  Cette page vit dans <App> qui contient déjà Topbar + Footbar.
//     On n'utilise PAS h-screen ici — on remplit juste l'espace disponible.
const InterfaceAi = () => {

    const {
        messages,
        recommendedVibes,
        isLoading,
        sendMessage,
        resetChat
    } = useAiChat();

    const [ input, setInput ]               = useState( '' );
    const [ activatingId, setActivatingId ] = useState( null );
    const [ activatedId, setActivatedId ]   = useState( null );

    const bottomRef = useRef( null );
    const imgIa     = `${ API_ROOT }/images/logo_ai.png`;

    useEffect( () => {
        bottomRef.current?.scrollIntoView( { behavior: 'smooth' } );
    }, [ messages, isLoading, recommendedVibes ] );

    const handleSend = () => {
        if ( !input.trim() || isLoading ) return;
        sendMessage( input );
        setInput( '' );
        setActivatedId( null );
    };

    const handleKeyDown = ( e ) => {
        if ( e.key === 'Enter' && !e.shiftKey ) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleActivateVibe = async ( vibeId ) => {
        const vibe = recommendedVibes.find( v => v.id === vibeId );
        if ( !vibe ) return;

        setActivatingId( vibeId );
        try {
            const userInfos = JSON.parse( localStorage.getItem( USER_INFOS ) );
            const token = userInfos?.token || null;

            await axios.post(
                `${ API_ROOT }/send-vibe`,
                { vibeId, settings: vibe.settings },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { 'Authorization': `Bearer ${ token }` } : {})
                    }
                }
            );
            setActivatedId( vibeId );
        } catch ( err ) {
            console.error( 'Erreur activation vibe :', err );
        } finally {
            setActivatingId( null );
        }
    };

    const showSuggestions = messages.length === 1;

    return (
        // flex-col qui occupe toute la hauteur restante après Topbar + Footbar
        <div className='flex flex-col h-full'>

            {/* ── Sous-header Noctys ── */}
            <div className='flex items-center justify-between bg-primary px-4 py-3 flex-shrink-0'>
                <div className='flex items-center gap-3'>
                    <div className='w-9 h-9 bg-secondary-orange rounded-full flex items-center justify-center shadow'>
                        <img src={ imgIa } alt='Noctys' className='w-5 h-5 object-contain' />
                    </div>
                    <div>
                        <p className='text-white font-bold text-sm leading-tight'>Noctys</p>
                        <p className='text-white/50 text-xs'>Assistant IA · Hoomy</p>
                    </div>
                </div>
                <button
                    onClick={ resetChat }
                    className='text-white/50 text-xs border border-white/20 rounded-full px-3 py-1 hover:text-white hover:border-white/50 transition'
                >
                    Réinitialiser
                </button>
            </div>

            {/* ── Fil de messages (scrollable) ── */}
            <div className='flex-1 overflow-y-auto py-4 bg-offwhite'>

                { messages.map( ( msg, index ) => (
                    <ChatBubble key={ index } message={ msg } />
                ))}

                { showSuggestions && (
                    <div className='px-4 mt-2 flex flex-wrap gap-2'>
                        { QUICK_SUGGESTIONS.map( ( s, i ) => (
                            <button
                                key={ i }
                                onClick={ () => sendMessage( s ) }
                                disabled={ isLoading }
                                className='text-xs bg-white border border-secondary-pink/40 text-primary rounded-full px-3 py-2 hover:bg-secondary-pink hover:text-white transition shadow-sm disabled:opacity-40'
                            >
                                { s }
                            </button>
                        ))}
                    </div>
                )}

                { recommendedVibes.length > 0 && (
                    <div className='px-4 mt-3'>
                        { activatedId && (
                            <p className='text-xs text-secondary-orange font-bold mb-2 text-center'>
                                ✓ Ambiance activée !
                            </p>
                        )}
                        { recommendedVibes.map( ( vibe ) => (
                            <VibeCard
                                key={ vibe.id }
                                vibe={ vibe }
                                onActivate={ handleActivateVibe }
                                isActivating={ activatingId === vibe.id }
                            />
                        ))}
                    </div>
                )}

                { isLoading && (
                    <div className='flex items-end gap-2 px-4 mb-3 mt-1'>
                        <div className='w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow flex-shrink-0'>
                            <img src={ imgIa } alt='Noctys' className='w-5 h-5 object-contain' />
                        </div>
                        <div className='bg-primary rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm'>
                            <div className='flex gap-1 items-center h-4'>
                                <span className='w-2 h-2 bg-white/60 rounded-full animate-bounce' style={{ animationDelay: '0ms' }} />
                                <span className='w-2 h-2 bg-white/60 rounded-full animate-bounce' style={{ animationDelay: '150ms' }} />
                                <span className='w-2 h-2 bg-white/60 rounded-full animate-bounce' style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    </div>
                )}

                <div ref={ bottomRef } />
            </div>

            {/* ── Zone de saisie (collée au bas, au-dessus du Footbar existant) ── */}
            <div className='bg-white mb-8 border-t border-offwhite px-4 py-3 flex items-end gap-3 flex-shrink-0'>
                <textarea
                    value={ input }
                    onChange={ ( e ) => setInput( e.target.value ) }
                    onKeyDown={ handleKeyDown }
                    placeholder='Parler à Noctys...'
                    rows={ 1 }
                    className='flex-1 resize-none rounded-2xl border border-offwhite bg-offwhite px-4 py-3 text-sm text-primary placeholder-primary/40 outline-none focus:border-secondary-pink transition max-h-24 overflow-y-auto'
                />
                <button
                    onClick={ handleSend }
                    disabled={ !input.trim() || isLoading }
                    className='w-11 h-11 flex items-center justify-center rounded-full bg-secondary-orange text-white shadow disabled:opacity-40 disabled:cursor-not-allowed transition hover:bg-secondary-pink'
                >
                    <IoSend size={ 18 } />
                </button>
            </div>

        </div>
    );
};

export default InterfaceAi;