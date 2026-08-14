import https from "https";
import http from "http";
import axios from "axios";
import { setGlobalDispatcher, Agent as UndiciAgent } from "undici";

export const httpsAgent = new https.Agent({
  keepAlive: true,
  maxSockets: 10,
  maxFreeSockets: 5,
  timeout: 8000,
  scheduling: "fifo",
});

export const httpAgent = new http.Agent({
  keepAlive: true,
  maxSockets: 10,
  maxFreeSockets: 5,
  timeout: 8000,
  scheduling: "fifo",
});

axios.defaults.httpsAgent = httpsAgent;
axios.defaults.httpAgent = httpAgent;
axios.defaults.timeout = 8000;

setGlobalDispatcher(
  new UndiciAgent({
    connect: {
      keepAlive: true,
      timeout: 8000,
    },
    connections: 10,
    pipelining: 1,
    keepAliveTimeout: 30000,
    keepAliveMaxTimeout: 60000,
  })
);
