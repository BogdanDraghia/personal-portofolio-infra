#!/usr/bin/env node
import cdk = require('aws-cdk-lib');
import {AmplifyInfraStack} from '../lib/amplify-infra-stack'
import {BackendInfraStrack} from '../lib/backend-infra-stack'
import { HelpersInfraStack } from '../lib/helpers-infra-stack';
const app = new cdk.App();

new BackendInfraStrack(app,'BackendInfraStrack',{

})

new AmplifyInfraStack(app, 'AmplifyInfraStack', {
    
});

new HelpersInfraStack(app, 'HelpersInfraStack', {
    
});


app.synth();