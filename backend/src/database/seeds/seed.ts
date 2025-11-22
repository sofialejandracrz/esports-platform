import { NestFactory } from '@nestjs/core';
import { SeederModule } from './seeder.module';
import { SeederService } from './seeder.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeederModule);
  
  const seeder = app.get(SeederService);
  
  try {
    await seeder.seed();
    console.log('\n🎉 Proceso de seeding completado exitosamente!\n');
  } catch (error) {
    console.error('\n❌ Error durante el seeding:', error);
    throw error;
  } finally {
    await app.close();
  }
}

bootstrap()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
