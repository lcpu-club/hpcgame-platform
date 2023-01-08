import cluster from 'cluster'
import minimist from 'minimist'

const argv = minimist(process.argv.slice(2))
const service = String(argv.service ?? argv.s ?? 'main')
const workers = Number(argv.workers ?? argv.w ?? 1)

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} started`)
  for (let i = 0; i < workers; i++) {
    cluster.fork()
  }
  cluster.on('exit', (worker, code, signal) => {
    console.log(
      `worker ${worker.process.pid} died with code ${code} and signal ${signal}`
    )
  })
} else {
  console.log(`Worker ${process.pid} started`)
  await import(`./services/${service}/index.js`)
}
