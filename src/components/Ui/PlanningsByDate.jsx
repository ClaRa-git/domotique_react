import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { API_ROOT } from '../../constants/apiConstant';
import { Link } from 'react-router-dom';
import { RiArrowRightSFill } from 'react-icons/ri';

const PlanningsByDate = ({ date, callable }) => {
    const [planningsForDate, setPlanningsForDate] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const daysOfWeek = [
        'Dimanche',
        'Lundi',
        'Mardi',
        'Mercredi',
        'Jeudi',
        'Vendredi',
        'Samedi'
    ];

    // Fonction utilitaire : date à minuit (évite les problèmes de fuseau horaire)
    const getDateAtMidnight = (dateStr) => {
        const date = new Date(dateStr);
        date.setHours(0, 0, 0, 0);
        return date.getTime();
    };

    // Date cible (celle passée en prop), formatée à minuit
    const targetDateTime = useMemo(() => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
    }, [date]);

    const dateObj = useMemo(() => new Date(date), [date]);

    // Fonction utilitaire : formate une date au format YYYY-MM-DD
    const toLocalYYYYMMDD = (dateInput) => {
        const date = new Date(dateInput); // accepte un Date ou une string
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };    

    useEffect(() => {
        const fetchPlanningsByDate = async () => {
            setIsLoading(true);
            if (typeof callable === 'function') {
                callable(true);
            }

            try {
                const day = new Date(date).getDay();
                const dayName = daysOfWeek[day === 0 ? 6 : day - 1];
                const formatedDate = toLocalYYYYMMDD(date);

                const response = await axios.post(`${API_ROOT}/service-planning`,
                    { 
                        date:formatedDate,
                        day: dayName,
                    },
                    {
                        headers: { 'Content-Type': 'application/json' }
                    }
                );

                setPlanningsForDate(response.data.plannings);
            } catch (error) {
                console.error('Erreur lors de la récupération des plannings :', error.response || error.message || error);
            } finally {
                setIsLoading(false);
                if (typeof callable === 'function') {
                    callable(false);
                }
            }
        };

        fetchPlanningsByDate();
    }, [targetDateTime, callable]);

    // Fonction pour gérer les labels de récurrence
	const recurrenceLabels = {
		none: "Ponctuel",
		daily: "Quotidien",
		weekly: "Hebdomadaire",
		monthly: "Mensuel",
	};

    return (
        isLoading ? (
            <div>Chargement ...</div>
        ) : (
            <div>
                {planningsForDate.length > 0 ? (
                    <div>
                        <p className='text-center text-primary font-bold text-2xl mt-4' >
                            Evènements
                        </p>
                        <p className="text-center text-primary font-bold text-2xl mt-4">
                            {planningsForDate.length} évènement(s) le {dateObj.toLocaleDateString('fr-FR', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                        <div>
                            {planningsForDate.map((event, index) => (
                                <Link
                                    to={ `/planning/${ event.id }` }
                                    key={ index }
                                >
                                    <div className='flex justify-between bg-offwhite text-primary mt-4 mx-2 px-4 py-2 rounded-lg' >
                                        <div className='flex justify-between items-center' >
                                            <p className='text-lg font-bold mx-4' >
                                                { event.label }
                                            </p>
                                            <p className='text-sm mx-4' >
                                                    ( { recurrenceLabels[ event.recurrence ] } )
                                            </p>
                                            <p className='text-sm' >
                                                { new Date( event.dateStart ).toLocaleDateString( 'fr-FR' ) }
                                            </p>
                                        </div>
                                        <RiArrowRightSFill
                                            size={ 24 }
                                        />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-primary font-bold text-2xl mt-4">
                    </p>
                )}
            </div>
        )
    );
};

export default PlanningsByDate;
