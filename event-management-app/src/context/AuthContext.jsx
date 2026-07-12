import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const decodeToken = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(window.atob(base64));
    } catch {
        return null;
    }
};

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [role, setRole] = useState(localStorage.getItem('role') || null);
    const [userId, setUserId] = useState(localStorage.getItem('userId') || null);

    const loginUser = (tokenData) => {
        const decoded = decodeToken(tokenData);

        const userRole = 
            decoded?.role || 
            decoded?.authorities?.[0]?.replace('ROLE_', '');

        const id =
            decoded?.userId ||
            decoded?.id ||
            decoded?.sub;

        
        setToken(tokenData);
        setRole(userRole);
        setUserId(id);

        localStorage.setItem('token', tokenData);

        if (userRole) {
            localStorage.setItem('role', userRole);
        }
        if (id){
            localStorage.setItem('userid', id);
        }
    };

    const logoutUser = () => {
        setToken(null);
        setRole(null);
        setUserId(null);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
    };

    return (
        <AuthContext.Provider value={{ token, role, userId, loginUser, logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);