module.exports = {
    name: "nodeConnect",
    async execute(client, node) {
        console.log(`(♪) Conectado con el node [${node.name}]`.green);
    }
};