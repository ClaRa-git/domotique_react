import React from 'react'

const HelloUser = ( { username } ) => {
	
	return (
		<div className='m-4 justify-start font-bold text-[50px]'>
			<p>
				Hello,
			</p>
			<p>
				{ username ? username : 'User' }
			</p>
		</div>
	)
}

export default HelloUser