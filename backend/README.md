# Maddy App Backend

A Node.js/Express backend for the Maddy App with SQLite database.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend directory:
```bash
PORT=3001
NODE_ENV=development
DATABASE_PATH=./database/maddy_app.db
```

3. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:3001`

## API Endpoints

### Modules

- `GET /api/modules` - Get all modules with item counts
- `GET /api/modules/type/:type` - Get modules by type (groceries, todo, bucketlist)
- `GET /api/modules/:id` - Get single module with items
- `POST /api/modules` - Create new module
- `PUT /api/modules/:id` - Update module
- `DELETE /api/modules/:id` - Delete module

### Items

- `GET /api/items/module/:moduleId` - Get all items for a module
- `POST /api/items` - Create new item
- `PUT /api/items/:id` - Update item
- `PATCH /api/items/:id/toggle` - Toggle item completion
- `DELETE /api/items/:id` - Delete single item
- `DELETE /api/items/module/:moduleId/all` - Delete all items in module
- `DELETE /api/items/module/:moduleId/completed` - Delete completed items in module

## Database Schema

### Modules Table
- `id` (TEXT, PRIMARY KEY)
- `name` (TEXT, NOT NULL)
- `createdAt` (TEXT, NOT NULL)
- `type` (TEXT, NOT NULL) - 'groceries', 'todo', or 'bucketlist'

### Items Table
- `id` (TEXT, PRIMARY KEY)
- `moduleId` (TEXT, NOT NULL, FOREIGN KEY)
- `text` (TEXT, NOT NULL)
- `completed` (BOOLEAN, DEFAULT 0)
- `timeframe` (TEXT, OPTIONAL)

## Health Check

- `GET /api/health` - Check if the server is running 