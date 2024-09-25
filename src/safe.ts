import { makeSafeFunction } from "@disgruntleddevs/make-safe-func";
import { Statement } from "./statement.ts";

export default function createSafeStatmentBuilder<T extends Record<string,unknown>>(tableName:string){
    const statement=new Statement<T>(tableName);

    return {
        safeNewCreateStatement:makeSafeFunction(statement.newCreateStatement),
        safeInsertStatement:makeSafeFunction(statement.newInsertStatement),
        safeSetColumnDefs:makeSafeFunction(statement.setColumnDefinitions),
    }
}