/**
 * Script para generar el archivo Excel DW_Fuentes_Excel.xlsx
 * con las dos hojas requeridas para el Data Warehouse:
 *   - Presupuestos_Ventas  → Datamart 1 (Ingresos y Monetización)
 *   - Lista_Negra           → Datamart 4 (Seguridad y Auditoría)
 *
 * Ejecutar: npm install xlsx && node generar_excel_dw.js
 */

const path = require('path');

let XLSX;
try {
  XLSX = require('xlsx');
} catch {
  console.log('Instalando xlsx...');
  require('child_process').execSync('npm install xlsx', { 
    cwd: __dirname, 
    stdio: 'inherit' 
  });
  XLSX = require('xlsx');
}

const OUTPUT_FILE = path.join(__dirname, 'DW_Fuentes_Excel.xlsx');

// ============================================================================
// HOJA 1: Presupuestos_Ventas (Datamart 1 — Ingresos y Monetización)
// ============================================================================

// Regiones (DEBEN coincidir con CATALOGO_REGION.VALOR en Oracle)
const regiones = [
  'Norte America', 'Sur America', 'Europa', 'Asia', 'LATAM',
  'Brasil', 'Mexico', 'Espana', 'Argentina', 'Colombia'
];

// Categorías (DEBEN coincidir con CATALOGO_TIPO_ITEM.VALOR en Oracle)
const categorias = ['creditos', 'membresia', 'servicio', 'avatar', 'banner'];

const metasBase = { creditos: 3500, membresia: 5000, servicio: 1200, avatar: 800, banner: 400 };
const transBase  = { creditos: 250,  membresia: 120,  servicio: 80,   avatar: 150, banner: 60  };
const factorRegion = {
  'Norte America': 1.5, 'Sur America': 0.8, 'Europa': 1.3, 'Asia': 1.2,
  'LATAM': 1.0, 'Brasil': 0.9, 'Mexico': 1.1, 'Espana': 1.0,
  'Argentina': 0.7, 'Colombia': 0.8
};

const presupuestos = [];
let respCounter = 1;

// 2025 completo + 2026 hasta junio
const periodos = [];
for (let m = 1; m <= 12; m++) periodos.push({ anio: 2025, mes: m });
for (let m = 1; m <= 6; m++)  periodos.push({ anio: 2026, mes: m });

for (const { anio, mes } of periodos) {
  // Factor estacional
  let fEstacional = 1.0;
  if (mes === 12) fEstacional = 1.3;
  else if (mes === 1 || mes === 2) fEstacional = 0.85;
  else if (mes === 6 || mes === 7 || mes === 11) fEstacional = 1.1;

  for (const region of regiones) {
    for (const categoria of categorias) {
      const meta = +(metasBase[categoria] * factorRegion[region] * fEstacional).toFixed(2);
      const trans = Math.round(transBase[categoria] * factorRegion[region] * fEstacional);
      const respId = ((respCounter - 1) % 10) + 1;  // Empleados RRHH 1-10

      presupuestos.push({
        anio,
        mes,
        region,
        categoria_producto: categoria,
        meta_ingresos_usd: meta,
        meta_transacciones: trans,
        responsable_rrhh_id: respId
      });

      respCounter++;
    }
  }
}

console.log(`>>> Presupuestos_Ventas: ${presupuestos.length} filas`);

// ============================================================================
// HOJA 2: Lista_Negra (Datamart 4 — Seguridad y Auditoría)
// ============================================================================

