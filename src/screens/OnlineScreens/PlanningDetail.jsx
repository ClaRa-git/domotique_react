import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom'
import { fetchPlanningDetail } from '../../store/planning/planningSlice';
import selectPlanningData from '../../store/planning/planningSelector';
import PageLoader from '../../components/Loader/PageLoader';
import { RiArrowLeftSFill } from 'react-icons/ri';
import { FaPen, FaRegTrashAlt } from 'react-icons/fa';

const PlanningDetail = () => {

	// Récupèration de l'ID du planning dans l'URL
	const param = useParams();
	const { id } = param;

	// Récupération du dispatch
	const dispatch = useDispatch();

	// State
	const [ isEditing, setIsEditing ] = useState( false );

	useEffect(() => {
		dispatch(fetchPlanningDetail( id ));
	}, [ dispatch, id ]);
  
	const { loadingPlanning, planningDetail } = useSelector( selectPlanningData );

	console.log( 'planningDetail', planningDetail );

	const handleEditPlanning = ( id ) => {
		console.log( 'handleEditPlanning' );
	}

	const handleDeletePlanning = ( id ) => {
		console.log( 'handleDeletePlanning' );
	}
  
  return ( loadingPlanning ? <PageLoader /> 
	:
    <div className='mb-16'>
      <div className='flex justify-between m-10' >
            <Link to='/planning' >
                <RiArrowLeftSFill
                    size={ 30 }
                    className='text-white bg-secondary-pink rounded-lg  h-10 w-10 cursor-pointer'
                />
            </Link>
            <div className='flex flex-col justify-center items-center mx-4' >
                <p className='font-bold text-3xl flex justify-center items-center' >
                    { planningDetail.label }
                </p>
            </div>
            <div className='flex flex-col justify-start mr-4' >
				<FaRegTrashAlt
					size={ 30 }
					className='bg-secondary-orange h-10 w-10 text-white rounded-lg p-2 cursor-pointer'
					onClick={ () => handleDeletePlanning( id ) }
				/>
				<FaPen
					size={ 30 }
					className='bg-secondary-orange h-10 w-10 text-white rounded-lg p-2 cursor-pointer mt-4'
					onClick={ () => handleEditPlanning( id ) }
				/>
			</div>
        </div>
    </div>
  )
}

export default PlanningDetail