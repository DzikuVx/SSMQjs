var ssmq = require('./ssmq');

ssmq.setCredentials('localhost', 'ssmq', 'ssmq');

var queue = ssmq.create('testQueue');

queue.push('Message A');
queue.push('Message A');