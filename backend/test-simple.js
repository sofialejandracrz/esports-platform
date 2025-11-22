const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'esports_admin',
  password: 'test123',
  database: 'esports_platform',
});

console.log('Probando con contraseña simple: test123');

client.connect()
  .then(() => {
    console.log('\n✅ ¡Conexión exitosa!');
    return client.query('SELECT current_user');
  })
  .then((res) => {
    console.log('Usuario:', res.rows[0].current_user);
    client.end();
  })
  .catch((err) => {
    console.error('\n❌ Error:', err.message);
    client.end();
    process.exit(1);
  });
