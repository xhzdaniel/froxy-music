const { ClusterManager } = require("discord-hybrid-sharding");
require("dotenv").config();

const manager = new ClusterManager("./src/index.js", {
    totalShards: "auto",
    shardsPerClusters: 1,
    totalClusters: "auto",
    mode: "process",
    token: process.env.TOKEN,
});

manager.on("clusterCreate", (cluster) => console.log(`[INFO] Cluster ${cluster.id} iniciado`));
manager.spawn({ timeout: -1 });