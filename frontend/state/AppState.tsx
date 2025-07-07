import { useState, createContext, useContext, useEffect } from 'react';
import { modulesApi, itemsApi } from '../services/api';

export interface Module {
  id: string;
  name: string;
  createdAt: string;
  type: 'groceries' | 'todo' | 'bucketlist';
  items: { id: string; text: string; completed: boolean; timeframe?: string }[];
  itemCount?: number;
  completedCount?: number;
}

const AppStateContext = createContext<{ 
  modules: Module[]; 
  loading: boolean;
  error: string | null;
  addModule: (name: string, type: 'groceries' | 'todo' | 'bucketlist') => Promise<void>; 
  addItemToModule: (moduleId: string, text: string, timeframe?: string) => Promise<void>;
  toggleItemComplete: (moduleId: string, itemId: string) => Promise<void>;
  clearCompletedItems: (moduleId: string) => Promise<void>;
  deleteModule: (moduleId: string) => Promise<void>;
  editModule: (moduleId: string, newName: string, newDate?: string) => Promise<void>;
  deleteAllItems: (moduleId: string) => Promise<void>;
  refreshModules: () => Promise<void>;
}>({ 
  modules: [], 
  loading: false,
  error: null,
  addModule: async () => {}, 
  addItemToModule: async () => {}, 
  toggleItemComplete: async () => {}, 
  clearCompletedItems: async () => {}, 
  deleteModule: async () => {}, 
  editModule: async () => {}, 
  deleteAllItems: async () => {},
  refreshModules: async () => {},
});

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load modules on component mount
  useEffect(() => {
    refreshModules();
  }, []);

  const refreshModules = async () => {
    try {
      setLoading(true);
      setError(null);
      const modulesData = await modulesApi.getAll();
      // Ensure each module has an items array
      const modulesWithItems = modulesData.map((module: any) => ({
        ...module,
        items: module.items || []
      }));
      setModules(modulesWithItems);
    } catch (err) {
      console.error('Failed to load list modules:', err);
      setError('Failed to load modules. Please check if the backend server is running. \n(Contact your boyfriend)');
    } finally {
      setLoading(false);
    }
  };

  const addModule = async (name: string, type: 'groceries' | 'todo' | 'bucketlist') => {
    try {
      setError(null);
      const newModule = await modulesApi.create(name, type);
      setModules(prevModules => [...prevModules, newModule]);
    } catch (err) {
      console.error('Failed to create module:', err);
      setError('Failed to create module. Please try again.');
      throw err;
    }
  };

  const addItemToModule = async (moduleId: string, text: string, timeframe?: string) => {
    try {
      setError(null);
      const newItem = await itemsApi.create(moduleId, text, timeframe);
      
      setModules(prevModules =>
        prevModules.map(module =>
          module.id === moduleId
            ? { ...module, items: [...module.items, newItem] }
            : module
        )
      );
    } catch (err) {
      console.error('Failed to add item:', err);
      setError('Failed to add item. Please try again.');
      throw err;
    }
  };

  const toggleItemComplete = async (moduleId: string, itemId: string) => {
    try {
      setError(null);
      const result = await itemsApi.toggle(itemId);
      
      setModules(prevModules =>
        prevModules.map(module =>
          module.id === moduleId
            ? { 
                ...module, 
                items: module.items.map(item => 
                  item.id === itemId 
                    ? { ...item, completed: result.completed }
                    : item
                ) 
              }
            : module
        )
      );
    } catch (err) {
      console.error('Failed to toggle item:', err);
      setError('Failed to update item. Please try again.');
      throw err;
    }
  };

  const clearCompletedItems = async (moduleId: string) => {
    try {
      setError(null);
      await itemsApi.deleteCompleted(moduleId);
      
      setModules(prevModules =>
        prevModules.map(module =>
          module.id === moduleId
            ? { ...module, items: module.items.filter(item => !item.completed) }
            : module
        )
      );
    } catch (err) {
      console.error('Failed to clear completed items:', err);
      setError('Failed to clear completed items. Please try again.');
      throw err;
    }
  };

  const deleteModule = async (moduleId: string) => {
    try {
      setError(null);
      await modulesApi.delete(moduleId);
      setModules(prevModules => prevModules.filter(module => module.id !== moduleId));
    } catch (err) {
      console.error('Failed to delete module:', err);
      setError('Failed to delete module. Please try again.');
      throw err;
    }
  };

  const editModule = async (moduleId: string, newName: string, newDate?: string) => {
    try {
      setError(null);
      await modulesApi.update(moduleId, { name: newName, createdAt: newDate });
      
      setModules(prevModules =>
        prevModules.map(module =>
          module.id === moduleId
            ? { ...module, name: newName, ...(newDate && { createdAt: newDate }) }
            : module
        )
      );
    } catch (err) {
      console.error('Failed to edit module:', err);
      setError('Failed to edit module. Please try again.');
      throw err;
    }
  };

  const deleteAllItems = async (moduleId: string) => {
    try {
      setError(null);
      await itemsApi.deleteAll(moduleId);
      
      setModules(prevModules =>
        prevModules.map(module =>
          module.id === moduleId
            ? { ...module, items: [] }
            : module
        )
      );
    } catch (err) {
      console.error('Failed to delete all items:', err);
      setError('Failed to delete all items. Please try again.');
      throw err;
    }
  };

  return (
    <AppStateContext.Provider value={{ 
      modules, 
      loading, 
      error,
      addModule, 
      addItemToModule, 
      toggleItemComplete, 
      clearCompletedItems, 
      deleteModule, 
      editModule, 
      deleteAllItems,
      refreshModules,
    }}>
      {children}
    </AppStateContext.Provider>
  );
}

export const useAppState = () => useContext(AppStateContext);
