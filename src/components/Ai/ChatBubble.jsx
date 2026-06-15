import React from 'react'
import { API_ROOT } from '../../constants/apiConstant'

// Transforme le markdown basique en JSX (gras, retours à la ligne, tirets)
const parseContent = ( text ) => {
    return text.split( '\n' ).map( ( line, i ) => {
        // Ligne vide → espace
        if ( !line.trim() ) return <br key={ i } />;

        // Remplace **texte** par <strong>
        const parts = line.split( /\*\*(.*?)\*\*/g );
        const formatted = parts.map( ( part, j ) =>
            j % 2 === 1 ? <strong key={ j }>{ part }</strong> : part
        );

        return <p key={ i } className='mb-1'>{ formatted }</p>;
    });
};

// Bulle de message — user (droite, orange) ou noctys (gauche, primary)
const ChatBubble = ( { message } ) => {

    const isUser = message.role === 'user';
    const imgIa  = `${ API_ROOT }/images/logo_ai.png`;

    if ( isUser ) {
        return (
            <div className='flex justify-end mb-3 px-4'>
                <div className='max-w-[75%] bg-secondary-orange text-white rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed shadow-sm'>
                    { message.content }
                </div>
            </div>
        );
    }

    return (
        <div className='flex items-end gap-2 mb-3 px-4'>
            {/* Avatar Noctys */}
            <div className='flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow'>
                <img
                    src={ imgIa }
                    alt='Noctys'
                    className='w-5 h-5 object-contain'
                />
            </div>

            {/* Bulle */}
            <div className='max-w-[75%] bg-primary text-white rounded-2xl rounded-bl-sm px-4 py-3 text-sm leading-relaxed shadow-sm'>
                { parseContent( message.content ) }
            </div>
        </div>
    );
};

export default ChatBubble;