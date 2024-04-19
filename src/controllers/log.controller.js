import { getConnection } from "../database";

export const registrarLog = async (userId, action, ipAddress, status) => {
  try {
    const pool = await getConnection();
    await pool
      .request()
      .input("userId", userId)
      .input("action", action)
      .input("ipAddress", ipAddress)
      .input("status", status)
      .query("INSERT INTO Logs (user_id, action, ip_address, status) VALUES (@userId, @action, @ipAddress, @status)");
  } catch (error) {
    console.error("Error al registrar log:", error);
    throw new Error("Error al registrar log");
  }
};
