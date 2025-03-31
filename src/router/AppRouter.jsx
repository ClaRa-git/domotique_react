import React, { createContext } from 'react'

// création d'un mini contexte pour la session
const SessionContext = createContext({ inSession: false })

// création d'un hook personnalisé pour utiliser le contexte de session
export const useSession = () => useContext(SessionContext)

const AppRouter = () => {
  return (
    <div>AppRouter</div>
  )
}

export default AppRouter