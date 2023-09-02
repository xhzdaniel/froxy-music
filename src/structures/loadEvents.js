const { loadFiles } = require(`${process.cwd()}/src/functions/loadFiles/loadFiles.js`);

module.exports = async client => {
    console.log(`(+) Cargando eventos`.yellow);

    const RUTA_ARCHIVOS = await loadFiles("/src/events");

    if (RUTA_ARCHIVOS.length) {
        RUTA_ARCHIVOS.forEach((rutaArchivo) => {
            try {
                const EVENTO = require(rutaArchivo);
                const NOMBRE_EVENTO = rutaArchivo.split('\\').pop().split('/').pop().split(".")[0];
                client.on(NOMBRE_EVENTO, EVENTO.bind(null, client));
            } catch (e) {
                console.log(`ERROR AL CARGAR EL EVENTO ${rutaArchivo}`.bgRed);
                console.log(e);
            }
        })
    }

    console.log(`(+) ${RUTA_ARCHIVOS.length} Eventos Cargados`.green);
}