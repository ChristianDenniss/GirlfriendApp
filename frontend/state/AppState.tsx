import { useState, createContext, useContext } from 'react';

export interface Module {
  id: string;
  name: string;
  createdAt: string;
  type: 'groceries' | 'todo' | 'bucketlist';
  items: { id: string; text: string; completed: boolean; timeframe?: string }[];
}

const AppStateContext = createContext<{ 
  modules: Module[]; 
  addModule: (name: string, type: 'groceries' | 'todo' | 'bucketlist') => void; 
  addItemToModule: (moduleId: string, text: string, timeframe?: string) => void;
  toggleItemComplete: (moduleId: string, itemId: string) => void;
  clearCompletedItems: (moduleId: string) => void;
  deleteModule: (moduleId: string) => void;
  editModule: (moduleId: string, newName: string, newDate?: string) => void;
  deleteAllItems: (moduleId: string) => void;
}>({ modules: [], addModule: () => {}, addItemToModule: () => {}, toggleItemComplete: () => {}, clearCompletedItems: () => {}, deleteModule: () => {}, editModule: () => {}, deleteAllItems: () => {} });

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [modules, setModules] = useState<Module[]>([
    { id: '1', name: 'Weekly Groceries', createdAt: '2025-07-06', type: 'groceries', items: [{ id: '1', text: 'Milk', completed: false }, { id: '2', text: 'Eggs', completed: true }] },
    { id: '2', name: 'Party Prep', createdAt: '2025-07-05', type: 'todo', items: [{ id: '3', text: 'Balloons', completed: false }] },
    { id: '3', name: 'Dream Vacation', createdAt: '2025-07-01', type: 'bucketlist', items: [{ id: '4', text: 'Visit Japan', completed: false, timeframe: 'Next 5 years' }] },
  ]);

  const addModule = (name: string, type: 'groceries' | 'todo' | 'bucketlist') => {
    const newModule: Module = {
      id: Date.now().toString(),
      name,
      createdAt: new Date().toISOString().split('T')[0],
      type,
      items: [],
    };
    setModules(prevModules => [...prevModules, newModule]);
  };

  const addItemToModule = (moduleId: string, text: string, timeframe?: string) => {
    setModules(prevModules =>
      prevModules.map(module =>
        module.id === moduleId
          ? { ...module, items: [...module.items, { id: Date.now().toString(), text, completed: false, ...(timeframe ? { timeframe } : {}) }] }
          : module
      )
    );
  };

  const toggleItemComplete = (moduleId: string, itemId: string) => {
    setModules(prevModules =>
      prevModules.map(module =>
        module.id === moduleId
          ? { ...module, items: module.items.map(item => {
              if (item.id === itemId) {
                console.log('Toggling item:', item.text, 'from', item.completed, 'to', !item.completed);
                return { ...item, completed: !item.completed };
              }
              return item;
            }) }
          : module
      )
    );
  };

  const clearCompletedItems = (moduleId: string) => {
    setModules(prevModules =>
      prevModules.map(module =>
        module.id === moduleId
          ? { ...module, items: module.items.filter(item => !item.completed) }
          : module
      )
    );
  };

  const deleteModule = (moduleId: string) => {
    setModules(prevModules => prevModules.filter(module => module.id !== moduleId));
  };

  const editModule = (moduleId: string, newName: string, newDate?: string) => {
    setModules(prevModules =>
      prevModules.map(module =>
        module.id === moduleId
          ? { ...module, name: newName, ...(newDate && { createdAt: newDate }) }
          : module
      )
    );
  };

  const deleteAllItems = (moduleId: string) => {
    setModules(prevModules =>
      prevModules.map(module =>
        module.id === moduleId
          ? { ...module, items: [] }
          : module
      )
    );
  };

  return (
    <AppStateContext.Provider value={{ modules, addModule, addItemToModule, toggleItemComplete, clearCompletedItems, deleteModule, editModule, deleteAllItems }}>
      {children}
    </AppStateContext.Provider>
  );
}

export const useAppState = () => useContext(AppStateContext);
