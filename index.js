'use strict';
require('dotenv').config()
require('./functions');
var createHandler = require('travisci-webhook-handler');
var AWS = require('aws-sdk');

AWS.config.update({accessKeyId: process.env.AWS_ACCESSKEYID, secretAccessKey: process.env.AWS_SECRETACCESSKEY});
AWS.config.update({region: 'us-east-1'});
var ec2 = new AWS.EC2();
var dryRun = true;
var instanceId = process.env.AWS_INSTANCEID;
var originalState;

var params = {
    InstanceIds: [instanceId],
    DryRun: dryRun
  };
var http = require('http');
var handler = createHandler({ path: '/webhook', public_key: '-----BEGIN PUBLIC KEY----- MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvtjdLkS+FP+0fPC09j25 y/PiuYDDivIT86COVedvlElk99BBYTrqNaJybxjXbIZ1Q6xFNhOY+iTcBr4E1zJu tizF3Xi0V9tOuP/M8Wn4Y/1lCWbQKlWrNQuqNBmhovF4K3mDCYswVbpgTmp+JQYu Bm9QMdieZMNry5s6aiMA9aSjDlNyedvSENYo18F+NYg1J0C0JiPYTxheCb4optr1 5xNzFKhAkuGs4XTOA5C7Q06GCKtDNf44s/CVE30KODUxBi0MCKaxiXw/yy55zxX2 /YdGphIyQiA5iO1986ZmZCLLW8udz9uhW5jUr3Jlp9LbmphAC61bVSf4ou2YsJaN 0QIDAQAB -----END PUBLIC KEY-----' });


http.createServer(function (req, res) {
  handler(req, res, function (err) {
    res.statusCode = 404
    res.end('no such location')
  })
}).listen(3000);

handler.on('success', async function (event) {
  console.log('Build %s success for %s branch %s, launching server',
  event.payload.number,
  event.payload.repository.name,
  event.payload.branch);
  console.log(functions.getstate);

  ec2.describeInstances(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else {
      var stateCode = data.Reservations[0].Instances[0].State.Code     
      if (stateCode !== 16) {
        originalState = { state: 'notrunning' } ;
      } else {
        originalState = { state: 'running' } ;
      }
      ec2.startInstances(params, async function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else  {   
          console.log(data); // successful response
          var result = await functions.startBuildWithRetry(orignalState)
          console.log(result); // successful response
        }
      });
    }  
  });
});



