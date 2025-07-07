import "reflect-metadata";
import { DataSource } from "typeorm";
import { Module } from "./entities/Module";
import { Item } from "./entities/Item";
import path from "path";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: path.join(__dirname, "../database/maddy_app.db"),
  synchronize: false, // We'll use migrations
  logging: true,
  entities: [Module, Item],
  migrations: [path.join(__dirname, "../migrations/*.ts")],
  subscribers: [],
}); 