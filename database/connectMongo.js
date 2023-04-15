import { MongoClient, ServerApiVersion } from "mongodb";

const connectionString =
  "mongodb+srv://anuarbekovmeir:Anuarbekov2006@cluster1.zjhneok.mongodb.net/test";
const client = new MongoClient(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

let conn;
try {
  conn = await client.connect();
} catch(e) {
  console.error(e);
}

let db = conn.db("isinsta");

export default db;