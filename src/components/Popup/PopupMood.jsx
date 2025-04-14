import React, { useState, useEffect } from 'react';
import CustomInput from '../Ui/CustomInput';
import ButtonLoader from '../Loader/ButtonLoader';

const PopupMood = ({ data, callable, sentToParent }) => {
    const [mood, setMood] = useState(data.mood || 50);
    const [stress, setStress] = useState(data.stress || 50);
    const [tonus, setTonus] = useState(data.tonus || 50);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fonction qui calcule l'humeur
    const determineMood = (mood, tonus, stress) => {
        mood = parseInt(mood, 10);
        tonus = parseInt(tonus, 10);
        stress = parseInt(stress, 10);

        let score = (mood + tonus - stress);

        // Calcul du moral en fonction du score
        let result = '';
        if (score >= 200) {
            result = "Excellente humeur";
        } else if (score >= 150) {
            result = "Bonne humeur";
        } else if (score >= 100) {
            result = "Humeur neutre";
        } else if (score >= 50) {
            result = "Fatigué";
        } else if (score >= 0) {
            result = "Triste";
        } else {
            result = "Très stressé";
        }

        return result;  // On retourne directement le résultat
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Appeler la fonction de calcul et obtenir le moral
        const calculatedMoral = determineMood(mood, tonus, stress);

        // Fonction pour enregistrer les données dans localStorage
        const saveToLocalStorage = () => {
            const userMoodData = { mood, stress, tonus, calculatedMoral };
            localStorage.setItem('userMood', JSON.stringify(userMoodData)); // Sauvegarde dans le localStorage
        };

        // Passer directement la donnée au parent via sentToParent
        sentToParent({
            calculatedMoral,
            mood,
            tonus,
            stress
        });

        // Enregistrer les données dans localStorage
        saveToLocalStorage();

        // Appeler la fonction callable pour fermer la popup
        callable();
    };

    // Fonction pour charger les données du localStorage quand le composant se monte
    useEffect(() => {
        const savedMoodData = JSON.parse(localStorage.getItem('userMood'));
        if (savedMoodData) {
            setMood(savedMoodData.mood || 50);
            setStress(savedMoodData.stress || 50);
            setTonus(savedMoodData.tonus || 50);
        }
    }, []);

    return (
        <div className='z-30 absolute top-0 right-0 bottom-0 left-0 backdrop-blur flex items-center justify-center'>
            <div className="flex flex-col relative w-full sm:w-2/3 lg:w-1/2 h-1/2 rounded-2xl justify-center items-center bg-primary">
                <h1 className='text-white mt-4 text-2xl font-bold'>Quelle est votre humeur ?</h1>
                <div className='flex flex-col items-center justify-center w-2/3 h-full'>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-row align-center">
                            <CustomInput
                                state={mood}
                                label={'Humeur'}
                                type={'range'}
                                callable={(e) => setMood(e.target.value)}
                            />
                            <div className='flex items-center justify-center'>
                                <p className='text-white font-bold mb-2 mt-4 ml-4 w-10'>{mood}</p>
                            </div>
                        </div>
                        <div className="flex flex-row align-center">
                            <CustomInput
                                state={stress}
                                label={'Stress'}
                                type={'range'}
                                callable={(e) => setStress(e.target.value)}
                            />
                            <div className='flex items-center justify-center'>
                                <p className='text-white font-bold mb-2 mt-4 ml-4 w-10'>{stress}</p>
                            </div>
                        </div>
                        <div className="flex flex-row align-center">
                            <CustomInput
                                state={tonus}
                                label={'Tonus'}
                                type={'range'}
                                callable={(e) => setTonus(e.target.value)}
                            />
                            <div className='flex items-center justify-center'>
                                <p className='text-white font-bold mb-2 mt-4 ml-4 w-10'>{tonus}</p>
                            </div>
                        </div>
                        {error && <p className='text-red-500 text-center text-sm m-4'>{error}</p>}
                        <div className='flex justify-center'>
                            {isLoading ? (
                                <ButtonLoader />
                            ) : (
                                <div>
                                    <button type='submit' className='w-full bg-secondary-orange font-bold py-3 rounded-lg transition'>
                                        Valider
                                    </button>
                                    <button type='button' onClick={callable} className='w-full bg-secondary-pink font-bold py-3 mt-2 rounded-lg transition'>
                                        Annuler
                                    </button>
                                </div>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
};

export default PopupMood;
