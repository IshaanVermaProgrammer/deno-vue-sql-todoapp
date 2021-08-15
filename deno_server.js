import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
const router = new Router();
const app = new Application();
let port=80;
import { Client } from "https://deno.land/x/mysql/mod.ts";
const client = await new Client().connect({
  hostname: "127.0.0.1",
  username: "root",
  db: "tasks",
  password: "",
});
router.get("/", async (context) => {
		context.response.body = { data: await client.query(`select * from todos`) };
	});
router.post("/add-todo", async (context) => {
		const { text }=await context.request.body(true).value;
                              await client.execute(`INSERT INTO todos(text) VALUES(?)`, [text]).catch(err=>console.error(err));
                              context.response.body={ text };
	});
router.post("/del-todo", async (context) => {
		const { id }=await context.request.body(true).value;
                              await client.execute("DELETE FROM  `todos` WHERE id=?", [id]).catch(err=>console.error(err));
                              context.response.body=`Deleted ID ${id}`;
	});
router.post("/update-todo", async (context) => {
		const { id,text }=await context.request.body(true).value;
                              await client.execute("UPDATE `todos` SET text=?  WHERE id=?", [text,id]).catch(err=>console.error(err));
                              context.response.body=`Updated ID ${id}`;
	});
app.use(oakCors({origin:"http://localhost:8080"}));
app.use(router.routes());
app.use(router.allowedMethods());
console.log(port);
await app.listen({ port: port });
