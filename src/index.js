import server from "./server.js";
import dotenv from 'dotenv';

dotenv.config()

server
  .listen(process.env.PORT || 3000)
  .then(() => console.log(`HTTP server started on port: ${server.address().port}, YA_SKILL_ID: ${process.env.YA_SKILL_ID}, MESH_URL: ${process.env.MESH_URL}, MK1_IP: ${process.env.MK1_IP}`))
  .catch(e => console.error(e));
