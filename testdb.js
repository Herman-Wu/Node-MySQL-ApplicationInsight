// You should include context, other arguments are optional
//module.exports = function(context, myTrigger, myInput, myOtherInput) {

    var mysql      = require('mysql');
    var connection = mysql.createConnection({
    host     : '[!! MySQL Srver IP !!]',
    user     : '[!! user account !!]',
    password : '[!! password !!]',
    database : '[!!data base !!]',
    port: '3309'
    });
    
    connection.connect();
    
    const appInsights = require("applicationinsights");
    appInsights.setup("[!! Azure Application Insight Key !!]")
    .setAutoDependencyCorrelation(true)
    .setAutoCollectRequests(true)
    .setAutoCollectPerformance(true)
    .setAutoCollectExceptions(true)
    .setAutoCollectDependencies(true)
    .setAutoCollectConsole(true)
    .setUseDiskRetryCaching(true)
    .start();

    let client = appInsights.defaultClient;

    client.trackEvent({name: "TrackMySQLConn", properties: {customProperty: "Start"}});


    var sql='SELECT * FROM `sampledb`.`sampletable` LIMIT 10;';


    var hrstart = process.hrtime()

    try {
        connection.query(sql,function (err, result) {
            if(err){
            console.log('[SELECT ERROR] - ',err.message);
            client.trackException({exception: err});
            client.trackEvent({name: "TrackMySQLConn", properties: {customProperty: "Failed"}});

            return;
            }

        console.log('--------------------------SELECT----------------------------');
        console.log(result);
        console.log('------------------------------------------------------------\n\n');  
        });

        connection.end();
    } catch (e)
    {
        client.trackException({exception: e});

    }

    hrend = process.hrtime(hrstart)

    console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)

    client.trackEvent({name: "TrackMySQLConn", properties: {customProperty: "End"}});
    client.trackMetric({name: "Test Connect MySQL Executing Time (nanoseconds) ", value: hrend[0] * 1e9 + hrend[1]});

    // function logic goes here :)
 //   context.done();
//};
