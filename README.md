## My portfolio infrastructure

This is a personal portfolio infrastructure built with CDK and TypeScript.

---

### Useful commands


```
$ npm run build # compile TypeScript to JavaScript
$ npm run watch # watch for changes and compile
$ npm run test # run the Jest unit tests
$ cdk deploy # deploy this stack to your default AWS account and region
$ cdk diff # compare deployed stack with current state
$ cdk synth # emit the synthesized CloudFormation template
```



### Amplify (Frontend)

This will create a ready-to-go Amplify app host that will take the "personal-portofolio-frontend" repo and, using the build template, run a static NextJS SPA.

- The GitHub access token is stored in AWS Secret Manager.
- On the first creation of the resources, manual deployment is required. I will fix this.

### Backend (Strapi Image)

This is an ECS Fargate processing setup that has been adjusted to use only Fargate Spot instances.

### Helpers (Lambda controller ECS Service)

This creates a URL Lambda that will have two functions:
- Change the desired count for the ECS Fargate Service
- Get the public IP of the last created Fargate task

## Tasks

#### General

- [ ] Add ESLint
- [ ] Create scripts to automate CDK deployment
- [ ] Add testing

#### Helpers

- [x] Update Lambda URL to control Fargate tasks
- [x] Change desired task count for ECS Fargate Service
- [x] Get IP of last created Fargate task
- [ ] Return status of Service/Task

#### Backend

- [ ] Automate deployment with GitHub Actions when a change is made to the main branch
- [ ] Create a policy to delete unused ECR images