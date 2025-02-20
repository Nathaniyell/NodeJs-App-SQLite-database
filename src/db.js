import { Database } from "better-sqlite3";

// Create/connect to a physical database file instead of memory
const db = new Database('database.sqlite');

//Execute SQL statements from strings
db.exec(`
    CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
    )
`);

db.exec(`
    CREATE TABLE todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        task TEXT,
        completed BOOLEAN DEFAULT 0,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )    
`)


//to be able to interact with this file from our backend we need to export it    
export default db