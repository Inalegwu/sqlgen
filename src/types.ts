/**
 *
 * @type ColumnDefinition: Internal Column Definition of the statement builder
 *
 */
export type ColumnDefinition = {
	name: string;
	type: SQLiteType;
	primaryKey?: boolean;
	notNull?: boolean;
	unique?: boolean;
};

/**
 *
 * @type SQLiteType: Possible SQLite Types
 *
 */
export type SQLiteType = "TEXT" | "INTEGER" | "REAL" | "BLOB";
