'use strict';
require('dotenv').config();
const got = require('got');

process.env.AWS_ACCESSKEYID

async function startBuildWithRetry (result) {
    try {
        var headers = {'accept': 'application/json','content-type': 'application/json'}
        got(process.env.BUILDSERVER +'/build', {retries: 10, json: true, method: 'POST', body: JSON.stringify(result), headers}).then(console.log)
    } catch (e) {
        console.error (e);
    }
}

module.exports.startBuildWithRetry;


