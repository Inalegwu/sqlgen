import type { ColumnDefinition } from "./types.ts";
import { inferSQLiteType, isSQLiteType } from "./utils.ts";

/**
 *
 *  Constructs a new statement builder of a passed @type T
 *  which will be used to infer fields
 *
 * @class Statement
 * @returns Statement
 */
export class Statement<T extends Record<string, unknown>> {
	declare type: T;
	declare tableName: string;
	columnDefinitions: ColumnDefinition[] | null = null;

	/**
	 * The name of the table this statement builder works on
	 *
	 * @function constructor
	 * @param tableName: string
	 */
	constructor(tableName: string) {
		this.tableName = tableName;
	}

	/**
	 *
	 * Generate the internal column definitions used by the statement builder
	 *
	 * @function setColumnDefinitions
	 * @returns void
	 */
	setColumnDefinitions(userType: T): void {
		if (this.columnDefinitions === null) {
			this.columnDefinitions = this.createColumnDefinitions(userType);
		}
	}

	/**
	 *
	 * Generates an SQL create statement based on the internal column definitions
	 *
	 * @function newCreateStatement
	 * @returns string
	 */
	newCreateStatement(): string {
		if (this.columnDefinitions === null) {
			throw new Error("No column defintions set. Call setColumnDefintions");
		}

		if (!this.columnDefinitions) throw new Error("No column definitions set");

		const columns = this.columnDefinitions.map((column) => {
			let columnDef = `${column.name} ${column.type}`;
			if (column.primaryKey) columnDef += " PRIMARY KEY";
			if (column.notNull) columnDef += " NOT NULL";
			if (column.unique) columnDef += " UNIQUE";
			return columnDef;
		});

		const statement = `CREATE TABLE ${this.tableName} (
            ${columns.join(",\n  ")}
        );`;

		return statement;
	}

	/**
	 *
	 *
	 * Generates an SQL insert statement based on the internal
	 * column definitions.
	 * the user can also specify fields to ignore when generate
	 * the insert statemtn
	 *
	 * @param Ignored
	 * @returns string
	 */
	newInsertStatement({ ignored }: { ignored?: Ignored<T> }): string {
		if (!this.columnDefinitions) throw new Error("No column definitions set");

		const keys = Object.keys(ignored || {});

		const columns = this.columnDefinitions
			.filter((column) => !keys.find((key) => key === column.name))
			.map((column) => `${column.name}`);

		const statement = `INSERT INTO ${this.tableName} (${columns.join(",\n  ")}) VALUES (${columns.map(() => "?")})`;

		return statement;
	}

	/**
	 *
	 * @function createColumnDefinitions
	 * @returns ColumnDefinition[]
	 *
	 * uses the internal type definiton to create
	 * column definitions that is used within the
	 * statement builder this function isn't supposed
	 * to be called from outside this function
	 * TODO: make this function and it's type private
	 *
	 */
	createColumnDefinitions<T extends Record<string, unknown>>(
		type: T,
	): ColumnDefinition[] {
		return Object.keys(type)
			.filter(
				(key) =>
					!key.endsWith("PrimaryKey") &&
					!key.endsWith("NotNull") &&
					!key.endsWith("Unique"),
			)
			.map((key) => {
				const columnDef: ColumnDefinition = {
					name: key,
					type: isSQLiteType(type[key])
						? type[key]
						: inferSQLiteType<T>(key as keyof T),
					primaryKey: !!type[`${key}PrimaryKey`],
					notNull: !!type[`${key}NotNull`],
					unique: !!type[`${key}Unique`],
				};
				return columnDef;
			});
	}
}

/**
 *
 * fields of an internal type
 * signature to be ignored
 *
 * @type Ignored
 */
export type Ignored<T> = {
	[K in keyof T]?: boolean;
};
