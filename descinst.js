'use strict';
require('dotenv').config()
var async = require('async');
var AWS = require('aws-sdk');
var createHandler = require('travisci-webhook-handler');


AWS.config.update({accessKeyId: process.env.AWS_ACCESSKEYID, secretAccessKey: process.env.AWS_SECRETACCESSKEY});
AWS.config.update({region: 'us-east-1'});
//var ec2 = new AWS.EC2();

// Create EC2 service object
var ec2 = new AWS.EC2({apiVersion: '2016-11-15'});

var params = {
  DryRun: false,
  InstanceIds: [
    'i-019106df9128e645d',
  ],
};
function checkstate (cb, result) {
    console.log("checking");
    ec2.describeInstances(params, function(err, data) {
    console.log(data.Reservations[0].Instances[0].State.Code);
      //if (data.Reservations[0].Instances[0].State.Code !== '01') {
      if (data.Reservations[0].Instances[0].State.Code !== 16) {
	cb("errr", null);
      } else {
        cb(null,'success');
      }
   });
}

// try calling apiMethod 10 times with exponential backoff
// (i.e. intervals of 400, 800, 1600, 3200, ... milliseconds)
async.retry({
  times: 3,
  interval: function(retryCount) {
    return 200 * Math.pow(2, retryCount);
  }
}, checkstate, function(err, result) {
  console.log(err);
  console.log(result);
});

