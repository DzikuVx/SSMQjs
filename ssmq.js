var mysqlCredentials = {
    host: null,
    user: null,
    password: null,
    database: null
};

function MySqlQueue (sQueueName) {

    var mysql = require('mysql'),
        connection;

    var queueId = undefined;
    var queuePrepared = false;

    var self = {};

    /**
     * Method get queue id from database
     * If queue is not registered, method adds new entry
     * @private
     */
    var getQueueId = function () {

        connection.query( "SELECT * FROM `queues` WHERE `name`=" + connection.escape(sQueueName) + " LIMIT 1", function(err, rows) {

            if (err) {
                throw err;
            }

            if (rows[0]) {
                queueId = rows[0]['idqueues'];
            }

            if (!queueId) {
                connection.query( "INSERT INTO `queues`(name) VALUES(" + connection.escape(sQueueName) + ")", function(err, result) {

                    if (err) {
                        throw err;
                    }

                    queueId = result.insertId;

                    queuePrepared = true;
                    console.log('we have id');
                });
            } else {
                queuePrepared = true;
                console.log('we have id');
            }
        });
    };

    var connect = function () {

        connection = mysql.createConnection({
            host     : mysqlCredentials.host,
            user     : mysqlCredentials.user,
            password : mysqlCredentials.password,
            database : mysqlCredentials.database
        });

    };

    self.push = function (sMessage, sRecipient, aAttributes) {

        if (queuePrepared) {

            connection.query( "INSERT INTO `messages`(idqueues, recipient, message, attributes) VALUES(" + queueId + ", " + connection.escape(sRecipient) + ", " + connection.escape(sMessage) + ", " + connection.escape(JSON.stringify(aAttributes)) + ")", function(err, result) {

                if (err) {
                    throw err;
                }

                console.log('Inserted');
            });

        } else {
            setTimeout(function () {
                self.push(sMessage, sRecipient, aAttributes);
            }, 10);
        }

    };

    connect();
    getQueueId();

    return self;
}

/**
 * SSMQ factory
 */
var SSMQ = (function () {

    var self = {}
        aQueues = [];

    /**
     * Set credentials for mysq queue
     * @param host
     * @param user
     * @param password
     * @param database
     */
    self.setCredentials = function (host, user, password, database) {

        if (!database) {
            database = 'ssmq';
        }

        mysqlCredentials.host       = host;
        mysqlCredentials.user       = user;
        mysqlCredentials.password   = password;
        mysqlCredentials.database   = database;
    };

    self.create = function (sQueue) {
        if (!aQueues[sQueue]) {
            aQueues[sQueue] = new MySqlQueue(sQueue);
        }

        return aQueues[sQueue];
    };

    return self;
})();

exports.setCredentials = SSMQ.setCredentials;
exports.create = SSMQ.create;