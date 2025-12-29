import { create } from 'zustand';

// Builder store for managing the site builder state
export const useBuilderStore = create((set, get) => ({
    // Selected component
    selectedComponent: null,

    // Components in canvas
    components: [],

    // Preview mode: 'desktop', 'tablet', 'mobile'
    previewMode: 'desktop',

    // Show/hide panels
    showComponentPanel: true,
    showPropertyPanel: true,

    // Undo/Redo history
    history: [],
    historyIndex: -1,

    // Saving state
    isSaving: false,
    hasUnsavedChanges: false,

    // Set components
    setComponents: (components) => {
        const currentState = get();

        // Add to history
        const newHistory = currentState.history.slice(0, currentState.historyIndex + 1);
        newHistory.push(components);

        set({
            components,
            history: newHistory,
            historyIndex: newHistory.length - 1,
            hasUnsavedChanges: true
        });
    },

    // Add component
    addComponent: (component, index = null) => {
        const currentComponents = get().components;
        const newComponents = index !== null
            ? [...currentComponents.slice(0, index), component, ...currentComponents.slice(index)]
            : [...currentComponents, component];

        get().setComponents(newComponents);
    },

    // Update component
    updateComponent: (componentId, updates) => {
        const newComponents = get().components.map(comp =>
            comp.id === componentId ? { ...comp, ...updates } : comp
        );
        get().setComponents(newComponents);
    },

    // Delete component
    deleteComponent: (componentId) => {
        const newComponents = get().components.filter(comp => comp.id !== componentId);
        get().setComponents(newComponents);

        if (get().selectedComponent?.id === componentId) {
            set({ selectedComponent: null });
        }
    },

    // Move component
    moveComponent: (fromIndex, toIndex) => {
        const components = [...get().components];
        const [removed] = components.splice(fromIndex, 1);
        components.splice(toIndex, 0, removed);
        get().setComponents(components);
    },

    // Duplicate component
    duplicateComponent: (componentId) => {
        const components = get().components;
        const componentIndex = components.findIndex(c => c.id === componentId);

        if (componentIndex !== -1) {
            const originalComponent = components[componentIndex];
            const duplicatedComponent = {
                ...originalComponent,
                id: `${originalComponent.type}-${Date.now()}`
            };

            get().addComponent(duplicatedComponent, componentIndex + 1);
        }
    },

    // Select component
    selectComponent: (component) => {
        set({ selectedComponent: component });
    },

    // Clear selection
    clearSelection: () => {
        set({ selectedComponent: null });
    },

    // Set preview mode
    setPreviewMode: (mode) => {
        set({ previewMode: mode });
    },

    // Toggle panels
    toggleComponentPanel: () => {
        set((state) => ({ showComponentPanel: !state.showComponentPanel }));
    },

    togglePropertyPanel: () => {
        set((state) => ({ showPropertyPanel: !state.showPropertyPanel }));
    },

    // Undo
    undo: () => {
        const { history, historyIndex } = get();
        if (historyIndex > 0) {
            set({
                components: history[historyIndex - 1],
                historyIndex: historyIndex - 1,
                hasUnsavedChanges: true
            });
        }
    },

    // Redo
    redo: () => {
        const { history, historyIndex } = get();
        if (historyIndex < history.length - 1) {
            set({
                components: history[historyIndex + 1],
                historyIndex: historyIndex + 1,
                hasUnsavedChanges: true
            });
        }
    },

    // Can undo/redo
    canUndo: () => get().historyIndex > 0,
    canRedo: () => get().historyIndex < get().history.length - 1,

    // Set saving state
    setSaving: (isSaving) => set({ isSaving }),

    // Mark as saved
    markAsSaved: () => set({ hasUnsavedChanges: false }),

    // Reset builder state
    reset: () => {
        set({
            selectedComponent: null,
            components: [],
            previewMode: 'desktop',
            showComponentPanel: true,
            showPropertyPanel: true,
            history: [],
            historyIndex: -1,
            isSaving: false,
            hasUnsavedChanges: false
        });
    },

    // Initialize with existing content
    initializeFromProject: (project) => {
        const content = typeof project.content === 'string'
            ? JSON.parse(project.content)
            : project.content;

        const components = content.components || [];

        set({
            components,
            history: [components],
            historyIndex: 0,
            hasUnsavedChanges: false
        });
    },
}));
