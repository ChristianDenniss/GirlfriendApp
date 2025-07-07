"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const Module_1 = require("./entities/Module");
const Item_1 = require("./entities/Item");
const path_1 = __importDefault(require("path"));
// Determine database type from environment
const isProduction = process.env.NODE_ENV === 'production';
const databaseUrl = process.env.DATABASE_URL;
let dataSourceConfig;
if (isProduction && databaseUrl) {
    // Production: Use PostgreSQL (Supabase/Railway/etc)
    dataSourceConfig = {
        type: "postgres",
        url: databaseUrl,
        synchronize: false, // We'll use migrations
        logging: false, // Disable logging in production
        entities: [Module_1.Module, Item_1.Item],
        migrations: [path_1.default.join(__dirname, "../migrations/*.ts")],
        subscribers: [],
        ssl: {
            rejectUnauthorized: false // Required for some cloud providers
        }
    };
}
else {
    // Development: Use SQLite
    dataSourceConfig = {
        type: "sqlite",
        database: path_1.default.join(__dirname, "../database/maddy_app.db"),
        synchronize: false, // We'll use migrations
        logging: true,
        entities: [Module_1.Module, Item_1.Item],
        migrations: [path_1.default.join(__dirname, "../migrations/*.ts")],
        subscribers: [],
    };
}
exports.AppDataSource = new typeorm_1.DataSource(dataSourceConfig);
//# sourceMappingURL=data-source.js.map