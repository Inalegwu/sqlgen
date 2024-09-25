/**
 *
 * Internal Column Definition of the statement builder
 *
 * @type ColumnDefinition
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
 * Possible SQLite Types
 *
 * @type SQLiteType
 */
export type SQLiteType = "TEXT" | "INTEGER" | "REAL" | "BLOB";
