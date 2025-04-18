import React from 'react'
import { MdArrowForwardIos } from 'react-icons/md'
import { Link } from 'react-router-dom'

// Créé un menu avec une icône, un label et un lien
const MenuCard = ( { icon, label, link } ) => {
	
	return (
		<Link to={ link } >
			<div className='p-4 rounded-lg bg-white text-primary w-full h-full' >
				<div className='flex flex-col items-start justify-between h-full' >
					<div className='rounded-full text-secondary-orange mb-4' >
						{ icon }
					</div>
					<div className='flex flex-row w-full justify-between items-center' >
						<p className='text-center text-xs sm:text-xl font-bold' >
							{ label }
						</p>
						<div className='rounded-full sm:px-4 flex items-center justify-center' >
							<MdArrowForwardIos
								size={ 24 }
								className='h-3 sm:visible'
							/>
						</div>
					</div>
				</div>
			</div>
		</Link>
	)
}

export default MenuCard