import minimist from 'minimist'

const argv = minimist(process.argv.slice(2))
const service = argv.service ?? argv.s ?? 'main'

await import(`./services/${service}/index.js`)
