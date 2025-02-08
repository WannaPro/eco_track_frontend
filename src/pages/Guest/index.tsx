import React, { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext';

const Guest: React.FC = () => {

    const { user } = useContext(AuthContext);

    if (user && user.token) return <Navigate to="/usuario" />

    return <Outlet />
}

export default Guest;