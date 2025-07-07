import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from "typeorm";
import { Module } from "./Module";

@Entity("items")
export class Item {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 200 })
  title: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "boolean", default: false })
  completed: boolean;

  @Column({ type: "integer", default: 0 })
  priority: number;

  @Column({ type: "varchar", length: 50, nullable: true })
  category: string;

  @Column({ type: "timestamp", nullable: true })
  dueDate: Date;

  @Column({ type: "uuid" })
  moduleId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Module, module => module.items, { onDelete: "CASCADE" })
  @JoinColumn({ name: "moduleId" })
  module: Module;
} 