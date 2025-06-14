import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const login = (userData) => {
        setUser(userData);
        setIsAuthenticated(true);
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
    };
    
    const updateUserPhoto = (photoUri) => {
        if (user) {
            setUser({ ...user, profilePic: photoUri });
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout, updateUserPhoto }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);