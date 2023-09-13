# Group4-cicd-capstone 

<img src="https://img.shields.io/badge/Amazon AWS-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white" />  <img src="](https://github.com/aadyr/group4-cicd-capstone/blob/dev/Group4-CICD-Diagram.png)https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white" />  <img src="https://img.shields.io/badge/Visual_Studio_Code-0078D4?style=for-the-badge&logo=visual%20studio%20code&logoColor=white" />     <img src="https://img.shields.io/badge/Ubuntu-E95420?style=for-the-badge&logo=ubuntu&logoColor=white"/>
<img src="https://img.shields.io/badge/Snyk-4C4A73?style=for-the-badge&logo=snyk&logoColor=white"/>
![Serverless Badge](https://img.shields.io/badge/Serverless-FD5750?logo=serverless&logoColor=fff&style=for-the-badge) ![OWASP Badge](https://img.shields.io/badge/OWASP-000?logo=owasp&logoColor=fff&style=for-the-badge) ![Node.js Badge](https://img.shields.io/badge/Node.js-393?logo=nodedotjs&logoColor=fff&style=for-the-badge) ![AWS Lambda Badge](https://img.shields.io/badge/AWS%20Lambda-F90?logo=awslambda&logoColor=fff&style=for-the-badge) ![Amazon API Gateway Badge](https://img.shields.io/badge/Amazon%20API%20Gateway-FF4F8B?logo=amazonapigateway&logoColor=fff&style=for-the-badge) ![macOS Badge](https://img.shields.io/badge/macOS-000?logo=macos&logoColor=fff&style=for-the-badge) ![Windows Badge](https://img.shields.io/badge/Windows-0078D4?logo=windows&logoColor=fff&style=for-the-badge) ![GitHub Actions Badge](https://img.shields.io/badge/GitHub%20Actions-2088FF?logo=githubactions&logoColor=fff&style=for-the-badge)
![GitHub Badge](https://img.shields.io/badge/GitHub-181717?logo=github&logoColor=fff&style=for-the-badge) ![YAML Badge](https://img.shields.io/badge/YAML-CB171E?logo=yaml&logoColor=fff&style=for-the-badge)

<p align="center">
  <img width="250" src="https://media.giphy.com/media/Dh5q0sShxgp13DwrvG/giphy.gif">
</p>

<p align="center">
  <h1> <strong> CICD for Serverless Application </strong> </h1>
</p>


<img src="https://github.com/aadyr/group4-cicd-capstone/blob/dev/Group4-CICD-Diagram.png" />


This CI/CD workflow is set to run automatically when certain events happen in the GitHub repository. Specifically, it's triggered when code is pushed to the "dev" or "main" branches. These branches are where developers collaborate on code changes.


  
### Branching strategy

 In our branching strategy, we prioritize both the stability of our codebase and the flexibility for developers to work efficiently. To achieve this balance, we've set up specific protections on our 'dev' and 'main' branches. 'Dev' serves as our default branch, reflecting the ongoing development work. All developers are to create their feature branches from 'dev,' only, allowing them to work on their respective features independently.

Here's where our CI/CD pipeline plays a crucial role. We've configured it to automatically trigger when a 'push' command is issued, but with one important condition: all jobs in the GitHub Actions workflow must pass successfully. This meticulous approach ensures that no unverified code enters our main branch.

The 'main' branch, on the other hand, remains protected, serving as a stable and production-ready version of our software/applicantion/API. Only when the conditions are met successfully (job completions) in our workflow, will 'dev' be allowed to merge into 'main.' This way, we maintain code quality and minimize the risk of introducing bugs or issues into our production environment.

By safeguarding 'dev' and 'main' and implementing this trigger-based merging approach, we strike a harmonious balance between development agility and code reliability in our branching strategy.

 <img src="https://github.com/aadyr/group4-cicd-capstone/blob/dev/Github_branches.png" />



### On Event Tigger & Pre-deploy

- The Github action workflow would tigger upon a push command
- When the workflow starts, the first job is called "pre-deploy." It runs on a virtual machine with Ubuntu.
- In this job, the pipeline simply prints a message indicating that it was triggered by a specific event (like a push to the repository). This step helps us understand why the workflow ran.

<details>

```yml
on:
  push:
    branches: [dev, main]

jobs:
  pre-deploy:
    runs-on: ubuntu-latest
    steps:
      - run: echo "The job is automatically triggered by a ${{ github.event_name }} event."
```
</details>


### Install-dependencies

- After the pre-deploy job, the pipeline moves to "install-dependencies."
-  This job checks out the code from the repository and then installs the necessary software libraries or modules (dependencies) required for the application to work. It uses Node.js and the npm package manager for this.
- Automation here is crucial because it ensures that the right dependencies are installed without manual intervention.


<details>

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

</details>

### Unit-testing

- Once the dependencies are installed, the workflow proceeds to "unit-testing."
-  In this job, it checks out the code again, installs dependencies one more time (just to be sure), and then runs unit tests to make sure that the code behaves as expected.
-   Automating unit tests ensures code quality and prevents issues from being deployed.

<details>

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
</details>

### Package-Audit

- The next job is "package-audit."
- It checks out the code, installs dependencies, and then performs a security audit on those dependencies to find and report any known vulnerabilities.
- Security is crucial for any application, and automating security checks helps catch vulnerabilities early.

<details> 

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


 <img src="https://github.com/aadyr/group4-cicd-capstone/blob/dev/synk_scan.png"/>
  
### Adding Synk to CICD pipeline for vulnerability scanning and monitoring

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
</details>

### Deploy-dev

- If all the previous jobs are successful, we move on to "deploy-dev."
- This job checks out the code, sets up Node.js, installs dependencies, and then deploys the application to a development environment using the Serverless Framework.
- Automation ensures that code changes are automatically deployed to the dev environment, reducing manual effort.

<details>

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

</details>


### Zap Scan Api

- After deployment, we have a job called "zap_scan."
- This job shows the API Gateway URL (a web service endpoint) and then performs an OWASP security scan on the deployed application.
- Again, automation is important for security checks, as it helps identify vulnerabilities in the running application.

<details>

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

<img src="https://github.com/aadyr/group4-cicd-capstone/blob/dev/zap_scan.png"/>

</details>

### Merge

- If all previous jobs succeed, we move to "merge."
- This job checks out the code, and if everything looks good, it merges the changes from the "dev" branch into the "main" branch.
- Automation here ensures that code changes from development are smoothly integrated into the production branch.

<details>

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
</details>

### Deploy-production

- Finally, we have "deploy-production," which deploys the application to a production environment. This job is triggered when changes are merged into the "main" branch.
- It checks out the code, sets up Node.js, installs dependencies, and deploys the application to a production environment.
- Automation guarantees that code is consistently deployed to the production environment when it's ready.

<details>
  
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
</details>

In summary, this CI/CD pipeline automates the process of building, testing, securing, and deploying a Serverless Application. Automation ensures that code changes are thoroughly tested, secure, and reliably deployed, reducing manual effort and human error. It's a crucial part of modern software development to maintain code quality and security.


### Serverless 

##### This section explains the ```serverless.yml``` 

This YAML configuration is for the Serverless Framework.  It makes it easy to deploy serverless applications on cloud platforms like AWS.  This configuration would create a AWS Lambda function exposed by an HTTP endpoint, and other related AWS resources like an S3 bucket and an API Gateway.

It will also craete unique Function names like ```Group4-prod-Capstone``` and ```Group4-dev-Capstone``` which defines the service name, the stage where it was deployed and the unique function name.

![Screenshot 2023-09-05 at 11 14 06 PM](https://github.com/vincent8055/gp4-vincent/assets/127754761/25e1c2f6-5a3f-498e-b5c5-92762d48bd10)


<details>  

```
service: Group4
frameworkVersion: '3'

provider: 
 name: aws
 runtime: nodejs18.x
 region: ap-southeast-1
 deploymentBucket:
    name: cohort2.serverless.deploys

functions:
  Capstone:  
    handler: index.handler
    events:
    -  httpApi:
        path: /
        method: get
    environment:
      ACCESS_KEY: ${ssm:Group4-Parameter}

#plugins:
#  - serverless-offline

```

 ```service: Group4```

This defines the name of the serverless service.  It gives a unique name to this collection of functions, which is useful for deploying and referencing the stack.

```frameworkVersion: '3'```

The version of the Serverless frameework.  The framework knows which version's rules to follow when deploying the service.

```provider```

Beings the declaration for the cloud service provider-specifc configurations.  

```name: aws```
In this configuration, the spedified cloud provider is AWS and the serverless framework will deploy this service to AWS.

```runtime: nodejs18.x```

Tells the Serverless framework and AWS Lambda to use the Node.js 18.x runtime.

```region: ap-southeast-1```

This line specifies the AWS region for deployment.

```deploymentBucket```

Specify details about the S3 bucket used to deploy to.

```name: cohort2.serverless.deploys```

The name of the S3 bucket to use.  Deployment packages will be stored in this bucket during deployment.

```function```

Begins the declaration of functions in this service.  

```Capstone:```

The unique name for the service 

```handler: index.handler```

This line tells AWS Lambda the code is in the ```index``` file and the function is to execute is named ```handler```.

```events:```

Define triggers for the ```Capstone:``` functions.

```- httpApi:```

To specify that the function will respond will respond to HTTP requests.  

```path: /```

The API endpoint's path is the root.  The serverless framework will know the URL path to configure in AWS API Gateway.

```method: get```

This specifies which HTTP request type will trigger this function.

```environment: ```

This declares the declaration for environment variables for this function.

```ACCESS_KEY: $(ssm:Group4-Parameter)```

This will securely provide the function with a value from the AWS SSM Parameter Store.

</details>

![McDonald's Badge](https://img.shields.io/badge/McDonald's-FBC817?logo=mcdonalds&logoColor=000&style=for-the-badge)

 <img src="https://github.com/aadyr/group4-cicd-capstone/blob/dev/qrcode1.png"/> 


 <img src="https://img.shields.io/badge/Ask%20me-anything-1abc9c.svg"/> 
