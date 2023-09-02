module.exports = {
    name: "nodeReconnect",
    async execute(client, node) {
        console.log(`(♪) Reconectando con el node [${node.name}]`.green);
    }
};