# Group4-cicd-capstone 

<img src="https://img.shields.io/badge/Amazon AWS-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white" />   [<img src="](https://github.com/aadyr/group4-cicd-capstone/blob/dev/Group4-CICD-Diagram.png)https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white" />  <img src="https://img.shields.io/badge/Visual_Studio_Code-0078D4?style=for-the-badge&logo=visual%20studio%20code&logoColor=white" />     <img src="https://img.shields.io/badge/Ubuntu-E95420?style=for-the-badge&logo=ubuntu&logoColor=white"/>
<img src="https://img.shields.io/badge/Snyk-4C4A73?style=for-the-badge&logo=snyk&logoColor=white"/>
![Serverless Badge](https://img.shields.io/badge/Serverless-FD5750?logo=serverless&logoColor=fff&style=for-the-badge) ![OWASP Badge](https://img.shields.io/badge/OWASP-000?logo=owasp&logoColor=fff&style=for-the-badge) ![Node.js Badge](https://img.shields.io/badge/Node.js-393?logo=nodedotjs&logoColor=fff&style=for-the-badge) ![AWS Lambda Badge](https://img.shields.io/badge/AWS%20Lambda-F90?logo=awslambda&logoColor=fff&style=for-the-badge) ![Amazon API Gateway Badge](https://img.shields.io/badge/Amazon%20API%20Gateway-FF4F8B?logo=amazonapigateway&logoColor=fff&style=for-the-badge) ![Microsoft Badge](https://img.shields.io/badge/Microsoft-5E5E5E?logo=microsoft&logoColor=fff&style=for-the-badge)
![Apple Badge](https://img.shields.io/badge/Apple-000?logo=apple&logoColor=fff&style=for-the-badge)


<p align="center">
  <img width="250" src="https://media.giphy.com/media/Dh5q0sShxgp13DwrvG/giphy.gif">
</p>

<p align="center">
  <h1> <strong> CICD for Serverless Application </strong> </h1>
</p>


<img src="https://github.com/aadyr/group4-cicd-capstone/blob/dev/Group4-CICD-Diagram.png" />

This defines a human-readable name for the GitHub Action workflow.
It helps to identify what this particular workflow does at a glance.
Nothing happens after this; it's a descriptor.
No files generated.
Use this to give a meaningful name to your GitHub Actions workflow.
run-name: ${{ github.actor }} is doing CICD for serverless application

This line determines the run's name and will display the name of the actor (usually the person or bot) executing the action followed by the message.
Helps to identify who triggered the action.
Nothing happens after this.
No files generated.
Use this to customize the run's display name.
on:

This keyword defines which GitHub events this workflow will react to.
It sets the criteria to initiate the actions.
Checks for the event configurations that follow.
No files generated.
Use this to define when the workflow should be triggered.
push:
branches: [ dev , main]

This action will be triggered on a push event specifically on 'dev' and 'main' branches.
Ensures that workflow runs only for the specified branches.
GitHub Actions waits for a push to the specified branches.
No files generated.
When you want to trigger workflows only for specific branches.
jobs:

Here you're defining the collection of jobs to run.
It's the beginning of the workflow logic.
GitHub Actions expects individual job definitions next.
No files generated.
Use this when laying out the various steps/tasks in your workflow.
Now, for each job, the structure is similar:

runs-on: This is where the job will execute. For this workflow, all jobs run on the latest version of Ubuntu.
needs: Specifies job dependencies, meaning one job won't run until another completes.
steps: These are the individual actions the job will execute.
pre-deploy:

This job is to display an echo message.

### install-dependencies:

This job checks out your repository code and installs npm dependencies.

```yml
  install-dependencies:
    runs-on: ubuntu-latest
    needs: pre-deploy
    steps:
      - name: Check out repository code
        uses: actions/checkout@v3
      - name: Run installation of dependencies commands
        run: npm install
```


### unit-testing:

It checks out the repository, installs dependencies, and then runs unit tests.

```yml
unit-testing:
    runs-on: ubuntu-latest
    needs: install-dependencies
    steps:
      - name: Check out repository code
        uses: actions/checkout@v3
      - name: Run installation of dependencies commands
        run: npm install # all the module require is in package.json
      - name: Run unit testing commands
        run: npm test
```

### package-audit:


It checks for vulnerabilities in the npm packages and uses Snyk to monitor and report them.

```yml
 package-audit:
    runs-on: ubuntu-latest
    needs: unit-testing
    steps:
      - name: Check out repository code
        uses: actions/checkout@v3
      - name: Run installation of dependencies commands
        run: npm install # all the module require is in package.json
      - name: Run unit testing commands
        run: npm audit
      - name: Run Snyk to check for vulnerabilities
        uses: snyk/actions/node@master
        env:
         SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
         command: monitor
```

#### Adding Synk to CICD pipeline for vulnerability scanning and monitoring

1) Create a Snyk Account:
If you don't have a Snyk account, you'll need to create one at https://snyk.io/signup.

2) Add your Project to Snyk:
Log in to your Snyk account and add your project to the Snyk dashboard. This involves connecting your repository to Snyk.

3) Get API Token:
In your Snyk account, generate an API token. This token will be used in GitHub Actions to authenticate with your Snyk account. https://app.snyk.io/account

