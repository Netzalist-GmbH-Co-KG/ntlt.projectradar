'use client';

import { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';

// Types
export interface Project {
  id: string;
  name: string;
  status: 'active' | 'pending' | 'completed' | 'archived';
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppState {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  selectedProject: Project | null;
}

export type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_PROJECTS'; payload: Project[] }
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'UPDATE_PROJECT'; payload: Project }
  | { type: 'DELETE_PROJECT'; payload: string }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_SELECTED_PROJECT'; payload: Project | null }
  | { type: 'RESET_STATE' };

// Initial state
const initialState: AppState = {
  projects: [],
  isLoading: false,
  error: null,
  searchQuery: '',
  selectedProject: null,
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_PROJECTS':
      return { ...state, projects: action.payload };
    case 'ADD_PROJECT':
      return { ...state, projects: [...state.projects, action.payload] };
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(project =>
          project.id === action.payload.id ? action.payload : project
        ),
      };
    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter(project => project.id !== action.payload),
      };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_SELECTED_PROJECT':
      return { ...state, selectedProject: action.payload };
    case 'RESET_STATE':
      return initialState;
    default:
      return state;
  }
}

// Context
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Helper functions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedProject: (project: Project | null) => void;
  resetState: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider
interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Helper functions with useCallback to prevent unnecessary re-renders
  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const addProject = useCallback((project: Project) => {
    dispatch({ type: 'ADD_PROJECT', payload: project });
  }, []);

  const updateProject = useCallback((project: Project) => {
    dispatch({ type: 'UPDATE_PROJECT', payload: project });
  }, []);

  const deleteProject = useCallback((id: string) => {
    dispatch({ type: 'DELETE_PROJECT', payload: id });
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  }, []);
  const setSelectedProject = useCallback((project: Project | null) => {
    dispatch({ type: 'SET_SELECTED_PROJECT', payload: project });
  }, []);

  const resetState = useCallback(() => {
    dispatch({ type: 'RESET_STATE' });
  }, []);

  const value: AppContextType = {
    state,
    dispatch,
    setLoading,
    setError,
    addProject,
    updateProject,
    deleteProject,
    setSearchQuery,
    setSelectedProject,
    resetState,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Hook
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
