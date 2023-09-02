const { loadFiles } = require(`${process.cwd()}/src/functions/loadFiles/loadFiles.js`);

module.exports = async client => {
    console.log(`(-) Cargando handlers`.yellow);

    const RUTA_ARCHIVOS = await loadFiles("/src/handlers");
    
    if (RUTA_ARCHIVOS.length) {
        RUTA_ARCHIVOS.forEach((rutaArchivo) => {
            try {
                require(rutaArchivo)(client);
            } catch (e) {
                console.log(`ERROR AL CARGAR EL HANDLER ${rutaArchivo}`.bgRed);
                console.log(e);
            }
        })
    }

    console.log(`(-) ${RUTA_ARCHIVOS.length} Handlers Cargados`.green);
}