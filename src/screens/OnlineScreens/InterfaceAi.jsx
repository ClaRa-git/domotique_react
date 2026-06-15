import React, { useEffect, useRef, useState } from 'react'
import { IoSend } from 'react-icons/io5'
import { FaCheck } from 'react-icons/fa'
import { API_ROOT } from '../../constants/apiConstant'
import useAiChat from '../../hooks/useAiChat'
import ChatBubble from '../../components/Ai/ChatBubble'
import ButtonLoader from '../../components/Loader/ButtonLoader'
import axios from 'axios'
import { USER_INFOS } from '../../constants/appConstant'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllVibesPlaying } from '../../store/vibe/vibeSlice'
import { fetchRoomsAvailable, fetchRoomsUnavailable } from '../../store/room/roomSlice'
import selectRoomData from '../../store/room/roomSelector'

const QUICK_SUGGESTIONS = [
    "Je me sens fatigué 😴",
    "Je veux une ambiance festive 🎉",
    "J'ai besoin de calme 🌿",
    "Je suis de bonne humeur 😊",
];

// Page de chat avec Noctys
//     Cette page vit dans <App> qui contient déjà Topbar + Footbar.
//     On n'utilise PAS h-screen ici — on remplit juste l'espace disponible.
const InterfaceAi = () => {

    const dispatch = useDispatch();

    const {
        messages,
        recommendedVibes,
        isLoading,
        sendMessage,
        resetChat
    } = useAiChat();

    const { roomsAvailable, roomsUnavailable } = useSelector( selectRoomData );

    const [ input, setInput ]               = useState( '' );
    const [ isActivating, setIsActivating ] = useState( false );
    const [ activatedId, setActivatedId ]   = useState( null );

    // Même logique que PopupMood
    const [ selectedVibe, setSelectedVibe ]     = useState( null );
    const [ selectedRoom, setSelectedRoom ]     = useState( null );
    const [ filteredRooms, setFilteredRooms ]   = useState( [] );

    const bottomRef = useRef( null );
    const imgIa     = `${ API_ROOT }/images/logo_ai.png`;

    useEffect( () => {
        dispatch( fetchRoomsAvailable() );
        dispatch( fetchRoomsUnavailable() );
    }, [ dispatch ] );

    useEffect( () => {
        bottomRef.current?.scrollIntoView( { behavior: 'smooth' } );
    }, [ messages, isLoading, recommendedVibes ] );

    // Réinitialise la sélection quand de nouvelles vibes arrivent
    useEffect( () => {
        console.log( '[InterfaceAi] recommendedVibes mis à jour :', recommendedVibes );
        if ( recommendedVibes.length > 0 ) {
            console.log( '[InterfaceAi] Détail de chaque vibe :' );
            recommendedVibes.forEach( ( vibe, i ) => {
                console.log( `  [Vibe ${ i }]`, {
                    id: vibe.id,
                    label: vibe.label,
                    score: vibe.score,
                    settings: vibe.settings,
                });
            });
        }
        setSelectedVibe( null );
        setSelectedRoom( null );
        setFilteredRooms( [] );
        setActivatedId( null );
    }, [ recommendedVibes ] );

    const handleSend = () => {
        if ( !input.trim() || isLoading ) return;
        sendMessage( input );
        setInput( '' );
    };

    const handleKeyDown = ( e ) => {
        if ( e.key === 'Enter' && !e.shiftKey ) {
            e.preventDefault();
            handleSend();
        }
    };

    // Même logique que getRoomsForVibe dans PopupMood
    const getRoomsForVibe = ( vibe ) => {
        const rooms = [ ...new Set( vibe.settings.map( s => s.roomId ) ) ];
        const filter = roomsAvailable.filter( room => rooms.includes( room.id ) );
        setFilteredRooms( filter );
    };

    const handleSelectVibe = ( vibe ) => {
        if ( selectedVibe?.id === vibe.id ) {
            console.log( '[InterfaceAi] handleSelectVibe — désélection de :', vibe.label );
            setSelectedVibe( null );
            setSelectedRoom( null );
            setFilteredRooms( [] );
        } else {
            console.log( '[InterfaceAi] handleSelectVibe — sélection de :', vibe );
            setSelectedVibe( vibe );
            setSelectedRoom( null );
            getRoomsForVibe( vibe );
        }
    };

    // Même logique que playVibe dans PopupMood
    const playVibe = async ( vibe, roomId ) => {
        const settings = vibe.settings.filter( s => s.roomId === roomId );

        try {
            setIsActivating( true );

            const userInfos = JSON.parse( localStorage.getItem( USER_INFOS ) );
            const token = userInfos?.token || null;

            await axios.post(
                `${ API_ROOT }/send-vibe`,
                { vibeId: vibe.id, settings, roomId },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { 'Authorization': `Bearer ${ token }` } : {})
                    }
                }
            );

            setActivatedId( vibe.id );
            setSelectedVibe( null );
            setSelectedRoom( null );
            setFilteredRooms( [] );
            dispatch( fetchAllVibesPlaying() );

        } catch ( err ) {
            console.error( 'Erreur activation vibe :', err );
        } finally {
            setIsActivating( false );
        }
    };

    const showSuggestions = messages.length === 1;

    return (
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

                        {/* Liste des vibes recommandées — même style que PopupMood */}
                        <div className={ `bg-primary text-white rounded-lg p-4 ${ selectedVibe ? 'rounded-b-none' : 'mb-4' }` }>
                            { recommendedVibes.map( ( vibe ) => {
                                const MAX_DISTANCE = Math.sqrt( 3 * 100 * 100 );
                                const scorePercent = Math.round( Math.max( 0, 1 - vibe.score / MAX_DISTANCE ) * 100 );
                                const isSelected = selectedVibe?.id === vibe.id;
                                return (
                                    <div
                                        key={ vibe.id }
                                        onClick={ () => handleSelectVibe( vibe ) }
                                        className={ `flex items-center justify-between px-3 py-2 rounded-lg mb-2 last:mb-0 cursor-pointer transition ${ isSelected ? 'bg-secondary-orange' : 'hover:bg-white/10' }` }
                                    >
                                        <div>
                                            <p className='font-bold text-sm'>{ vibe.label }</p>
                                            <p className='text-xs text-white/60'>{ scorePercent }% de correspondance</p>
                                        </div>
                                        { isSelected && <FaCheck size={ 14 } /> }
                                    </div>
                                );
                            })}
                        </div>

                        {/* Sélection de la pièce — même structure que PopupMood */}
                        { selectedVibe && (
                            <div className='bg-primary text-white rounded-b-lg p-4'>

                                { roomsUnavailable.length > 0 && (
                                    <div className='mb-3'>
                                        <p className='text-xs text-white/50 mb-1'>Pièces occupées :</p>
                                        <div className='flex flex-wrap gap-2'>
                                            { roomsUnavailable.map( room => (
                                                <span key={ room.id } className='text-xs text-white/40 border border-white/20 px-3 py-1 rounded-full'>
                                                    { room.label }
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                { filteredRooms.length > 0 ? (
                                    <>
                                        <p className='text-xs text-white/70 mb-2'>Dans quelle pièce ?</p>
                                        <div className='flex flex-wrap gap-2 mb-4'>
                                            { filteredRooms.map( room => (
                                                <div
                                                    key={ room.id }
                                                    onClick={ () => setSelectedRoom( selectedRoom === room.id ? null : room.id ) }
                                                    className={ `cursor-pointer text-xs font-bold px-3 py-1.5 rounded-full transition ${ selectedRoom === room.id ? 'bg-secondary-orange' : 'bg-white/10 hover:bg-white/20' }` }
                                                >
                                                    { room.label }
                                                </div>
                                            ))}
                                        </div>
                                        <div className='flex justify-center'>
                                            { isActivating ? (
                                                <ButtonLoader />
                                            ) : (
                                                <button
                                                    onClick={ () => playVibe( selectedVibe, selectedRoom ) }
                                                    disabled={ !selectedRoom }
                                                    className='bg-secondary-orange font-bold px-6 py-2 rounded-lg text-sm transition hover:bg-secondary-pink disabled:opacity-40 disabled:cursor-not-allowed'
                                                >
                                                    Valider
                                                </button>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <p className='text-xs text-white/50 text-center py-1'>Aucune pièce disponible pour cette ambiance</p>
                                )}
                            </div>
                        )}

                        { activatedId && (
                            <p className='text-xs text-secondary-orange font-bold mt-3 text-center'>
                                ✓ Ambiance activée !
                            </p>
                        )}
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
