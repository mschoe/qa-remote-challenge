# Camunda QA Engineer Remote Test Challenge

Welcome to the Camunda QA Engineer Remote Test Challenge. For this exercise you have to test a new feature in our process monitoring application [Operate](https://docs.camunda.io/docs/components/operate/) which is part of the [Camunda Cloud Platform](https://docs.camunda.io/).  

In the following steps you will learn how to connect to the Camunda Cloud, deploy a process, start a process instance and observe the result in the Operate app.   
Before we dive into the technical details let's have a look at the process that we automate.
![Hiring Process](resources/hiring-process.png)
The [process](https://docs.camunda.io/docs/components/concepts/processes/) basically describes our hiring process with the help of [BPMN](https://docs.camunda.io/docs/components/modeler/bpmn/bpmn-primer/). Once a candidate applys for the job the process will be started. The following [service task](https://docs.camunda.io/docs/components/modeler/bpmn/service-tasks/) triggers a [worker](https://docs.camunda.io/docs/components/concepts/job-workers/) that is capable of performing a particular task in our process. Once the task has been processed, the end event will be reached and the execution path ends.

## Sign up for Camunda Platform 8

Visit [camunda.io/signup](https://accounts.cloud.camunda.io/signup) to create a new account. After login, you'll see the console overview page. This is the central place to manage your clusters. We call it the Console.

Docs: https://docs.camunda.io/docs/guides/getting-started/


### The Cluster 

A cluster is a container where our process engine and its web applications are running. With your trial account you can run one cluster and luckely there is already a cluster configured for our task.   
Your cluster will take a few moments to create. Check the satus on the Clusters page or by clicking into the cluster itself and looking at the Applications Overview. If you encounter any problem and the status of the cluster does not turn green you can simply delete the cluster and create a new one.


### Cluster Credentials for your Zeebe Client

To interact with your cluster, you'll use a client for that we create credentials now.  

1. Select your cluster, open the API tab and click **Create new Client**.
2. Provide a descriptive name for your client. For this challenge, the scope can be the default Zeebe scope. Click Create.
3. On the next page you will see the client credentials. Select the **Env Vars** tab and download the credentials into your working directory. Make the credentials available as environment variables for your node application. 


## Build a Process Application

For this exercise we use java script and the [node.js client](https://github.com/camunda/camunda-platform-get-started/tree/main/nodejs). 


### Install Dependencies

The open source library [zeebe-node](https://www.npmjs.com/package/zeebe-node) provides a Zeebe client.

```bash
npm install --save zeebe-node
```


### Connect your code to the cluster and deploy a process

Once you injected the client credentials as envronment variables the Zeebe client takes the configuration from the environment as follows:


```javascript
const { ZBClient } = require('zeebe-node')

const zbc = new ZBClient()
```

If you encounter connection problems please check your environment varibales ```echo $EEBE_CLIENT_ID```

### Deploy a Process and Start an Instance of the Process

To deploy a process use the following command and specify the filepath of the BPMN file.

```javascript
await zbc.deployProcess(['../resources/hiring-process.bpmn'])
```

To start a new instance you have to specify the `bpmnProcessId`, i.e. `hiring-process` (which is defined in the BPMN file). Furthermore it is possible to add [process variables](https://docs.camunda.io/docs/components/concepts/variables/). Variables are part of a process instance and represent the data of the instance. 

```javascript
const result = await zbc.createProcessInstance('hiring-process', {
	message_content: 'Hello from the Camunda remote test challenge',
})
console.log(result)
```

In this code snippet we start an instance of the process definition with the `bpmnProcessId`: `hiring-process` and additionaly create a process variable called *message_content* that contains a string as a value.

For the complete code see the [`deploy-and-start-instance.js`](deploy-and-start-instance.js) file. To run it use the following command.

```bash
node deploy-and-start-instance.js
```

You can now monitor your instances in [Operate](https://docs.camunda.io/docs/components/operate/). Open the cluster overview in the Console app and launch Operate. In the processes view you will see the process model, a table with running process instances and a filter panel on the left. All instances should be running, visualized with a green token waiting in the Service Task with the name **Hire Me**.  
By selecting the process instance ID in the list of instances you can drill down to a single instance. In this view it is possible to retrieve the process variables.

### Job Worker

In the next step we will spin up a [job worker](https://docs.camunda.io/docs/components/concepts/job-workers/). This is a pice of code connected to the [Service Task](https://docs.camunda.io/docs/components/modeler/bpmn/service-tasks/) in our process, capable of performing a particular task. In our process we will simply print out the variable which we added while starting the process instance.  
To complete a service task, a job worker has to be subscribed to the task type defined in the process, i.e. hiring.  

```javascript
zbc.createWorker({
	taskType: 'hiring',
	taskHandler: job => {
		const { message_content } = job.variables
		console.log(`Message: ${message_content}`)
		job.complete()
	}
})
```

Start the worker and navigate to Operate and you will see your token has moved to the end event, completing the process instance.

```bash
node orchestrate-hiring.js
```

As long the worker is runnning it will automatically request jobs, in our case of the type 'hiring'. That means, whenever we start a new instance of our process and the process token reaches the services task our worker will do the job.  

Congratulations, you have automated a process!


## Test Challenge

In the section above you have learned how to prepare your test setup. We will now ask you to test a new feature manually in our process monitoring application [Operate](https://docs.camunda.io/docs/components/operate/). The feature is specified in the following [issue](https://github.com/mschoe/qa-remote-challenge/issues/1).

This is your task:
1. Transfer the requirements into detailed, comprehensive and well-structured manual test cases.
2. Could you suggest any improvements for the given requirements in the ticket?
3. If you identify issues or potential improvements, please describe the bug/improvement and provide the steps to reproduce.
4. Adjust the test setup according to your needs (for example to be able to start multiple instances or create variables with random values) and add the new code to the result. 

Please provide the result as a shared GitHub repo or send it as text/pdf file via mail. 

### Additional Hints

Please note that this is an open-ended test designed to show us your level of proficiency, there is no binary result.
Please complete it within 7 days from now. We will then review your work and get back to you, typically within 3 working days.

Happy testing! 
