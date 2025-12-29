import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

export const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: true,

            // Initialize auth state
            init: async () => {
                const token = get().token;
                if (token) {
                    try {
                        const response = await api.get('/auth/me');
                        set({
                            user: response.data.data,
                            isAuthenticated: true,
                            isLoading: false
                        });
                    } catch (error) {
                        set({
                            user: null,
                            token: null,
                            isAuthenticated: false,
                            isLoading: false
                        });
                    }
                } else {
                    set({ isLoading: false });
                }
            },

            // Login
            login: async (email, password) => {
                const response = await api.post('/auth/login', { email, password });
                const { user, token } = response.data.data;

                set({
                    user,
                    token,
                    isAuthenticated: true,
                    isLoading: false
                });

                return response.data;
            },

            // Register
            register: async (email, password, fullName) => {
                const response = await api.post('/auth/register', {
                    email,
                    password,
                    fullName
                });
                const { user, token } = response.data.data;

                set({
                    user,
                    token,
                    isAuthenticated: true,
                    isLoading: false
                });

                return response.data;
            },

            // Logout
            logout: () => {
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false
                });
            },

            // Update user data
            updateUser: (userData) => {
                set({ user: { ...get().user, ...userData } });
            },

            // Update credits
            updateCredits: (credits) => {
                set({ user: { ...get().user, credits } });
            },
        }),
        {
            name: 'webcraft-auth',
            partialize: (state) => ({
                token: state.token,
                user: state.user,
                isAuthenticated: state.isAuthenticated
            }),
        }
    )
);

// Initialize auth on app load
if (typeof window !== 'undefined') {
    useAuthStore.getState().init();
}
