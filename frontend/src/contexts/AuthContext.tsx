import React, { createContext, useState, ReactNode, useEffect } from 'react';
import api from '../services/api';

interface AuthContextType {
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
    token: null,
    login: async () => {}, // porque async? quero que faça primeiro o login e depois o logout
    logout: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        setToken(storedToken);
    }, []); // armazenamento do token no estado

    const login = async (email: string, password: string) => {
        try {
            const response = await api.post('/login', {
                email,
                password,
            });
            const token = response.data.token;
            setToken(token);
            localStorage.setItem('token', token);
        } catch (err: any) {
            console.error(err);
        }
    };

    const logout = () => {
        setToken(null);
        localStorage.removeItem('token');
    };

    useEffect(() => {
        const verifyToken = async () => {
            if (token) {
                try {
                    await api.get('/verify-token', {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                } catch (err) {
                    logout();
                }
            }
        };
        verifyToken();
    }, [token]);

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}