4) Add GitHub Secret:
In your GitHub repository, go to "Settings" > "Secrets" > "New repository secret" and add a secret named SNYK_TOKEN with the value being your Snyk API token.

5) add below code to your workflow

```yml
name: Example workflow using Snyk
on: push
jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@master
      - name: Run Snyk to check for vulnerabilities
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          command: monitor
```

### deploy-dev:

This job does the following:

Checks out the repository.
Sets up the desired Node.js version.
Installs npm dependencies.
Deploys the serverless application to a 'dev' environment.
Pauses the workflow for 60 seconds to allow the AWS Lambda function to deploy.

```yml
 deploy-dev:
    runs-on: ubuntu-latest
    needs: package-audit
    steps:
      - uses: actions/checkout@v3
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
         node-version: ${{ matrix.node-version }}
      - run: npm ci
      - name: serverless deploy
        uses: serverless/github-action@v3.2
        with:
          args: deploy --stage=dev
        env:
             AWS_ACCESS_KEY_ID:  ${{ secrets.AWS_ACCESS_KEY_ID }}
             AWS_SECRET_ACCESS_KEY:  ${{ secrets.AWS_SECRET_ACCESS_KEY }}
      - name: Sleep for 60 seconds #wait for lambda to be deploy
        run: sleep 60
```

### zap_scan:

It displays an API Gateway URL and scans a hardcoded target using OWASP ZAP, a tool for finding vulnerabilities in web apps.

```yml
 zap_scan:
    runs-on: ubuntu-latest
    needs: deploy-dev
    name: OWASP Scan the webapplication
    steps:
      - name: Show API Gateway URL
        run: echo "API_Gateway_URL:" $api_gateway_url 
      - name: ZAP Scan
        uses: zaproxy/action-api-scan@v0.5.0
        with:
          target: https://9w2itn60t2.execute-api.ap-southeast-1.amazonaws.com
```

### merge:

This job merges the 'dev' branch to 'main'.

```yml
  merge:
    runs-on: ubuntu-latest
    needs: [zap_scan]
    steps:
      - uses: actions/checkout@master
      - name: Merge dev -> Main
        uses: devmasx/merge-branch@v1.4.0
        with:
          type: now
          target_branch: main
          github_token: ${{ secrets.GITHUB_TOKEN }}

```

### deploy-production:

This job:

Checks out the 'main' branch.
Sets up Node.js.
Installs npm dependencies.
Deploys the serverless application to a 'prod' environment.
For each of the above jobs:

