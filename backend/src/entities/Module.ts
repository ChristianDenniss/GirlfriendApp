import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Item } from "./Item";

@Entity("modules")
export class Module {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 100 })
  name: string;

  @Column({ type: "varchar", length: 50 })
  type: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "varchar", length: 20, default: "#66BB6A" })
  color: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  icon: string;

  @Column({ type: "integer", default: 0 })
  itemCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Item, item => item.module, { cascade: true })
  items: Item[];
} 