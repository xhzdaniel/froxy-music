const { glob } = require('glob');
const { promisify } = require("util");
const proGlob = promisify(glob);

module.exports = {
    loadFiles
}

async function loadFiles(dirName) {
    const Files = await proGlob(`${process.cwd().replace(/\\/g, "/")}/${dirName}/**/*.{js,json}`);
    Files.forEach((file) => delete require.cache[require.resolve(file)]);
    return Files;
}