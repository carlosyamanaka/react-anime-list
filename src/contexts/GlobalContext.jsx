import { createContext, useContext } from 'react';

// Criando o contexto
export const GlobalContext = createContext({});

// Hook personalizado para usar o contexto
export const useGlobalContext = () => {
    const context = useContext(GlobalContext);

    if (!context) {
        throw new Error('useGlobalContext deve ser usado dentro de um GlobalContextProvider');
    }

    return context;
};
