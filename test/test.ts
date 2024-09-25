import { Statement } from "../src/index.ts";
import createSafeStatementBuilder from "../src/safe.ts";

type File={
    name:string;
    size:number;
}

const statement = new Statement<File>("table");


statement.setColumnDefinitions({
    name:"TEXT",
    // @ts-ignore: this is the table type
    size:"INTEGER"
});

const createStatement=statement.newCreateStatement();
const insertStatement=statement.newInsertStatement({
    ignored:{
        size:true
    }
})

console.log(createStatement);
console.log(insertStatement);

// safe
const safeBuilder=createSafeStatementBuilder<File>("files");

// this causes issues... look into it
safeBuilder.safeSetColumnDefs({
    name:"TEXT",
    size:"INTEGER"
}).match(console.log,console.error);

console.log({safeBuilder});
