import React, { createContext, useContext, useState, useEffect } from 'react';
import { localDb, initDb } from '@/services/localDb';
import { Module } from '@/types/Module';
import { Item } from '@/types/Item';

// Extended Module type for the app state
interface AppModule extends Module {
  items: Item[];
  itemCount: number;
  completedCount?: number;
}

const AppStateContext = createContext<{
  modules: AppModule[]; 
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
  const [modules, setModules] = useState<AppModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load modules on component mount
  useEffect(() => {
    const initializeAndLoad = async () => {
      try {
        await initDb();
        await refreshModules();
      } catch (e) {
        console.error("Failed to initialize database or load modules:", e);
        setError("Failed to initialize database or load modules.\nContact your boyfriend :(");
      }
    };
    initializeAndLoad();
  }, []);

  const refreshModules = async () => {
    try {
      setLoading(true);
      setError(null);
      const modulesData = await localDb.modules.getAll();
      
      // Convert to AppModule format and load items for each module
      const appModules: AppModule[] = await Promise.all(
        modulesData.map(async (module) => {
          const items = await localDb.items.getByModule(module.id);
          return {
            ...module,
            items,
            itemCount: items.length,
            completedCount: items.filter(item => item.completed).length,
          };
        })
      );
      
      setModules(appModules);
    } catch (err) {
      console.error('Failed to load list modules:', err);
      setError('Failed to load modules.\nContact your boyfriend :(');
    } finally {
      setLoading(false);
    }
  };

  const addModule = async (name: string, type: 'groceries' | 'todo' | 'bucketlist') => {
    try {
      setError(null);
      const newModule = await localDb.modules.create(name, type);
      const appModule: AppModule = {
        ...newModule,
        items: [],
        itemCount: 0,
        completedCount: 0,
      };
      setModules(prevModules => [...prevModules, appModule]);
    } catch (err) {
      console.error('Failed to create module:', err);
      setError('Failed to create module. Please try again.');
      throw err;
    }
  };

  const addItemToModule = async (moduleId: string, text: string, timeframe?: string) => {
    try {
      setError(null);
      const newItem = await localDb.items.create(moduleId, text, timeframe);
      
      setModules(prevModules =>
        prevModules.map(module =>
          module.id === moduleId
            ? { 
                ...module, 
                items: [...module.items, newItem], 
                itemCount: module.itemCount + 1 
              }
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
      const currentItem = await localDb.items.getById(itemId);
      if (currentItem) {
        const updatedItem = await localDb.items.update(itemId, { completed: !currentItem.completed });
        
        setModules(prevModules =>
          prevModules.map(module =>
            module.id === moduleId
              ? { 
                  ...module, 
                  items: module.items.map(item => 
                    item.id === itemId 
                      ? { ...item, completed: updatedItem?.completed || item.completed }
                      : item
                  ),
                  completedCount: module.items.filter(item => 
                    item.id === itemId ? updatedItem?.completed || item.completed : item.completed
                  ).length
                }
              : module
          )
        );
      }
    } catch (err) {
      console.error('Failed to toggle item:', err);
      setError('Failed to update item. Please try again.');
      throw err;
    }
  };

  const clearCompletedItems = async (moduleId: string) => {
    try {
      setError(null);
      const module = modules.find(m => m.id === moduleId);
      if (module) {
        // Delete completed items one by one
        for (const item of module.items.filter(item => item.completed)) {
          await localDb.items.delete(item.id);
        }
        
        setModules(prevModules =>
          prevModules.map(module =>
            module.id === moduleId
              ? { 
                  ...module, 
                  items: module.items.filter(item => !item.completed), 
                  itemCount: module.items.filter(item => !item.completed).length,
                  completedCount: 0
                }
              : module
          )
        );
      }
    } catch (err) {
      console.error('Failed to clear completed items:', err);
      setError('Failed to clear completed items. Please try again.');
      throw err;
    }
  };

  const deleteModule = async (moduleId: string) => {
    try {
      setError(null);
      await localDb.modules.delete(moduleId);
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
      const creationDate = newDate || new Date().toISOString();
      await localDb.modules.update(moduleId, newName, creationDate);
      
      setModules(prevModules =>
        prevModules.map(module =>
          module.id === moduleId
            ? { ...module, name: newName }
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
      await localDb.items.deleteByModule(moduleId);
      
      setModules(prevModules =>
        prevModules.map(module =>
          module.id === moduleId
            ? { ...module, items: [], itemCount: 0, completedCount: 0 }
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
