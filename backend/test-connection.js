const { Client } = require('pg');

async function testConnection() {
  const config = {
    host: 'localhost',
    port: 5432,
    user: 'esports_admin',
    password: 'esports_password_2024',
    database: 'esports_platform',
  };

  console.log('Configuración de conexión:');
  console.log(JSON.stringify({...config, password: '***'}, null, 2));
  console.log('\n');

  const client = new Client(config);

  try {
    console.log('Intentando conectar...');
    await client.connect();
    console.log('✅ Conexión exitosa!\n');

    const res = await client.query('SELECT current_user, current_database(), version()');
    console.log('Usuario:', res.rows[0].current_user);
    console.log('Base de datos:', res.rows[0].current_database);
    console.log('Versión:', res.rows[0].version.split('\n')[0]);

    await client.end();
    console.log('\n✅ Prueba completada exitosamente!');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Error:', err.message);
    console.error('Código:', err.code);
    console.error('\nDetalles completos del error:');
    console.error(err);
    await client.end();
    process.exit(1);
  }
}

testConnection();
