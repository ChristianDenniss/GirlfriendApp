# 🐘 PostgreSQL Setup for Supabase

## Supabase Database Configuration

### 1. Enable UUID Extension
In your Supabase dashboard:
1. Go to **SQL Editor**
2. Run this command:
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### 2. Database Connection String Format
Your Supabase connection string should look like:
```
postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-REF].supabase.co:5432/postgres
```

### 3. Environment Variables
Create a `.env` file in your backend directory:
```env
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-REF].supabase.co:5432/postgres
NODE_ENV=production
PORT=3001
```

### 4. Run Migrations
After setting up your connection:
```bash
npm run migration:run
npm run seed
```

## PostgreSQL vs SQLite Differences

### Data Types
- **UUID**: PostgreSQL uses native UUID type with `uuid-ossp` extension
- **Timestamps**: PostgreSQL uses `timestamp` instead of `datetime`
- **Booleans**: PostgreSQL uses `true/false` instead of `0/1`

### Features
- **SSL**: Required for Supabase connections
- **Connection Pooling**: Configured for better performance
- **UUID Generation**: Uses PostgreSQL's `uuid_generate_v4()` function

## Troubleshooting

### Common Issues:
1. **SSL Connection Error**: Make sure `rejectUnauthorized: false` is set
2. **UUID Extension Missing**: Run the CREATE EXTENSION command in Supabase
3. **Connection Timeout**: Check your connection string format

### Testing Connection:
```bash
# Test your database connection
npm start
```

If successful, you should see:
```
🚀 Maddy App Backend running on port 3001
📊 Health check: http://localhost:3001/api/health
``` 