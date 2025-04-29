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
        
        if ( callable === 'function' ) {
            callable( true );
        }
    
        const fetchPlanningsByDate = async () => {
            const data = { date: formattedDate };
    
            try {
                const response = await axios.post(`${API_ROOT}/service-planning`, data, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
    
                const filteredPlannings = [];
    
                response.data.forEach(planning => {
                    const startDate = new Date(planning.dateStart);
                    const formattedStartDate = `${startDate.getFullYear()}-${(startDate.getMonth() + 1).toString().padStart(2, '0')}-${startDate.getDate().toString().padStart(2, '0')}`;
                    const endDate = new Date(planning.dateEnd);
                    const formattedEndDate = `${endDate.getFullYear()}-${(endDate.getMonth() + 1).toString().padStart(2, '0')}-${endDate.getDate().toString().padStart(2, '0')}`;
                    const nbReccurrence = recurrenceNumber(planning);
    
                    const currentDate = new Date(startDate);
    
                    while (currentDate <= endDate) {
                        const formattedCurrent = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
                        
                        if (formattedCurrent === formattedDate) {
                            filteredPlannings.push(planning);
                            break; // inutile de continuer, la date est trouvée
                        }
    
                        // On rajoute le date dans le tableau des dates
                        currentDate.setDate(currentDate.getDate() + nbReccurrence);
                    }
                });
    
                // On sette les plannings filtrés dans le state
                setPlanningsForDate(filteredPlannings);
    
            } catch (error) {
                console.error(`Erreur lors de la récupération des plannings : ${error}`);
            } finally {
                setIsLoading(false);

                if ( callable === 'function' ) {
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