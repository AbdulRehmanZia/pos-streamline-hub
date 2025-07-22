import dotenv from "dotenv";
dotenv.config({ path: "./env" });
import app from "./src/app.js";
import routes from "./src/routes/route.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server Is Running On Port: ${PORT}`));
app.use(routes);
