import * as SQLite from 'expo-sqlite';
import { Module } from '@/types/Module';
import { Item } from '@/types/Item';

const DATABASE_NAME = 'maddy_app.db';

const db = SQLite.openDatabaseSync(DATABASE_NAME);

export const initDb = () => {
  return new Promise<void>((resolve, reject) => {
    db.execAsync(
      `CREATE TABLE IF NOT EXISTS modules (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        description TEXT,
        color TEXT,
        icon TEXT,
        itemCount INTEGER,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      );`
    ).then(() => {
      return db.execAsync(
        `CREATE TABLE IF NOT EXISTS items (
          id TEXT PRIMARY KEY NOT NULL,
          title TEXT NOT NULL,
          description TEXT,
          completed INTEGER,
          priority INTEGER,
          category TEXT,
          dueDate TEXT,
          moduleId TEXT NOT NULL,
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL,
          FOREIGN KEY (moduleId) REFERENCES modules (id) ON DELETE CASCADE
        );`
      );
    }).then(() => {
      console.log('Database initialized successfully.');
      resolve();
    }).catch((error) => {
      console.error('Transaction error during DB initialization:', error);
      reject(error);
    });
  });
};

export const localDb = {
  modules: {
    getAll: (): Promise<Module[]> => {
      return db.getAllAsync(`SELECT * FROM modules ORDER BY createdAt ASC;`)
        .then((rows) => {
          return rows.map((row: any) => ({
            id: row.id,
            name: row.name,
            type: row.type as 'todo' | 'groceries' | 'bucketlist',
            icon: row.icon,
            createdAt: new Date(row.createdAt),
          }));
        });
    },

    getById: (id: string): Promise<Module | undefined> => {
      return db.getFirstAsync(`SELECT * FROM modules WHERE id = ?;`, [id])
        .then((row: any) => {
          if (row) {
            return {
              id: row.id,
              name: row.name,
              type: row.type as 'todo' | 'groceries' | 'bucketlist',
              icon: row.icon,
              createdAt: new Date(row.createdAt),
            };
          }
          return undefined;
        });
    },

    create: (name: string, type: string, icon?: string): Promise<Module> => {
      const newModule: Module = {
        id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
        name,
        type: type as 'todo' | 'groceries' | 'bucketlist',
        icon: icon || 'list',
        createdAt: new Date(),
      };
      
      return db.runAsync(
        `INSERT INTO modules (id, name, type, icon, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?);`,
        [
          newModule.id,
          newModule.name,
          newModule.type,
          newModule.icon || null,
          newModule.createdAt.toISOString(),
          newModule.createdAt.toISOString(),
        ]
      ).then(() => newModule);
    },

    update: (id: string, name: string, createdAt: string, icon?: string): Promise<Module | undefined> => {
      return db.runAsync(
        `UPDATE modules SET name = ?, icon = ?, updatedAt = ? WHERE id = ?;`,
        [name, icon || null, new Date().toISOString(), id]
      ).then(() => localDb.modules.getById(id));
    },

    delete: (id: string): Promise<boolean> => {
      return db.runAsync(`DELETE FROM modules WHERE id = ?;`, [id])
        .then((result: any) => result.changes > 0);
    },
  },

  items: {
    getByModule: (moduleId: string): Promise<Item[]> => {
      return db.getAllAsync(`SELECT * FROM items WHERE moduleId = ? ORDER BY createdAt ASC;`, [moduleId])
        .then((rows) => {
          return rows.map((row: any) => ({
            id: row.id,
            moduleId: row.moduleId,
            text: row.title,
            completed: Boolean(row.completed),
            timeframe: row.dueDate,
            createdAt: new Date(row.createdAt),
          }));
        });
    },

    create: (moduleId: string, text: string, timeframe?: string): Promise<Item> => {
      const newItem: Item = {
        id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
        moduleId,
        text,
        completed: false,
        timeframe,
        createdAt: new Date(),
      };
      
      return db.runAsync(
        `INSERT INTO items (id, title, completed, dueDate, moduleId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?);`,
        [
          newItem.id,
          newItem.text,
          newItem.completed ? 1 : 0,
          newItem.timeframe || null,
          newItem.moduleId,
          newItem.createdAt.toISOString(),
          newItem.createdAt.toISOString(),
        ]
      ).then(() => newItem);
    },

    update: (id: string, updates: Partial<Item>): Promise<Item | undefined> => {
      const fields = Object.keys(updates).filter(key => key !== 'id' && key !== 'createdAt');
      const values = fields.map(key => {
        const value = (updates as any)[key];
        return key === 'completed' ? (value ? 1 : 0) : value;
      });
      values.push(new Date().toISOString()); // Add updatedAt
      values.push(id);

      if (fields.length === 0) {
        return localDb.items.getById(id);
      }

      const fieldMappings: { [key: string]: string } = {
        text: 'title',
        completed: 'completed',
        timeframe: 'dueDate',
      };

      const sqlFields = fields.map(f => `${fieldMappings[f] || f} = ?`).join(', ');

      return db.runAsync(
        `UPDATE items SET ${sqlFields}, updatedAt = ? WHERE id = ?;`,
        values
      ).then(() => localDb.items.getById(id));
    },

    getById: (id: string): Promise<Item | undefined> => {
      return db.getFirstAsync(`SELECT * FROM items WHERE id = ?;`, [id])
        .then((row: any) => {
          if (row) {
            return {
              id: row.id,
              moduleId: row.moduleId,
              text: row.title,
              completed: Boolean(row.completed),
              timeframe: row.dueDate,
              createdAt: new Date(row.createdAt),
            };
          }
          return undefined;
        });
    },

    delete: (id: string): Promise<boolean> => {
      return db.runAsync(`DELETE FROM items WHERE id = ?;`, [id])
        .then((result: any) => result.changes > 0);
    },

    deleteByModule: (moduleId: string): Promise<boolean> => {
      return db.runAsync(`DELETE FROM items WHERE moduleId = ?;`, [moduleId])
        .then((result: any) => result.changes > 0);
    },
  },
};