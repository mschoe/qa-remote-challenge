const { ZBClient } = require('zeebe-node')

void (async () => {
  const zbc = new ZBClient({
    onConnectionError: () => console.log('Connection Error'),
  })
    
  const res = await zbc.deployProcess('./resources/hiring-process.bpmn')
  console.log(res)

  const result = await zbc.createProcessInstance('hiring-process', {
    candidate_name: 'John Doe',
  })
  console.log(result)  
})()