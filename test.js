var ssmq = require('./ssmq');

ssmq.setCredentials('localhost', 'ssmq', 'ssmq');

var queue = ssmq.create('testQueue');

queue.push('Message A');
queue.push('Message A','aaa');
queue.push('Message A','aaa', {attr1: 'attr1', attr2: 2});