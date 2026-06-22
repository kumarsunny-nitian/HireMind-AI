require("dotenv").config();

const http = require("http");

const app = require("./src/app");
const connectDB = require("./src/config/db");
require("./src/workers/email.worker");

require("./src/config/redis");

const { initializeSocket } = require("./src/config/socket");

connectDB();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

initializeSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
