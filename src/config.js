import { config } from "dotenv";
config();

/* export default {
  port: process.env.PORT || 3001,
  dbUser: process.env.DB_USER || "User",
  dbPassword: process.env.DB_PASSWORD || "User",
  dbServer: process.env.DB_SERVER || "localhost",
  dbDatabase: process.env.DB_DATABASE || "BDPrototipo",
};
*/
export default {
  port: process.env.PORT || 3001,
  dbUser: process.env.DB_USER || 'u549185319_Cu549185319_',
  dbPassword: process.env.DB_PASSWORD || 'Cu549185319_',
  dbServer: process.env.DB_SERVER || '193.203.166.204',
  dbDatabase: process.env.DB_DATABASE || 'u549185319_Cirupied',
};