const listaNegra = [
  // Países restringidos
  { tipo: 'pais', valor: 'Corea del Norte',  motivo: 'Sanciones internacionales OFAC',                    fecha_agregado: '2025-01-15', activo: 1 },
  { tipo: 'pais', valor: 'Iran',             motivo: 'Sanciones internacionales OFAC',                    fecha_agregado: '2025-01-15', activo: 1 },
  { tipo: 'pais', valor: 'Siria',            motivo: 'Sanciones internacionales OFAC',                    fecha_agregado: '2025-01-15', activo: 1 },
  { tipo: 'pais', valor: 'Cuba',             motivo: 'Restricciones de servicio por sanciones',           fecha_agregado: '2025-02-01', activo: 1 },
  { tipo: 'pais', valor: 'Sudan',            motivo: 'Sanciones internacionales',                        fecha_agregado: '2025-02-01', activo: 1 },
  { tipo: 'pais', valor: 'Myanmar',          motivo: 'Inestabilidad regulatoria',                        fecha_agregado: '2025-03-10', activo: 1 },
  { tipo: 'pais', valor: 'Somalia',          motivo: 'Alto riesgo de fraude y lavado de activos',         fecha_agregado: '2025-03-10', activo: 1 },
  { tipo: 'pais', valor: 'Yemen',            motivo: 'Restricciones de servicio',                        fecha_agregado: '2025-04-01', activo: 1 },
  { tipo: 'pais', valor: 'Rusia',            motivo: 'Sanciones por conflicto geopolitico',               fecha_agregado: '2025-06-15', activo: 1 },
  { tipo: 'pais', valor: 'Bielorrusia',      motivo: 'Sanciones UE y EEUU',                              fecha_agregado: '2025-06-15', activo: 1 },
  { tipo: 'pais', valor: 'Venezuela',        motivo: 'Restricciones parciales de procesamiento de pagos', fecha_agregado: '2025-08-01', activo: 0 },
  { tipo: 'pais', valor: 'Libia',            motivo: 'Alto riesgo de fraude',                             fecha_agregado: '2025-09-20', activo: 1 },

  // Dominios de correo prohibidos (correos temporales / spam)
  { tipo: 'dominio', valor: 'tempmail.com',      motivo: 'Servicio de correo temporal conocido',   fecha_agregado: '2025-01-01', activo: 1 },
  { tipo: 'dominio', valor: 'guerrillamail.com', motivo: 'Servicio de correo temporal conocido',   fecha_agregado: '2025-01-01', activo: 1 },
  { tipo: 'dominio', valor: 'mailinator.com',    motivo: 'Servicio de correo temporal conocido',   fecha_agregado: '2025-01-01', activo: 1 },
  { tipo: 'dominio', valor: 'throwaway.email',   motivo: 'Servicio de correo temporal conocido',   fecha_agregado: '2025-01-01', activo: 1 },
  { tipo: 'dominio', valor: 'yopmail.com',       motivo: 'Servicio de correo temporal conocido',   fecha_agregado: '2025-01-01', activo: 1 },
  { tipo: 'dominio', valor: 'trashmail.com',     motivo: 'Servicio de correo desechable',          fecha_agregado: '2025-02-15', activo: 1 },
  { tipo: 'dominio', valor: '10minutemail.com',  motivo: 'Correo temporal de 10 minutos',          fecha_agregado: '2025-02-15', activo: 1 },
  { tipo: 'dominio', valor: 'fakeinbox.com',     motivo: 'Servicio de correo falso',               fecha_agregado: '2025-03-01', activo: 1 },
  { tipo: 'dominio', valor: 'sharklasers.com',   motivo: 'Servicio Guerrilla Mail alternativo',    fecha_agregado: '2025-03-01', activo: 1 },
  { tipo: 'dominio', valor: 'dispostable.com',   motivo: 'Correo desechable',                      fecha_agregado: '2025-04-01', activo: 1 },
  { tipo: 'dominio', valor: 'getairmail.com',    motivo: 'Servicio de correo temporal',             fecha_agregado: '2025-05-01', activo: 1 },
  { tipo: 'dominio', valor: 'spam4.me',          motivo: 'Correo spam conocido',                    fecha_agregado: '2025-05-01', activo: 1 },
  { tipo: 'dominio', valor: 'maildrop.cc',       motivo: 'Servicio de correo sin registro',         fecha_agregado: '2025-06-01', activo: 1 },
  { tipo: 'dominio', valor: 'harakirimail.com',  motivo: 'Servicio de correo temporal japones',     fecha_agregado: '2025-07-01', activo: 0 },
];

console.log(`>>> Lista_Negra: ${listaNegra.length} filas`);

// ============================================================================
// Generar archivo Excel
// ============================================================================
const wb = XLSX.utils.book_new();

// Hoja 1
const ws1 = XLSX.utils.json_to_sheet(presupuestos);
// Ajustar anchos
ws1['!cols'] = [
  { wch: 6 },   // anio
  { wch: 5 },   // mes
  { wch: 18 },  // region
  { wch: 22 },  // categoria_producto
  { wch: 18 },  // meta_ingresos_usd
  { wch: 20 },  // meta_transacciones
  { wch: 22 },  // responsable_rrhh_id
];
XLSX.utils.book_append_sheet(wb, ws1, 'Presupuestos_Ventas');

// Hoja 2
const ws2 = XLSX.utils.json_to_sheet(listaNegra);
ws2['!cols'] = [
  { wch: 10 },  // tipo
  { wch: 22 },  // valor
  { wch: 55 },  // motivo
  { wch: 16 },  // fecha_agregado
  { wch: 8 },   // activo
];
XLSX.utils.book_append_sheet(wb, ws2, 'Lista_Negra');

// Escribir archivo
XLSX.writeFile(wb, OUTPUT_FILE);

console.log(`\n✅ Archivo generado: ${OUTPUT_FILE}`);
console.log(`   Hoja 1: Presupuestos_Ventas (${presupuestos.length} filas)`);
console.log(`   Hoja 2: Lista_Negra (${listaNegra.length} filas)`);