The structure, as explained, describes the job's actions.
Jobs perform different tasks, from unit testing to deployment.
After each job, the next one (based on the 'needs' key) will run.
GitHub Actions maintains a log of each job. No specific new files are generated unless the job itself is designed to create files.
Use jobs to structure your CI/CD process in a logical and sequential manner.
Finally, many steps utilize the "uses:" key to refer to pre-built actions available in the GitHub marketplace. For example, "actions/checkout@v3" is a common action to checkout your code from the repository. Other actions like "serverless/github-action@v3.2" are specialized for specific tasks—in this case, deploying serverless applications.

The ${{ }} syntax is used for expressions in GitHub Actions, allowing for dynamic values, such as secrets, to be used. For instance, ${{ secrets.AWS_ACCESS_KEY_ID }} retrieves the AWS_ACCESS_KEY_ID from the repository's secrets, ensuring sensitive data isn't hard-coded or exposed.

This entire workflow seems designed for a serverless Node.js application. It sets up CI/CD, deploying to a development environment, performing scans, merging to the main branch, and deploying to production. Use such workflows to automate your deployment process and maintain code quality for serverless applications.

``` yml
deploy-prod: #using new IAM user as g4p
    runs-on: ubuntu-latest
    needs: merge
    steps:
      - uses: actions/checkout@v3
        with:
         ref: refs/heads/main
      - run: git checkout main  
      - uses: actions/checkout@v3
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
         node-version: ${{ matrix.node-version }}
      - run: npm ci
      - name: serverless deploy
        uses: serverless/github-action@v3.2
        with:
          args: deploy --stage=prod
        env:
             AWS_ACCESS_KEY_ID:  ${{ secrets.AWS_ACCESS_KEY_ID }}
             AWS_SECRET_ACCESS_KEY:  ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

Last Line


### Global Configuration

**name: CICD for Serverless Application**
1. `name:` - Declares a key in YAML. This is the name of your workflow.
2. `CICD for Serverless Application` - This is the name of the workflow.
3. Purpose: To give a descriptive name for the workflow.
4. Execution: None, it's a descriptor.
5. Generated files: None.
6. Usage: To define the name of a workflow that appears in the GitHub Actions UI.

**run-name: ${{ github.actor }} is doing CICD for serverless application**
1. `run-name:` - Specifies the name of each individual run of the workflow.
2. `${{ github.actor }}` - Refers to the username of the person who initiated the event triggering this action.
3. Purpose: To provide a specific name for individual workflow runs.
4. Execution: Each run will have a name like "user123 is doing CICD for serverless application."
5. Generated files: None.
6. Usage: For better logging and identification of workflow runs.

### Event Triggers

**on:**
1. `on:` - Declares the events that will trigger the workflow.
2. Purpose: To specify when this workflow should run.
3. Execution: Workflow waits for the specified event.
4. Generated files: None.
5. Usage: To define the events that will initiate the workflow.

**push:**
1. `push:` - An event that triggers when commits are pushed.
2. Purpose: To initiate the workflow on a push event.
3. Execution: Workflow triggers when there's a push to the specified branches.
4. Generated files: None.
5. Usage: Commonly used to initiate workflows upon code pushes.

**branches: [dev, main]**
1. `branches:` - Specifies which branches this event applies to.
2. `[dev, main]` - Only triggers for `dev` and `main` branches.
3. Purpose: To narrow down the push event to specific branches.
4. Execution: Workflow will start if a push event happens on either `dev` or `main` branches.
5. Generated files: None.
6. Usage: To selectively run workflows for specific branches.

### Job Definitions

Note: The pattern here is repetitive for each job. Each job has `runs-on`, which defines the type of runner the job will execute on. `steps` then define a series of commands/actions the job will perform.

**jobs:**
1. `jobs:` - Begins the definition of all jobs in the workflow.
2. Purpose: To group and list all the jobs for the workflow.
3. Execution: None, it's a structure.
4. Generated files: None.
5. Usage: Always used in GitHub Actions to define the set of jobs.

**pre-deploy:**
1. `pre-deploy:` - Name of the job.
2. Purpose: To define a specific job with its steps.
3. Execution: None yet, it's a descriptor.
4. Generated files: None.
5. Usage: Each job in a workflow is named, and this is the name of this job.

**runs-on: ubuntu-latest**
1. `runs-on:` - Specifies where the job runs.
2. `ubuntu-latest` - The latest version of the Ubuntu runner.
3. Purpose: To define which type of runner to use.
4. Execution: The job will use an Ubuntu virtual machine.
5. Generated files: None.
6. Usage: To specify the environment where the job will be executed.

(For brevity, I will cover unique steps, and not repeat explanations for shared steps.)

### Job: pre-deploy

**- run: echo "The job is automatically triggered by a ${{ github.event_name }} event."**
1. `- run:` - Executes the following shell command.
2. `echo` - Shell command to print something.
3. `${{ github.event_name }}` - Dynamic value that provides the name of the event that triggered the workflow.
4. Purpose: To print a message telling which event triggered this job.
5. Execution: The message is displayed in the workflow logs.
6. Generated files: None.
7. Usage: For logging/debugging purposes.

### Job: install-dependencies

**- name: Check out repository code**
1. `- name:` - Provides a friendly name for the following step.
2. `Check out repository code` - A human-readable name for this step.
3. Purpose: To describe the step for better logging/visibility.
4. Execution: None, it's a descriptor.
5. Generated files: None.
6. Usage: Optional for giving a name to a step in the workflow.

**uses: actions/checkout@v3**
1. `uses:` - This step uses a public action.
2. `actions/checkout@v3` - Specifies the `checkout` action from the `actions` repository, version 3.
3. Purpose: To checkout the code from the current repository into the runner so subsequent steps can access it.
4. Execution: The runner will have the repository's code in its workspace.
5. Generated files: The repository's files.
6. Usage: Almost always used if the workflow interacts with the repository's code.

**- run: npm install**
1. `- run:` - Execute the following command.
2. `npm install` - Node.js command to install all project dependencies.
3. Purpose: To install required dependencies for the project.
4. Execution: Node modules are installed.
5. Generated files: `node_modules/` directory and possibly updates to `package-lock.json`.
6. Usage: Required for Node.js projects to install dependencies before running/testing/deploying.

### Job: unit-testing

**- run: npm test**
1. `npm test` - Node.js command to run unit tests.
2. Purpose: To execute unit tests and ensure code quality.
3. Execution: Tests are run, and any failures will halt the workflow.
4. Generated files: None typically, but depends on test configurations.
5. Usage: To automate testing in the CI process.

### Job: package-audit

**- run: npm audit**
1. `npm audit` - Node.js command that reviews project dependencies for known vulnerabilities.
2. Purpose: To identify and alert on security vulnerabilities.
3. Execution: An audit report is generated.
4. Generated files: None.
5. Usage: To maintain security by ensuring dependencies are free of known vulnerabilities.

**uses: snyk/actions/node@master**
1. Uses the Snyk action, a tool for finding and fixing vulnerabilities in dependencies.
2. Purpose: Another layer of security scanning.
3. Execution: Snyk scans the project and might fail the workflow if vulnerabilities are found.
4. Generated files: None typically, but depends on Snyk configurations.
5. Usage: To enhance security by ensuring dependencies are free of known vulnerabilities.

### Job: deploy-dev

**args: deploy --stage=dev**
1. Provides arguments to the `serverless` deployment command to deploy to a `dev` stage.
2. Purpose: To deploy the serverless application in a development environment.
3. Execution: Serverless framework deploys the app to a dev stage.
4. Generated files: None directly, but serverless resources are created/


 <img src="https://img.shields.io/badge/Ask%20me-anything-1abc9c.svg"/>
