import { config } from "dotenv";
config();

/* export default {
  port: process.env.PORT || 3001,
  dbUser: process.env.DB_USER || "Userrr",
  dbPassword: process.env.DB_PASSWORD || "Userrr",
  dbServer: process.env.DB_SERVER || "localhost",
  dbDatabase: process.env.DB_DATABASE || "BDPrototipo",
};
 */
export default {
 port: process.env.PORT || 3001,
  dbUser: process.env.DB_USER || "sqlserver",
  dbPassword: process.env.DB_PASSWORD || "sqlserver",
  dbServer: process.env.DB_SERVER || "35.192.19.210",
  dbDatabase: process.env.DB_DATABASE || "BDPrototipo",
  options: {
        encrypt: false,
        trustServerCertificate: false 
    }
};
