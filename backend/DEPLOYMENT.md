# 🚀 Maddy App Backend Deployment Guide

## Free Cloud Database Options

### Option 1: Supabase (Recommended)
**Free Tier Includes:**
- 500MB database
- 50,000 monthly active users
- 2GB bandwidth
- Real-time subscriptions

**Setup Steps:**
1. Go to [supabase.com](https://supabase.com) and sign up
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string (looks like: `postgresql://postgres:[password]@[host]:5432/postgres`)
5. Set it as your `DATABASE_URL` environment variable

### Option 2: Railway
**Free Tier Includes:**
- $5 credit monthly
- Perfect for small projects

**Setup Steps:**
1. Go to [railway.app](https://railway.app) and sign up
2. Create a new project
3. Add a PostgreSQL database
4. Copy the connection string from the database settings

### Option 3: Render
**Free Tier Includes:**
- 750 hours/month
- Sleeps after 15 minutes of inactivity

**Setup Steps:**
1. Go to [render.com](https://render.com) and sign up
2. Create a new PostgreSQL database
3. Copy the connection string

## Environment Setup

1. **Create a `.env` file** in the backend directory:
```bash
# Copy from env.example
cp env.example .env
```

2. **Edit `.env` file** with your cloud database URL:
```env
DATABASE_URL=postgresql://username:password@host:port/database
NODE_ENV=production
PORT=3001
```

## Database Migration

After setting up your cloud database, run migrations:

```bash
# Generate migration (if needed)
npm run migration:generate -- src/migrations/InitialSchema

# Run migrations
npm run migration:run

# Seed with sample data
npm run seed
```

## Backend Deployment

### Option A: Railway (Recommended for Free)
1. Connect your GitHub repo to Railway
2. Railway will auto-detect it's a Node.js app
3. Set environment variables in Railway dashboard
4. Deploy!

### Option B: Render
1. Connect your GitHub repo to Render
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Add environment variables
5. Deploy!

### Option C: Vercel
1. Connect your GitHub repo to Vercel
2. Set environment variables
3. Deploy!

## Testing Your Deployment

1. **Health Check:**
```bash
curl https://your-app-url.railway.app/api/health
```

2. **Test API Endpoints:**
```bash
# Get modules
curl https://your-app-url.railway.app/api/modules

# Create a module
curl -X POST https://your-app-url.railway.app/api/modules \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Module","type":"todo"}'
```

## Frontend Configuration

Update your frontend API service to point to your deployed backend:

```typescript
// In frontend/services/api.ts
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://your-app-url.railway.app';

export const api = {
  baseURL: API_BASE_URL,
  // ... rest of your API config
};
```

## Troubleshooting

### Common Issues:
1. **Database Connection Failed:**
   - Check your `DATABASE_URL` format
   - Ensure SSL is enabled for cloud databases

2. **Migration Errors:**
   - Run `npm run migration:show` to see pending migrations
   - Check if your database schema matches your entities

3. **CORS Issues:**
   - Ensure your frontend URL is allowed in CORS settings
   - Check if your backend is accessible from your frontend

### SSL Configuration:
For cloud databases, you might need to add SSL configuration:
```typescript
// In data-source.ts
ssl: {
  rejectUnauthorized: false
}
```

## Cost Optimization

- **Supabase:** Free tier is generous, upgrade only if you exceed limits
- **Railway:** Monitor usage, $5 credit goes a long way for small apps
- **Render:** Free tier sleeps after inactivity, consider paid for always-on

## Security Notes

- Never commit `.env` files to git
- Use environment variables for all sensitive data
- Enable SSL for database connections
- Consider adding authentication for production use 