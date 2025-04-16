import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import MenuBar from '../../components/Ui/MenuBar';
import { FaPlus } from 'react-icons/fa6';
import SwitchToggle from '../../components/Ui/SwitchToggle';

const Planning = () => {
    const [date, setDate] = useState(new Date());
	const [isVisible, setIsVisible] = useState(false);
	const [dateStart, setDateStart] = useState(new Date());
	const [dateEnd, setDateEnd] = useState(new Date());
	const [switchOn, setSwitchOn] = useState(false);
	const [allDay, setAllDay] = useState(false);

	console.log('a',dateStart);
	console.log('b',dateEnd);

    const tileContent = ({ date: d, view }) => {
        const dots = [];
        return view === 'month' && dots.includes(d.getDate()) ? (
            <div className="w-1 h-1 bg-orange-400 rounded-full mx-auto mt-1" />
        ) : null;
    };

    const handleClick = () => {
		setIsVisible(!isVisible);
    }

	const handleSwitch = (data) => {
		setSwitchOn(data);
		if (data) {
			setAllDay(true);
		} else {
			setAllDay(false);
		}
	}

    return (
        <div className='flex flex-col justify-center mb-16'>
          	<MenuBar />
          	<div>
            	<div className='flex flex-col justify-center items-center mt-4'>
              		<div className="bg-[#eee4df] p-4 rounded-xl w-fit shadow-md">
						<Calendar
							onChange={setDate}
							value={date}
							locale="fr-FR"
							tileContent={tileContent}
							nextLabel="▶"
							prevLabel="◀"
							formatShortWeekday={(locale, date) =>
								date.toLocaleDateString(locale, { weekday: 'short' }).slice(0, 3)
							}
							className="REACT-CALENDAR"
						/>
              		</div>
              		<div className="w-full">
						<div onClick={handleClick} className={`flex flex-row justify-between bg-primary text-white mt-4 mx-4 px-4 py-4 ${isVisible ? 'rounded-t-lg' : 'rounded-lg'}`}>
							<p>Créer un nouvel évènement...</p>
							<FaPlus className='mt-1'/>
						</div>
						{
							isVisible &&
							<div className='flex flex-row justify-between bg-primary text-white mx-4 px-4 py-1 rounded-b-lg'>
								<div className="w-full my-4">
									<form>
										<div className='flex justify-between mb-4'>
											<p>Jour entier</p>
											<SwitchToggle 
												sendToParent={handleSwitch}
											/>
										</div>
										<hr />
										{
											allDay ?
											<div>
												<div className='flex justify-between my-4'>
													<label htmlFor="dateStart">Date</label>
													<input type="date" name="dateStart" id="dateStart" onChange={(e) => {setDateStart(e.target.value); setDateEnd(e.target.value)} }/>
												</div>
											</div>
											:
											<div>
												<div className='flex justify-between my-4'>
													<label htmlFor="dateStart">Début</label>
													<input type="datetime-local" name="dateStart" id="dateStart" onChange={(e) => {setDateStart(e.target.value)} }/>
												</div>
												<div className='flex justify-between my-4'>
													<label htmlFor="dateEnd">Fin</label>
													<input type="datetime-local" name="dateEnd" id="dateEnd" onChange={(e) => {setDateEnd(e.target.value)} }/>
												</div>
											</div>
										}
										<hr />
										<div className='flex justify-between items-center my-4'>
											<label htmlFor="recurrence">Récurrence</label>
											<select name="recurrence" id="recurrence" className='bg-primary rounded py-2 px-3'>
												<option value="none">Aucune</option>
												<option value="daily">Quotidien</option>
												<option value="weekly">Hebdomadaire</option>
												<option value="monthly">Mensuel</option>
											</select>
										</div>
										<div className='bg-offwhite text-primary mt-4 mx-2 px-4 py-2 rounded-lg'>
											<p>Lier l'évènement à une ambiance...</p>
										</div>
										<div className='bg-offwhite text-primary mt-4 mx-2 px-4 py-2 rounded-lg'>
											<p>Lier l'évènement à une pièce...</p>
										</div>
										<div className='flex items-center justify-between p-4'>
											<button type='submit' className='bg-secondary-orange font-bold p-3 rounded-lg transition'>
												Ajouter
											</button>
											<button type='button' className='bg-secondary-pink p-3 mt-2 rounded-lg transition'>
												Annuler
											</button>
										</div>
									</form>
								</div>
							</div>
						}
              		</div>
            	</div>
          	</div>
        </div>
    );
};

export default Planning;
