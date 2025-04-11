import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import HelloUser from '../../../components/Ui/HelloUser';
import { useDispatch, useSelector } from 'react-redux';
import { useAuthContext } from '../../../contexts/AuthContext';
import { fetchUserDetail } from '../../../store/user/userSlice';
import selectUserData from '../../../store/user/userSelector';
import { FiLogOut } from 'react-icons/fi';

const Logout = () => {
  const { signOut } = useAuthContext();
  const navigate = useNavigate();
  //on crée la méthode de deconnexion
  const handleLogout = async () => {
    await signOut();

    navigate('/');
  }
  return (
    <button onClick={() => {
      const confirmLogout = window.confirm('Voulez-vous vraiment vous déconnecter ?');
      if (confirmLogout) handleLogout();
    }}
      className='flex bg-secondary-orange text-white rounded-lg p-2 items-center justify-center'>
        <FiLogOut className='w-6 h-6 mr-2' />
        <p>Log out</p>
    </button>
  )
}

const Account = () => {

  const params = useParams();
  const userId = params.id;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserDetail(userId));
  }, [dispatch, userId]);

  const { userDetail, loading } = useSelector(selectUserData);

  return (
    <div>
      <HelloUser username={userDetail.username} />
      <div className='m-5'>
          <Logout />
      </div>
    </div>
  )
}

export default Account