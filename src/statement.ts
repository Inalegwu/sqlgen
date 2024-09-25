import type { ColumnDefinition } from "./types.ts";
import { inferSQLiteType, isSQLiteType } from "./utils.ts";

/**
 *
 * @class Statement constructs a new statement builder of a passed @type T
 * which will be used to infer fields
 *
 */
export class Statement<T extends Record<string, unknown>> {
	declare type: T;
	declare tableName: string;
	columnDefinitions: ColumnDefinition[] | null = null;

	/**
	 *
	 * @function constructor
	 * @param tableName: @type
	 *
	 * string The name of the table this statement builder works on
	 *
	 */
	constructor(tableName: string) {
		this.tableName = tableName;
	}

	/**
	 *
	 * @function setColumnDefinitions
	 * @returns void
	 *
	 * : generate the internal column definitions used by the statement builder
	 *
	 */
	setColumnDefinitions(userType: T): void {
		if (this.columnDefinitions === null) {
			this.columnDefinitions = this.createColumnDefinitions(userType);
		}
	}

	/**
	 *
	 * @function newCreateStatement
	 * @returns string
	 *
	 * generates and SQL create statement based on the internal column definitions
	 *
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
	 * @function newInsertStatement
	 * @returns string
	 * @param Ignored
	 *
	 * generates an SQL insert statement based on the internal
	 * column definitions.
	 * the user can also specify fields to ignore when generate
	 * the insert statemtn
	 *
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
 * @type Ignored
 * fields of an internal type
 * signature to be ignored
 *
 */
export type Ignored<T> = {
	[K in keyof T]?: boolean;
};
