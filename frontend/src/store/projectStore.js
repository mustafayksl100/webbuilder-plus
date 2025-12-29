import { create } from 'zustand';
import api from '../services/api';

export const useProjectStore = create((set, get) => ({
    projects: [],
    currentProject: null,
    isLoading: false,
    error: null,

    // Fetch all projects
    fetchProjects: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get('/projects');
            set({ projects: response.data.data.projects, isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    // Fetch single project
    fetchProject: async (projectId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get(`/projects/${projectId}`);
            set({ currentProject: response.data.data, isLoading: false });
            return response.data.data;
        } catch (error) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    // Create new project
    createProject: async (projectData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post('/projects', projectData);
            const newProject = response.data.data;
            set((state) => ({
                projects: [newProject, ...state.projects],
                isLoading: false
            }));
            return newProject;
        } catch (error) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    // Update project
    updateProject: async (projectId, projectData) => {
        try {
            const response = await api.put(`/projects/${projectId}`, projectData);
            const updatedProject = response.data.data;

            set((state) => ({
                projects: state.projects.map(p =>
                    p.id === projectId ? updatedProject : p
                ),
                currentProject: state.currentProject?.id === projectId
                    ? updatedProject
                    : state.currentProject
            }));

            return updatedProject;
        } catch (error) {
            throw error;
        }
    },

    // Delete project
    deleteProject: async (projectId) => {
        try {
            await api.delete(`/projects/${projectId}`);
            set((state) => ({
                projects: state.projects.filter(p => p.id !== projectId),
                currentProject: state.currentProject?.id === projectId
                    ? null
                    : state.currentProject
            }));
        } catch (error) {
            throw error;
        }
    },

    // Duplicate project
    duplicateProject: async (projectId) => {
        try {
            const response = await api.post(`/projects/${projectId}/duplicate`);
            const duplicatedProject = response.data.data;
            set((state) => ({
                projects: [duplicatedProject, ...state.projects]
            }));
            return duplicatedProject;
        } catch (error) {
            throw error;
        }
    },

    // Update project content (for builder)
    updateProjectContent: (content) => {
        set((state) => ({
            currentProject: state.currentProject
                ? { ...state.currentProject, content }
                : null
        }));
    },

    // Update project settings (for builder)
    updateProjectSettings: (settings) => {
        set((state) => ({
            currentProject: state.currentProject
                ? { ...state.currentProject, settings: { ...state.currentProject.settings, ...settings } }
                : null
        }));
    },

    // Clear current project
    clearCurrentProject: () => {
        set({ currentProject: null });
    },
}));
