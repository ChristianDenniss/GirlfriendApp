import { Platform } from 'react-native';

let db: any = null;
if (Platform.OS !== 'web') {
  // @ts-ignore
  const SQLite = require('expo-sqlite');
  db = SQLite.openDatabase('maddyapp.db');
}

// Web fallback using localStorage
function getWebItems(moduleType: string) {
  const all = JSON.parse(localStorage.getItem('items') || '[]');
  return all.filter((item: any) => item.moduleType === moduleType);
}

function setWebItems(items: any[]) {
  localStorage.setItem('items', JSON.stringify(items));
}

export function createTables() {
  if (db) {
    db.transaction((tx: any) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          text TEXT,
          completed INTEGER DEFAULT 0,
          moduleType TEXT
        );`
      );
    });
  }
}

export function addItem(text: string, moduleType: string, callback?: () => void) {
  if (Platform.OS === 'web') {
    const all = JSON.parse(localStorage.getItem('items') || '[]');
    const newItem = { id: Date.now(), text, completed: false, moduleType };
    setWebItems([...all, newItem]);
    callback && callback();
  } else if (db) {
    db.transaction((tx: any) => {
      tx.executeSql(
        'INSERT INTO items (text, moduleType) VALUES (?, ?);',
        [text, moduleType],
        (_: any, result: any) => callback && callback()
      );
    });
  }
}

export function getItems(moduleType: string, callback: (items: any[]) => void) {
  if (Platform.OS === 'web') {
    callback(getWebItems(moduleType));
  } else if (db) {
    db.transaction((tx: any) => {
      tx.executeSql(
        'SELECT * FROM items WHERE moduleType = ?;',
        [moduleType],
        (_: any, { rows }: any) => callback(rows._array)
      );
    });
  }
}

export function toggleItem(id: number, completed: boolean, callback?: () => void) {
  if (Platform.OS === 'web') {
    let all = JSON.parse(localStorage.getItem('items') || '[]');
    all = all.map((item: any) => item.id === id ? { ...item, completed } : item);
    setWebItems(all);
    callback && callback();
  } else if (db) {
    db.transaction((tx: any) => {
      tx.executeSql(
        'UPDATE items SET completed = ? WHERE id = ?;',
        [completed ? 1 : 0, id],
        (_: any, result: any) => callback && callback()
      );
    });
  }
}

export function deleteItem(id: number, callback?: () => void) {
  if (Platform.OS === 'web') {
    let all = JSON.parse(localStorage.getItem('items') || '[]');
    all = all.filter((item: any) => item.id !== id);
    setWebItems(all);
    callback && callback();
  } else if (db) {
    db.transaction((tx: any) => {
      tx.executeSql(
        'DELETE FROM items WHERE id = ?;',
        [id],
        (_: any, result: any) => callback && callback()
      );
    });
  }
} 