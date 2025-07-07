import "reflect-metadata";
import { DataSource } from "typeorm";
import { Module } from "./entities/Module";
import { Item } from "./entities/Item";
import path from "path";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Determine database type from environment
const databaseUrl = process.env.DATABASE_URL || "postgresql://postgres:Nannyjane12!@bgcqlkwogteuwovcepnj.supabase.co:5432/postgres";

let dataSourceConfig: any;

if (databaseUrl) {
  // Production: Use PostgreSQL (Supabase/Railway/etc)
  dataSourceConfig = {
    type: "postgres",
    url: databaseUrl,
    synchronize: false, // We'll use migrations
    logging: false, // Disable logging in production
    entities: [Module, Item],
    migrations: [path.join(__dirname, "../migrations/*.ts")],
    subscribers: [],
    ssl: {
      rejectUnauthorized: false // Required for Supabase
    },
    extra: {
      // Enable UUID extension
      max: 20,
      connectionTimeoutMillis: 0,
      idleTimeoutMillis: 0
    }
  };
} else {
  // Development: Use SQLite
  dataSourceConfig = {
    type: "sqlite",
    database: path.join(__dirname, "../database/maddy_app.db"),
    synchronize: false, // We'll use migrations
    logging: true,
    entities: [Module, Item],
    migrations: [path.join(__dirname, "../migrations/*.ts")],
    subscribers: [],
  };
}

export const AppDataSource = new DataSource(dataSourceConfig); 