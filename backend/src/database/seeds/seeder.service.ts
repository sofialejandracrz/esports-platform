import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
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
import { CatalogoAvatar } from '../../modules/catalogo-avatar/entities/catalogo-avatar.entity';
import { CatalogoTipoTorneo } from '../../modules/catalogo-tipo-torneo/entities/catalogo-tipo-torneo.entity';
import { MembresiaTipo } from '../../modules/membresia-tipo/entities/membresia-tipo.entity';
import { TiendaItem } from '../../modules/tienda-item/entities/tienda-item.entity';
import { Persona } from '../../modules/persona/entities/persona.entity';
import { Usuario } from '../../modules/usuario/entities/usuario.entity';
import { Juego } from '../../modules/juego/entities/juego.entity';
import { ModoJuego } from '../../modules/modo-juego/entities/modo-juego.entity';

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
    @InjectRepository(CatalogoAvatar)
    private readonly avatarRepository: Repository<CatalogoAvatar>,
    @InjectRepository(CatalogoTipoTorneo)
    private readonly tipoTorneoRepository: Repository<CatalogoTipoTorneo>,
    @InjectRepository(MembresiaTipo)
    private readonly membresiaTipoRepository: Repository<MembresiaTipo>,
    @InjectRepository(TiendaItem)
    private readonly tiendaItemRepository: Repository<TiendaItem>,
    @InjectRepository(Persona)
    private readonly personaRepository: Repository<Persona>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Juego)
    private readonly juegoRepository: Repository<Juego>,
    @InjectRepository(ModoJuego)
    private readonly modoJuegoRepository: Repository<ModoJuego>,
    private readonly dataSource: DataSource,
  ) {}

  async seed() {
    console.log('🌱 Iniciando seeds (modo incremental)...');
    console.log('ℹ️  Solo se crearán registros que no existan\n');

    // Catálogos básicos
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
    await this.seedAvatares();
    await this.seedMembresias();
    await this.seedTiendaItems();
    
    // Nuevos seeds para torneos
    await this.seedTiposTorneo();
    await this.seedJuegos();
    
    // Usuario admin al final
    await this.seedAdminUser();

    console.log('\n✅ Seeds completados exitosamente!');
  }

  private async seedRoles() {
    const roles = ['admin', 'usuario', 'moderador'];
    let created = 0;
    
    for (const valor of roles) {
      const exists = await this.rolRepository.findOne({ where: { valor } });
      if (!exists) {
        await this.rolRepository.save({ valor });
        created++;
      }
    }
    this.logResult('Roles', created, roles.length);
  }

  private async seedGeneros() {
    const generos = ['Masculino', 'Femenino', 'Otro', 'Prefiero no decir'];
    let created = 0;
    
    for (const valor of generos) {
      const exists = await this.generoRepository.findOne({ where: { valor } });
      if (!exists) {
        await this.generoRepository.save({ valor });
        created++;
      }
    }
    this.logResult('Géneros', created, generos.length);
  }

  private async seedEstadosAmistad() {
    const estados = ['pendiente', 'aceptado', 'rechazado', 'bloqueado'];
    let created = 0;
    
    for (const valor of estados) {
      const exists = await this.estadoAmistadRepository.findOne({ where: { valor } });
      if (!exists) {
        await this.estadoAmistadRepository.save({ valor });
        created++;
      }
    }
    this.logResult('Estados Amistad', created, estados.length);
  }

  private async seedEstadosInscripcion() {
    const estados = ['pendiente', 'confirmada', 'cancelada', 'rechazada'];
    let created = 0;
    
    for (const valor of estados) {
      const exists = await this.estadoInscripcionRepository.findOne({ where: { valor } });
      if (!exists) {
        await this.estadoInscripcionRepository.save({ valor });
        created++;
      }
    }
    this.logResult('Estados Inscripción', created, estados.length);
  }

  private async seedEstadosTorneo() {
    // Estados actualizados para coincidir con el SQL de torneos
    const estados = ['proximamente', 'en_curso', 'terminado', 'cancelado'];
    let created = 0;
    
    for (const valor of estados) {
      const exists = await this.estadoTorneoRepository.findOne({ where: { valor } });
      if (!exists) {
        await this.estadoTorneoRepository.save({ valor });
        created++;
      }
    }
    this.logResult('Estados Torneo', created, estados.length);
  }

  private async seedOrigenesTransaccion() {
    const origenes = ['compra', 'premio', 'reembolso', 'regalo', 'logro', 'torneo', 'inscripcion'];
    let created = 0;
    
    for (const valor of origenes) {
      const exists = await this.origenTransaccionRepository.findOne({ where: { valor } });
      if (!exists) {
        await this.origenTransaccionRepository.save({ valor });
        created++;
      }
    }
    this.logResult('Orígenes Transacción', created, origenes.length);
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
      'Origin',
      'Ubisoft Connect',
      'GOG',
      'Crossplay',
    ];
    let created = 0;
    
    for (const valor of plataformas) {
      const exists = await this.plataformaRepository.findOne({ where: { valor } });
      if (!exists) {
        await this.plataformaRepository.save({ valor });
        created++;
      }
    }
    this.logResult('Plataformas', created, plataformas.length);
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
      'México',
      'España',
      'Argentina',
      'Chile',
      'Colombia',
      'Perú',
    ];
    let created = 0;
    
    for (const valor of regiones) {
      const exists = await this.regionRepository.findOne({ where: { valor } });
      if (!exists) {
        await this.regionRepository.save({ valor });
        created++;
      }
    }
    this.logResult('Regiones', created, regiones.length);
  }

  private async seedTiposEntrada() {
    const tipos = ['mando', 'teclado', 'todos', 'touch'];
    let created = 0;
    
    for (const valor of tipos) {
      const exists = await this.tipoEntradaRepository.findOne({ where: { valor } });
      if (!exists) {
        await this.tipoEntradaRepository.save({ valor });
        created++;
      }
    }
    this.logResult('Tipos Entrada', created, tipos.length);
  }

  private async seedTiposItem() {
    const tipos = ['creditos', 'membresia', 'servicio', 'avatar', 'banner'];
    let created = 0;
    
    for (const valor of tipos) {
      const exists = await this.tipoItemRepository.findOne({ where: { valor } });
      if (!exists) {
        await this.tipoItemRepository.save({ valor });
        created++;
      }
    }
    this.logResult('Tipos Item', created, tipos.length);
  }

  private async seedTiposTransaccion() {
    const tipos = ['saldo', 'creditos', 'premio', 'inscripcion'];
    let created = 0;
    
    for (const valor of tipos) {
      const exists = await this.transaccionTipoRepository.findOne({ where: { valor } });
      if (!exists) {
        await this.transaccionTipoRepository.save({ valor });
        created++;
      }
    }
    this.logResult('Tipos Transacción', created, tipos.length);
  }

  private async seedTiposTorneo() {
    const tipos = [
      { valor: 'eliminacion_simple', descripcion: 'Eliminación simple - Un jugador pierde y queda eliminado', tipoTrofeo: 'trofeo_eliminacion' },
      { valor: 'eliminacion_doble', descripcion: 'Eliminación doble - Un jugador debe perder dos veces para ser eliminado', tipoTrofeo: 'trofeo_eliminacion_doble' },
      { valor: 'todos_contra_todos', descripcion: 'Round Robin - Todos juegan contra todos', tipoTrofeo: 'trofeo_round_robin' },
      { valor: 'grupos', descripcion: 'Fase de grupos con eliminatorias', tipoTrofeo: 'trofeo_grupos' },
      { valor: 'suizo', descripcion: 'Sistema suizo - Emparejamientos según rendimiento', tipoTrofeo: 'trofeo_suizo' },
    ];
    let created = 0;

    for (const tipo of tipos) {
      const exists = await this.tipoTorneoRepository.findOne({ where: { valor: tipo.valor } });
      if (!exists) {
        await this.tipoTorneoRepository.save(tipo);
        created++;
      }
    }
    this.logResult('Tipos Torneo', created, tipos.length);
  }

  private async seedAvatares() {
    const botttSeeds = [
      'Felix', 'Aneka', 'Buster', 'Midnight', 'Precious', 'Shadow', 
      'Lucky', 'Misty', 'Buddy', 'Charlie', 'Max', 'Luna', 'Rocky',
      'Daisy', 'Bailey', 'Coco', 'Milo', 'Bella', 'Oliver', 'Zoe',
      'Leo', 'Lily', 'Cooper', 'Lucy', 'Bear', 'Molly', 'Duke', 'Sophie',
      'Zeus', 'Sadie', 'Jack', 'Maggie', 'Toby', 'Stella', 'Teddy',
      'Penny', 'Winston', 'Chloe', 'Tucker', 'Lola', 'Jake', 'Nala',
      'Bentley', 'Gracie', 'Oscar', 'Ruby', 'Gizmo', 'Rosie', 'Thor',
      'Ellie', 'Bandit', 'Zoey', 'Finn', 'Ginger', 'Harley', 'Princess',
      'Murphy', 'Piper', 'Riley', 'Willow', 'Hank', 'Emma', 'Louie',
      'Abby', 'Bruno', 'Angel', 'Diesel', 'Annie', 'Ace', 'Roxy'
    ];

    let created = 0;

    for (let index = 0; index < botttSeeds.length; index++) {
      const seed = botttSeeds[index];
      const nombre = `bottts-${seed.toLowerCase()}`;
      
      const exists = await this.avatarRepository.findOne({ where: { nombre } });
      
      if (!exists) {
        await this.avatarRepository.save({
          nombre,
          url: `https://api.dicebear.com/9.x/bottts/svg?seed=${seed}`,
          seed,
          categoria: 'bottts',
          disponible: true,
          premium: index >= 50,
        });
        created++;
      }
    }

    this.logResult('Avatares', created, botttSeeds.length);
  }

  private async seedMembresias() {
    const membresias = [
      {
        nombre: 'Gratuita',
        precio: '0.00',
        duracionDias: 0,
        beneficios: 'Acceso a competiciones gratuitas, Desafía a otros jugadores a apostar partidos, Desafía a otros jugadores a partidas de XP, Benefíciese de premios con pago instantáneo'
      },
      {
        nombre: 'Premium 1 Mes',
        precio: '5.99',
        duracionDias: 30,
        beneficios: 'Todo lo de la membresía gratuita + Apuestas sin comisiones, Entrada gratuita a los torneos ELITE, Avatares premium, Personalización de la página del equipo, Personalización de la página de perfil'
      },
      {
        nombre: 'Premium 3 Meses',
        precio: '12.99',
        duracionDias: 90,
        beneficios: 'Todo lo de Premium + Ahorra un 28%'
      },
      {
        nombre: 'Premium 6 Meses',
        precio: '24.99',
        duracionDias: 180,
        beneficios: 'Todo lo de Premium + Ahorra un 30%'
      },
      {
        nombre: 'Premium 12 Meses',
        precio: '49.99',
        duracionDias: 365,
        beneficios: 'Todo lo de Premium + Ahorra un 30%'
      }
    ];

    let created = 0;

    for (const membresia of membresias) {
      const exists = await this.membresiaTipoRepository.findOne({ 
        where: { nombre: membresia.nombre } 
      });

      if (!exists) {
        await this.membresiaTipoRepository.save(membresia);
        created++;
      }
    }

    this.logResult('Membresías', created, membresias.length);
  }

  private async seedTiendaItems() {
    const tipoCreditosEntity = await this.tipoItemRepository.findOne({ where: { valor: 'creditos' } });
    const tipoMembresiaEntity = await this.tipoItemRepository.findOne({ where: { valor: 'membresia' } });
    const tipoServicioEntity = await this.tipoItemRepository.findOne({ where: { valor: 'servicio' } });
    const membresiasEntity = await this.membresiaTipoRepository.find();

    if (!tipoCreditosEntity || !tipoMembresiaEntity || !tipoServicioEntity) {
      console.log('  ⚠ No se encontraron los tipos de item necesarios');
      return;
    }

    const items: Array<{
      tipo: CatalogoTipoItem;
      nombre: string;
      descripcion: string;
      precio: string;
      creditosOtorgados: number | null;
      metadata: any;
    }> = [
      { tipo: tipoCreditosEntity, nombre: '1 Crédito', descripcion: 'Paquete básico de créditos', precio: '1.00', creditosOtorgados: 1, metadata: { destacado: false } },
      { tipo: tipoCreditosEntity, nombre: '3 Créditos', descripcion: 'Paquete de 3 créditos', precio: '2.25', creditosOtorgados: 3, metadata: { destacado: false } },
      { tipo: tipoCreditosEntity, nombre: '5 Créditos', descripcion: 'Paquete de 5 créditos', precio: '3.75', creditosOtorgados: 5, metadata: { destacado: false } },
      { tipo: tipoCreditosEntity, nombre: '7 Créditos', descripcion: 'Paquete de 7 créditos', precio: '5.00', creditosOtorgados: 7, metadata: { destacado: true } },
      { tipo: tipoCreditosEntity, nombre: '10 Créditos', descripcion: 'Paquete de 10 créditos', precio: '7.50', creditosOtorgados: 10, metadata: { destacado: false } },
      { tipo: tipoCreditosEntity, nombre: '15 Créditos', descripcion: 'Paquete de 15 créditos - Mejor valor', precio: '10.00', creditosOtorgados: 15, metadata: { destacado: true, mejorValor: true } },
      { tipo: tipoServicioEntity, nombre: 'Cambio de Nickname', descripcion: 'Cambia tu nombre de usuario único', precio: '3.99', creditosOtorgados: null, metadata: { servicioTipo: 'cambio_nickname' } },
      { tipo: tipoServicioEntity, nombre: 'Reiniciar Récord de Juego', descripcion: 'Reinicia tu historial completo de partidas', precio: '5.99', creditosOtorgados: null, metadata: { servicioTipo: 'reset_record', advertencia: 'Acción irreversible' } },
      { tipo: tipoServicioEntity, nombre: 'Reiniciar Estadísticas', descripcion: 'Reinicia tus estadísticas de juego', precio: '3.99', creditosOtorgados: null, metadata: { servicioTipo: 'reset_stats', advertencia: 'Acción irreversible' } },
      { tipo: tipoServicioEntity, nombre: 'Reclamar Nombre de Usuario', descripcion: 'Reclama un nombre de usuario inactivo. Se contacta con soporte en directo para verificar disponibilidad.', precio: '9.99', creditosOtorgados: null, metadata: { servicioTipo: 'reclamar_nickname', requiereSoporte: true } }
    ];

    for (const membresia of membresiasEntity) {
      if (membresia.nombre !== 'Gratuita') {
        items.push({
          tipo: tipoMembresiaEntity,
          nombre: membresia.nombre,
          descripcion: membresia.beneficios,
          precio: membresia.precio,
          creditosOtorgados: null,
          metadata: { 
            membresiaTipoId: membresia.id,
            duracionDias: membresia.duracionDias
          }
        });
      }
    }

    let created = 0;

    for (const item of items) {
      const exists = await this.tiendaItemRepository.findOne({ 
        where: { nombre: item.nombre } 
      });

      if (!exists) {
        await this.tiendaItemRepository.save(item);
        created++;
      }
    }

    this.logResult('Items Tienda', created, items.length);
  }

  /**
   * Seed de juegos con sus plataformas y modos de juego
   */
  private async seedJuegos() {
    // Obtener todas las plataformas
    const plataformas = await this.plataformaRepository.find();
    const getPlatforms = (nombres: string[]) => 
      plataformas.filter(p => nombres.some(n => p.valor.toLowerCase().includes(n.toLowerCase())));

    // Definición de juegos populares de eSports
    const juegosData = [
      {
        nombre: 'Call of Duty: Warzone',
        descripcion: 'Battle Royale gratuito de la franquicia Call of Duty',
        plataformas: ['PC', 'PlayStation', 'Xbox'],
        modos: [
          { nombre: 'Battle Royale Solo', descripcion: 'Último jugador en pie' },
          { nombre: 'Battle Royale Dúos', descripcion: 'Equipos de 2 jugadores' },
          { nombre: 'Battle Royale Tríos', descripcion: 'Equipos de 3 jugadores' },
          { nombre: 'Battle Royale Cuartetos', descripcion: 'Equipos de 4 jugadores' },
          { nombre: 'Resurgimiento', descripcion: 'Battle Royale con respawn' },
        ]
      },
      {
        nombre: 'Fortnite',
        descripcion: 'Battle Royale con construcción de Epic Games',
        plataformas: ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile'],
        modos: [
          { nombre: 'Solo', descripcion: 'Battle Royale individual' },
          { nombre: 'Dúos', descripcion: 'Equipos de 2' },
          { nombre: 'Tríos', descripcion: 'Equipos de 3' },
          { nombre: 'Escuadrones', descripcion: 'Equipos de 4' },
          { nombre: 'Zero Build Solo', descripcion: 'Sin construcción individual' },
          { nombre: 'Zero Build Escuadrones', descripcion: 'Sin construcción equipos' },
        ]
      },
      {
        nombre: 'League of Legends',
        descripcion: 'MOBA competitivo de Riot Games',
        plataformas: ['PC'],
        modos: [
          { nombre: 'Grieta del Invocador 5v5', descripcion: 'Modo competitivo estándar' },
          { nombre: 'ARAM', descripcion: 'All Random All Mid' },
          { nombre: 'Clash', descripcion: 'Torneos organizados' },
        ]
      },
      {
        nombre: 'Valorant',
        descripcion: 'Shooter táctico 5v5 de Riot Games',
        plataformas: ['PC'],
        modos: [
          { nombre: 'Competitivo', descripcion: 'Modo rankeado 5v5' },
          { nombre: 'Sin clasificar', descripcion: 'Partidas casuales 5v5' },
          { nombre: 'Spike Rush', descripcion: 'Partidas rápidas' },
          { nombre: 'Deathmatch', descripcion: 'Todos contra todos' },
        ]
      },
      {
        nombre: 'Apex Legends',
        descripcion: 'Battle Royale de escuadrones de EA',
        plataformas: ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch'],
        modos: [
          { nombre: 'Battle Royale Tríos', descripcion: 'Escuadrones de 3' },
          { nombre: 'Battle Royale Dúos', descripcion: 'Escuadrones de 2' },
          { nombre: 'Arenas', descripcion: 'Combate 3v3' },
          { nombre: 'Control', descripcion: 'Modo de control de puntos' },
        ]
      },
      {
        nombre: 'Counter-Strike 2',
        descripcion: 'Shooter táctico competitivo de Valve',
        plataformas: ['PC', 'Steam'],
        modos: [
          { nombre: 'Competitivo', descripcion: 'Partidas rankeadas 5v5' },
          { nombre: 'Premier', descripcion: 'Modo competitivo premium' },
          { nombre: 'Wingman', descripcion: 'Partidas 2v2' },
          { nombre: 'Casual', descripcion: 'Partidas sin rango' },
        ]
      },
      {
        nombre: 'Rocket League',
        descripcion: 'Fútbol con autos de Psyonix',
        plataformas: ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Epic Games'],
        modos: [
          { nombre: '1v1', descripcion: 'Duelo individual' },
          { nombre: '2v2', descripcion: 'Dúos' },
          { nombre: '3v3', descripcion: 'Estándar' },
          { nombre: 'Hoops', descripcion: 'Basquetbol' },
          { nombre: 'Rumble', descripcion: 'Con power-ups' },
        ]
      },
      {
        nombre: 'FIFA 24',
        descripcion: 'Simulador de fútbol de EA Sports',
        plataformas: ['PC', 'PlayStation', 'Xbox'],
        modos: [
          { nombre: 'Ultimate Team', descripcion: 'Construye tu equipo' },
          { nombre: '1v1 Online', descripcion: 'Partida individual' },
          { nombre: 'Pro Clubs', descripcion: 'Equipos de jugadores' },
          { nombre: 'Co-op Seasons', descripcion: 'Cooperativo en línea' },
        ]
      },
      {
        nombre: 'Super Smash Bros. Ultimate',
        descripcion: 'Juego de peleas crossover de Nintendo',
        plataformas: ['Nintendo Switch'],
        modos: [
          { nombre: '1v1', descripcion: 'Duelo individual' },
          { nombre: '2v2', descripcion: 'Equipos' },
          { nombre: 'Free For All', descripcion: 'Todos contra todos' },
        ]
      },
      {
        nombre: 'Street Fighter 6',
        descripcion: 'Juego de peleas de Capcom',
        plataformas: ['PC', 'PlayStation', 'Xbox', 'Steam'],
        modos: [
          { nombre: 'Ranked Match', descripcion: 'Partidas rankeadas 1v1' },
          { nombre: 'Casual Match', descripcion: 'Partidas casuales' },
          { nombre: 'Battle Hub', descripcion: 'Lobby social' },
        ]
      },
      {
        nombre: 'Tekken 8',
        descripcion: 'Juego de peleas 3D de Bandai Namco',
        plataformas: ['PC', 'PlayStation', 'Xbox', 'Steam'],
        modos: [
          { nombre: 'Ranked Match', descripcion: 'Partidas rankeadas 1v1' },
          { nombre: 'Quick Match', descripcion: 'Partidas rápidas' },
          { nombre: 'Lobby Match', descripcion: 'Salas personalizadas' },
        ]
      },
      {
        nombre: 'Dota 2',
        descripcion: 'MOBA competitivo de Valve',
        plataformas: ['PC', 'Steam'],
        modos: [
          { nombre: 'All Pick', descripcion: 'Modo estándar 5v5' },
          { nombre: 'Captain Mode', descripcion: 'Modo competitivo con draft' },
          { nombre: 'Turbo', descripcion: 'Partidas rápidas' },
        ]
      },
      {
        nombre: 'Overwatch 2',
        descripcion: 'Hero shooter de Blizzard',
        plataformas: ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Battle.net'],
        modos: [
          { nombre: 'Competitivo', descripcion: 'Partidas rankeadas 5v5' },
          { nombre: 'Quick Play', descripcion: 'Partidas rápidas' },
          { nombre: 'Arcade', descripcion: 'Modos especiales' },
        ]
      },
      {
        nombre: 'PUBG: Battlegrounds',
        descripcion: 'Battle Royale original de KRAFTON',
        plataformas: ['PC', 'PlayStation', 'Xbox', 'Mobile', 'Steam'],
        modos: [
          { nombre: 'Solo', descripcion: 'Battle Royale individual' },
          { nombre: 'Dúo', descripcion: 'Equipos de 2' },
          { nombre: 'Escuadrón', descripcion: 'Equipos de 4' },
        ]
      },
      {
        nombre: 'Rainbow Six Siege',
        descripcion: 'Shooter táctico de Ubisoft',
        plataformas: ['PC', 'PlayStation', 'Xbox', 'Ubisoft Connect'],
        modos: [
          { nombre: 'Ranked', descripcion: 'Partidas rankeadas 5v5' },
          { nombre: 'Unranked', descripcion: 'Sin rango 5v5' },
          { nombre: 'Quick Match', descripcion: 'Partidas rápidas' },
        ]
      },
    ];

    let juegosCreados = 0;
    let modosCreados = 0;

    for (const juegoData of juegosData) {
      // Verificar si el juego ya existe
      let juego = await this.juegoRepository.findOne({ 
        where: { nombre: juegoData.nombre },
        relations: ['plataformas', 'modos']
      });

      if (!juego) {
        // Crear el juego
        const plataformasJuego = getPlatforms(juegoData.plataformas);
        
        juego = this.juegoRepository.create({
          nombre: juegoData.nombre,
          descripcion: juegoData.descripcion,
          plataformas: plataformasJuego,
        });
        
        await this.juegoRepository.save(juego);
        juegosCreados++;
      }

      // Crear modos de juego si no existen
      for (const modoData of juegoData.modos) {
        const modoExiste = await this.modoJuegoRepository.findOne({
          where: { nombre: modoData.nombre, juego: { id: juego.id } }
        });

        if (!modoExiste) {
          const modo = this.modoJuegoRepository.create({
            nombre: modoData.nombre,
            descripcion: modoData.descripcion,
            juego: juego,
          });
          await this.modoJuegoRepository.save(modo);
          modosCreados++;
        }
      }
    }

    this.logResult('Juegos', juegosCreados, juegosData.length);
    this.logResult('Modos de Juego', modosCreados, juegosData.reduce((acc, j) => acc + j.modos.length, 0));
  }

  private async seedAdminUser() {
    const adminNickname = 'admin';
    const adminEmail = 'admin@esports.com';
    
    const existingUser = await this.usuarioRepository.findOne({
      where: { nickname: adminNickname },
    });

    if (existingUser) {
      console.log('  ⏭️  Usuario admin ya existe');
      return;
    }

    const rolAdmin = await this.rolRepository.findOne({ where: { valor: 'admin' } });
    const genero = await this.generoRepository.findOne({ where: { valor: 'Masculino' } });

    if (!rolAdmin) {
      throw new Error('Rol admin no encontrado. Ejecuta los seeds de roles primero.');
    }

    const persona = this.personaRepository.create({
      pNombre: 'Administrador',
      pApellido: 'Sistema',
      correo: adminEmail,
      fechaNacimiento: '1990-01-01',
      genero: genero,
      timezone: 'America/Mexico_City',
    });

    await this.personaRepository.save(persona);

    const hashedPassword = await bcrypt.hash('Admin123!', 10);

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
    
    console.log('  ✓ Usuario admin creado (admin / Admin123!)');
  }

  private logResult(entity: string, created: number, total: number) {
    if (created > 0) {
      console.log(`  ✓ ${entity}: ${created} creados (${total - created} ya existían)`);
    } else {
      console.log(`  ⏭️  ${entity}: todos ya existían (${total})`);
    }
  }
}
