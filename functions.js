'use strict';
require('dotenv').config();
const got = require('got');
var buildServer = process.env.BUILDSERVER;

async function startBuildWithRetry (result) {
    try {
        var headers = {'accept': 'application/json','content-type': 'application/json'}
        return await got(buildServer +'/build', {retries: 10, json: true, method: 'POST', body: JSON.stringify(result), headers});
    } catch (e) {
        console.error (e);
    }
}

module.exports.startBuildWithRetry;


