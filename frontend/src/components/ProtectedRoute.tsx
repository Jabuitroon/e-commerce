import { Navigate } from 'react-router-dom'

interface Props {
    IsAllowed: boolean,
    children: React.ReactNode
}

export const ProtectedRoute = ({IsAllowed, children}: Props) =>{
    if (!IsAllowed) return <Navigate to='/login' />
    return (children)
}