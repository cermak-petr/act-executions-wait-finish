const Apify = require('apify');
const _ = require('underscore');
const Promise = require('bluebird');
const request = require('request-promise');
Apify.setPromisesDependency(Promise);

function waitForFinish(execId, callback){
    const interval = setInterval(async function(){
        const exec = await Apify.client.crawlers.getExecutionDetails({executionId: execId});
        if(exec.status != 'RUNNING'){
            clearInterval(interval);
            callback(null, exec);
        }
    }, 1000);
}
const waitForFinishAsync = Promise.promisify(waitForFinish);

async function waitForExecs(execIds){
    const waitPromises = [];
    _.each(execIds, function(eId){
        console.log('waiting for finish, crawlerId: ' + eId);
        waitPromises.push(waitForFinishAsync(eId));
    });
    await Promise.all(waitPromises);
    console.log('all executions finished');
}

async function postWebhook(url, execIds){
    const options = {
        method: 'POST',
        uri: 'url,
        body: execIds,
        json: true
    };
    await request(options);
}

Apify.main(async () => {
    const input = await Apify.getValue('INPUT');
    if(!input.executionIds){
        console.log('ERROR: missing "executionIds" attribute in INPUT');
        return null;
    }
    if(!input.finalWebhook){
        console.log('ERROR: missing "finalWebhook" attribute in INPUT');
        return null;
    }
    await waitForExecs(input.executionIds);
    await Apify.setValue('OUTPUT', {executionIds: input.executionIds});
    await postWebhook(input.finalWebhook, input.executionIds);
    console.dir(execIds);
});
