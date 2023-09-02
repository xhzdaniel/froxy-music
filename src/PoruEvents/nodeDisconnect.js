module.exports = {
  name:"nodeDisconnect",
async execute(client, node) {
    console.log(`(♪) Conexión perdida con el node [${node.name}]`.bgRed);
}
};