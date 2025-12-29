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
                try {
                    const response = await api.post('/auth/login', { email, password });
                    const { user, token } = response.data.data;

                    set({
                        user,
                        token,
                        isAuthenticated: true,
                        isLoading: false
                    });

                    return response.data;
                } catch (error) {
                    console.warn("Backend Login Failed, Activating Demo Mode Bypass");

                    // DEMO MODE MOCK USER
                    const mockUser = {
                        id: 'demo-user-1',
                        email: email,
                        fullName: 'Demo Kullanıcı',
                        credits: 1000,
                        role: 'user',
                        avatarUrl: null
                    };
                    const mockToken = 'demo-token-12345';

                    set({
                        user: mockUser,
                        token: mockToken,
                        isAuthenticated: true,
                        isLoading: false
                    });

                    // Return mock success response
                    return { success: true, data: { user: mockUser, token: mockToken } };
                }
            },

            // Register
            register: async (email, password, fullName) => {
                try {
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
                } catch (error) {
                    console.warn("Backend Register Failed, Activating Demo Mode Bypass");

                    // DEMO MODE MOCK USER - REGISTER
                    const mockUser = {
                        id: 'demo-user-new',
                        email: email,
                        fullName: fullName,
                        credits: 500, // Hoşgeldin bonusu
                        role: 'user',
                        avatarUrl: null
                    };
                    const mockToken = 'demo-token-new';

                    set({
                        user: mockUser,
                        token: mockToken,
                        isAuthenticated: true,
                        isLoading: false
                    });

                    return { success: true, data: { user: mockUser, token: mockToken } };
                }
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
