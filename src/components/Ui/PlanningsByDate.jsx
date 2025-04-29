import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import selectPlanningData from '../../store/planning/planningSelector';
import axios from 'axios';
import { API_ROOT } from '../../constants/apiConstant';
const PlanningsByDate = ( { date, callable } ) => {

    const [ planningsForDate, setPlanningsForDate ] = useState( [] );

    const [ isLoading, setIsLoading ] = useState( true );

    // Récupération de la date au format YYYY-MM-DD
    const dateObj = new Date( date );
    const formattedDate = `${ dateObj.getFullYear() }-${ ( dateObj.getMonth() + 1).toString().padStart( 2, '0' ) }-${ dateObj.getDate().toString().padStart( 2, '0' ) }`;

    // Calcul du nombre de jours de récurrence
    const recurrenceNumber = ( planning ) => {
        const recurrence = planning.recurrence;

        switch (recurrence) {
            case 'daily':
                return 1;
            case 'weekly':
                return 7;
            case 'monthly':
                return 30;
            case 'none':
                return 0;
            default:
                return -1;
        }
    }

    // Récupération des plannings par date
	useEffect(() => {
        setIsLoading(true);
        
        if ( typeof callable === 'function' ) {
            callable( true );
        }
    
        const fetchPlanningsByDate = async () => {
            const data = { date: formattedDate };
            setPlanningsForDate( [] );
    
            try {
                const response = await axios.post(`${API_ROOT}/service-planning`, data, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
    
                const plannings = response.data.plannings;

                plannings.forEach( planning => {
                    setPlanningsForDate( [ ...planningsForDate, planning ] );
                });
    
            } catch (error) {
                console.error(`Erreur lors de la récupération des plannings : ${error}`);
            } finally {
                setIsLoading(false);

                if ( typeof callable === 'function' ) {
                    callable( false );
                }
            }
        };
    
        fetchPlanningsByDate();
    }, [formattedDate]);

  return ( isLoading ? <div>Chargement ...</div>
  :
    <div>
        {
            planningsForDate.length > 0 ?
            <p className='text-center text-primary font-bold text-2xl mt-4' >
                { planningsForDate.length } évènement(s) le { dateObj.toLocaleDateString( 'fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' } ) }
            </p>
            :
            <p className='text-center text-primary font-bold text-2xl mt-4' >
                Aucun évènement le { dateObj.toLocaleDateString( 'fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' } ) }
            </p>
        }
    </div>
  )
}

export default PlanningsByDate