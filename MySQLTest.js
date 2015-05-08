var mySQL= require('mysql');
var connection = mySQL.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'anarky7',
  database : 'rawrdbPrueba'
});

connection.connect();

connection.query('SELECT * from User', function(err, rows, fields) {
  	if (!err)
    	console.log('The solution is: ', rows);
  	else{
  		console.log(err);
    	console.log('Error while performing Query.');
	}
});

connection.end();