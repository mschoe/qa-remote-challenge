const { ZBClient } = require('zeebe-node')

void (async () => {
	const zbc = new ZBClient({
    onConnectionError: () => console.log('Connection Error'),
    onReady: () => console.log('Ready to work'),
  })
	const topology = await zbc.topology()
	console.log(JSON.stringify(topology, null, 2))

	zbc.createWorker({
		taskType: 'hiring',
		taskHandler: (job, worker) => {
      const { candidate_name } = job.variables
			worker.log(`Received a new application from: ${candidate_name}`)
			job.complete()
		},
	}) // handler)

	setTimeout(() => {
		console.log('Closing client...')
		zbc.close().then(() => console.log('All workers closed'))
	}, 10 * 60 * 1000)
})()