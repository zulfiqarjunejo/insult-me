import "./helper/env";
import Server from "./www/server";
import routes from "./routes";

const port = parseInt(process.env.PORT);

export default new Server().router(routes).listen(port);
