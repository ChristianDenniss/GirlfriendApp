import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class InitialSchema1700000000000 implements MigrationInterface {
    name = 'InitialSchema1700000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "modules",
                columns: [
                    {
                        name: "id",
                        type: "varchar",
                        isPrimary: true,
                        length: "36"
                    },
                    {
                        name: "name",
                        type: "varchar",
                        length: "100"
                    },
                    {
                        name: "type",
                        type: "varchar",
                        length: "50"
                    },
                    {
                        name: "description",
                        type: "text",
                        isNullable: true
                    },
                    {
                        name: "color",
                        type: "varchar",
                        length: "20",
                        default: "'#66BB6A'"
                    },
                    {
                        name: "icon",
                        type: "varchar",
                        length: "50",
                        isNullable: true
                    },
                    {
                        name: "itemCount",
                        type: "integer",
                        default: "0"
                    },
                    {
                        name: "createdAt",
                        type: "datetime",
                        default: "CURRENT_TIMESTAMP"
                    },
                    {
                        name: "updatedAt",
                        type: "datetime",
                        default: "CURRENT_TIMESTAMP"
                    }
                ]
            }),
            true
        );

        await queryRunner.createTable(
            new Table({
                name: "items",
                columns: [
                    {
                        name: "id",
                        type: "varchar",
                        isPrimary: true,
                        length: "36"
                    },
                    {
                        name: "title",
                        type: "varchar",
                        length: "200"
                    },
                    {
                        name: "description",
                        type: "text",
                        isNullable: true
                    },
                    {
                        name: "completed",
                        type: "boolean",
                        default: "0"
                    },
                    {
                        name: "priority",
                        type: "integer",
                        default: "0"
                    },
                    {
                        name: "category",
                        type: "varchar",
                        length: "50",
                        isNullable: true
                    },
                    {
                        name: "dueDate",
                        type: "datetime",
                        isNullable: true
                    },
                    {
                        name: "moduleId",
                        type: "varchar",
                        length: "36"
                    },
                    {
                        name: "createdAt",
                        type: "datetime",
                        default: "CURRENT_TIMESTAMP"
                    },
                    {
                        name: "updatedAt",
                        type: "datetime",
                        default: "CURRENT_TIMESTAMP"
                    }
                ]
            }),
            true
        );

        await queryRunner.createForeignKey(
            "items",
            new TableForeignKey({
                columnNames: ["moduleId"],
                referencedColumnNames: ["id"],
                referencedTableName: "modules",
                onDelete: "CASCADE"
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("items");
        await queryRunner.dropTable("modules");
    }
} 