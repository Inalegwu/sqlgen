# SQLGEN

Generate SQL Statements based on typescript type definitions
easily


### What is SQLGEN
SQLgen is built to generate sql statements reliably simply with
Typescript types and not having to use a ORM.
SQLgen focuses on generating sqlite statements for now as that is
the need I have an am trying to solve.

No more ```*.schema.ts``` files I say



### Examples

I'll briefly show you how you can use the statment builder
to generate statements and get yourself going


```ts
import {Statement} from "@disgruntleddevs/sqlgen";

type Contact={
    id:"TEXT";
    email:"TEXT";
    phoneNumber:"INTEGER";
}

const userType:User={
    id:"TEXT";
    email:"TEXT";
    phoneNumber:"INTEGER"
}

// ewww... classes
// initialize the statement class with the type of your table
const builder=new Statement<Contact>();

// set the table column definitions;
builder.setColumnDefinitions(userType);

// generate your statements as you need
const createStatement=builder.newCreateStatement();
const insertStatement=builder.newInsertStatement({
    ignored:{
        // ignore fields on your type you don't
        // intend on inserting
    }
})

```