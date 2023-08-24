# Group4-cicd-pipeline
<img src="https://img.shields.io/badge/Amazon AWS-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white" />   <img src="https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white" />  <img src="https://img.shields.io/badge/Visual_Studio_Code-0078D4?style=for-the-badge&logo=visual%20studio%20code&logoColor=white" />     <img src="https://img.shields.io/badge/Ubuntu-E95420?style=for-the-badge&logo=ubuntu&logoColor=white"/>   ![alt text](https://github.com/ioctlsg/group4-cicd-pipeline/blob/main/serverless.png?)
<img src="https://img.shields.io/badge/Snyk-4C4A73?style=for-the-badge&logo=snyk&logoColor=white"/>

<img src="https://img.shields.io/github/aadyr/aadyr/group4-cicd-pipeline/:main" />


<p align="center">
  <img width="250" src="https://media.giphy.com/media/Dh5q0sShxgp13DwrvG/giphy.gif">
</p>


# Adding Synk to CICD pipeline for vulnerability scanning and monitoring

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


 <img src="https://img.shields.io/badge/Ask%20me-anything-1abc9c.svg"/>
