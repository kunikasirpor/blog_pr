import mysql from 'mysql2';

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'blogs'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('MySQL Connected!');
});

export default connection;
