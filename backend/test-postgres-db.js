const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'esports_admin',
  password: 'test123',
  database: 'postgres', // Intentando con la base de datos por defecto
});

console.log('Probando conexión a base de datos postgres...');

client.connect()
  .then(() => {
    console.log('\n✅ ¡Conexión exitosa a postgres!');
    return client.query('SELECT current_database()');
  })
  .then((res) => {
    console.log('Base de datos:', res.rows[0].current_database);
    client.end();
  })
  .catch((err) => {
    console.error('\n❌ Error:', err.message);
    client.end();
    process.exit(1);
  });
