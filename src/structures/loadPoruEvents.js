const { readdirSync } = require('fs');
const { join } = require('path');

module.exports = async client => {
    console.log(`(♪) Cargando eventos de Poru`)

    const eventFiles = readdirSync(join(__dirname, "..", "..", "src", "PoruEvents")).filter(file => file.endsWith('.js'));
    let nic = 0;
    for (const file of eventFiles) {

        const event = require(`../../src/PoruEvents/${file}`);
        client.poru.on(event.name, event.execute.bind(null, client));
        nic++;
    }
    console.log(`(♪) ${nic} Eventos de Poru cargados`)
}
