import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CatalogoRol } from '../../modules/catalogo-rol/entities/catalogo-rol.entity';
import { CatalogoGenero } from '../../modules/catalogo-genero/entities/catalogo-genero.entity';
import { CatalogoEstadoAmistad } from '../../modules/catalogo-estado-amistad/entities/catalogo-estado-amistad.entity';
import { CatalogoEstadoInscripcion } from '../../modules/catalogo-estado-inscripcion/entities/catalogo-estado-inscripcion.entity';
import { CatalogoEstadoTorneo } from '../../modules/catalogo-estado-torneo/entities/catalogo-estado-torneo.entity';
import { CatalogoOrigenTransaccion } from '../../modules/catalogo-origen-transaccion/entities/catalogo-origen-transaccion.entity';
import { CatalogoPlataforma } from '../../modules/catalogo-plataforma/entities/catalogo-plataforma.entity';
import { CatalogoRegion } from '../../modules/catalogo-region/entities/catalogo-region.entity';
import { CatalogoTipoEntrada } from '../../modules/catalogo-tipo-entrada/entities/catalogo-tipo-entrada.entity';
import { CatalogoTipoItem } from '../../modules/catalogo-tipo-item/entities/catalogo-tipo-item.entity';
import { CatalogoTransaccionTipo } from '../../modules/catalogo-transaccion-tipo/entities/catalogo-transaccion-tipo.entity';
import { Persona } from '../../modules/persona/entities/persona.entity';
import { Usuario } from '../../modules/usuario/entities/usuario.entity';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(CatalogoRol)
    private readonly rolRepository: Repository<CatalogoRol>,
    @InjectRepository(CatalogoGenero)
    private readonly generoRepository: Repository<CatalogoGenero>,
    @InjectRepository(CatalogoEstadoAmistad)
    private readonly estadoAmistadRepository: Repository<CatalogoEstadoAmistad>,
    @InjectRepository(CatalogoEstadoInscripcion)
    private readonly estadoInscripcionRepository: Repository<CatalogoEstadoInscripcion>,
    @InjectRepository(CatalogoEstadoTorneo)
    private readonly estadoTorneoRepository: Repository<CatalogoEstadoTorneo>,
    @InjectRepository(CatalogoOrigenTransaccion)
    private readonly origenTransaccionRepository: Repository<CatalogoOrigenTransaccion>,
    @InjectRepository(CatalogoPlataforma)
    private readonly plataformaRepository: Repository<CatalogoPlataforma>,
    @InjectRepository(CatalogoRegion)
    private readonly regionRepository: Repository<CatalogoRegion>,
    @InjectRepository(CatalogoTipoEntrada)
    private readonly tipoEntradaRepository: Repository<CatalogoTipoEntrada>,
    @InjectRepository(CatalogoTipoItem)
    private readonly tipoItemRepository: Repository<CatalogoTipoItem>,
    @InjectRepository(CatalogoTransaccionTipo)
    private readonly transaccionTipoRepository: Repository<CatalogoTransaccionTipo>,
    @InjectRepository(Persona)
    private readonly personaRepository: Repository<Persona>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async seed() {
    console.log('🌱 Verificando seeds...');

    // Verificar si ya se ejecutaron los seeds anteriormente
    const adminExists = await this.usuarioRepository.findOne({
      where: { nickname: 'admin' },
    });

    const rolesExist = await this.rolRepository.count();

    if (adminExists && rolesExist > 0) {
      console.log('⏭️  Seeds ya ejecutados previamente. Saltando...');
      console.log('💡 Para forzar la re-ejecución, elimina el usuario admin de la base de datos.');
      return;
    }

    console.log('🌱 Iniciando seeds...');

    await this.seedRoles();
    await this.seedGeneros();
    await this.seedEstadosAmistad();
    await this.seedEstadosInscripcion();
    await this.seedEstadosTorneo();
    await this.seedOrigenesTransaccion();
    await this.seedPlataformas();
    await this.seedRegiones();
    await this.seedTiposEntrada();
    await this.seedTiposItem();
    await this.seedTiposTransaccion();
    await this.seedAdminUser();

    console.log('✅ Seeds completados exitosamente!');
  }

  private async seedRoles() {
    const roles = ['admin', 'usuario', 'moderador'];
    
    for (const valor of roles) {
      const exists = await this.rolRepository.findOne({ where: { valor } });
      if (!exists) {
        await this.rolRepository.save({ valor });
        console.log(`  ✓ Rol creado: ${valor}`);
      }
    }
  }

  private async seedGeneros() {
    const generos = ['Masculino', 'Femenino', 'Otro', 'Prefiero no decir'];
    
    for (const valor of generos) {
      const exists = await this.generoRepository.findOne({ where: { valor } });
      if (!exists) {
        await this.generoRepository.save({ valor });
        console.log(`  ✓ Género creado: ${valor}`);
      }
    }
  }

  private async seedEstadosAmistad() {
    const estados = ['pendiente', 'aceptada', 'rechazada', 'bloqueada'];
    
    for (const valor of estados) {
      const exists = await this.estadoAmistadRepository.findOne({ where: { valor } });
      if (!exists) {
        await this.estadoAmistadRepository.save({ valor });
        console.log(`  ✓ Estado de amistad creado: ${valor}`);
      }
    }
  }

  private async seedEstadosInscripcion() {
    const estados = ['pendiente', 'confirmada', 'cancelada', 'rechazada'];
    
    for (const valor of estados) {
      const exists = await this.estadoInscripcionRepository.findOne({ where: { valor } });
      if (!exists) {
        await this.estadoInscripcionRepository.save({ valor });
        console.log(`  ✓ Estado de inscripción creado: ${valor}`);
      }
    }
  }

  private async seedEstadosTorneo() {
    const estados = ['borrador', 'abierto', 'en_curso', 'finalizado', 'cancelado'];
    
    for (const valor of estados) {
      const exists = await this.estadoTorneoRepository.findOne({ where: { valor } });
      if (!exists) {
        await this.estadoTorneoRepository.save({ valor });
        console.log(`  ✓ Estado de torneo creado: ${valor}`);
      }
    }
  }

  private async seedOrigenesTransaccion() {
    const origenes = ['compra', 'premio', 'reembolso', 'regalo', 'logro', 'torneo'];
    
    for (const valor of origenes) {
      const exists = await this.origenTransaccionRepository.findOne({ where: { valor } });
      if (!exists) {
        await this.origenTransaccionRepository.save({ valor });
        console.log(`  ✓ Origen de transacción creado: ${valor}`);
      }
    }
  }

  private async seedPlataformas() {
    const plataformas = [
      'PC',
      'PlayStation 5',
      'PlayStation 4',
      'Xbox Series X/S',
      'Xbox One',
      'Nintendo Switch',
      'Mobile',
      'Steam',
      'Epic Games',
      'Battle.net',
    ];
    
    for (const valor of plataformas) {
      const exists = await this.plataformaRepository.findOne({ where: { valor } });
      if (!exists) {
        await this.plataformaRepository.save({ valor });
        console.log(`  ✓ Plataforma creada: ${valor}`);
      }
    }
  }

  private async seedRegiones() {
    const regiones = [
      'Norte América',
      'Sur América',
      'Europa',
      'Asia',
      'Oceanía',
      'África',
      'LATAM',
      'Brasil',
      'Global',
    ];
    
    for (const valor of regiones) {
      const exists = await this.regionRepository.findOne({ where: { valor } });
      if (!exists) {
        await this.regionRepository.save({ valor });
        console.log(`  ✓ Región creada: ${valor}`);
      }
    }
  }

  private async seedTiposEntrada() {
    const tipos = ['gratis', 'pago', 'invitacion'];
    
    for (const valor of tipos) {
      const exists = await this.tipoEntradaRepository.findOne({ where: { valor } });
      if (!exists) {
        await this.tipoEntradaRepository.save({ valor });
        console.log(`  ✓ Tipo de entrada creado: ${valor}`);
      }
    }
  }

  private async seedTiposItem() {
    const tipos = ['skin', 'avatar', 'banner', 'insignia', 'marco', 'emote', 'boost'];
    
    for (const valor of tipos) {
      const exists = await this.tipoItemRepository.findOne({ where: { valor } });
      if (!exists) {
        await this.tipoItemRepository.save({ valor });
        console.log(`  ✓ Tipo de item creado: ${valor}`);
      }
    }
  }

  private async seedTiposTransaccion() {
    const tipos = ['credito', 'debito'];
    
    for (const valor of tipos) {
      const exists = await this.transaccionTipoRepository.findOne({ where: { valor } });
      if (!exists) {
        await this.transaccionTipoRepository.save({ valor });
        console.log(`  ✓ Tipo de transacción creado: ${valor}`);
      }
    }
  }

  private async seedAdminUser() {
    const adminNickname = 'admin';
    const adminEmail = 'admin@esports.com';
    
    // Verificar si ya existe
    const existingUser = await this.usuarioRepository.findOne({
      where: { nickname: adminNickname },
    });

    if (existingUser) {
      console.log('  ⚠ Usuario administrador ya existe');
      return;
    }

    // Obtener rol de admin y género
    const rolAdmin = await this.rolRepository.findOne({ where: { valor: 'admin' } });
    const genero = await this.generoRepository.findOne({ where: { valor: 'Masculino' } });

    if (!rolAdmin) {
      throw new Error('Rol admin no encontrado. Ejecuta los seeds de roles primero.');
    }

    // Crear persona
    const persona = this.personaRepository.create({
      pNombre: 'Administrador',
      pApellido: 'Sistema',
      correo: adminEmail,
      fechaNacimiento: '1990-01-01',
      genero: genero,
      timezone: 'America/Mexico_City',
    });

    await this.personaRepository.save(persona);

    // Hashear password
    const hashedPassword = await bcrypt.hash('Admin123!', 10);

    // Crear usuario
    const usuario = this.usuarioRepository.create({
      persona: persona,
      nickname: adminNickname,
      rol: rolAdmin,
      password: hashedPassword,
      estado: 'activo',
      xp: 0,
      saldo: '0',
      creditos: 1000,
      desafiosHabilitados: true,
    });

    await this.usuarioRepository.save(usuario);
    
    console.log('  ✓ Usuario administrador creado:');
    console.log('    - Nickname: admin');
    console.log('    - Password: Admin123!');
    console.log('    - Email: admin@esports.com');
  }
}
