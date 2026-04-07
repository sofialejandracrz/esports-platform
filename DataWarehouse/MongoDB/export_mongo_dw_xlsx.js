const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

let MongoClient;
let ExcelJS;

try {
  ({ MongoClient } = require('mongodb'));
  ExcelJS = require('exceljs');
} catch {
  console.log('Instalando dependencias mongodb y exceljs...');
  execSync('npm install mongodb exceljs', { cwd: __dirname, stdio: 'inherit' });
  ({ MongoClient } = require('mongodb'));
  ExcelJS = require('exceljs');
}

const CONTAINER_NAME = process.env.MONGO_CONTAINER_NAME || 'esports_mongo_dw';
const DATABASE_NAME = process.env.MONGO_DB_NAME || 'esports_analytics';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017';
const OUTPUT_DIR = path.join(__dirname, 'exports');
const COLLECTION_EXPORTS = [
  { collectionName: 'logs_actividad', outputFileName: 'logs_actividad_dw.xlsx' },
  { collectionName: 'feedback_torneos', outputFileName: 'feedback_torneos_dw.xlsx' },
];

function ensureContainerRunning(containerName) {
  const cmd = `docker ps --filter "name=^${containerName}$" --format "{{.Names}}"`;
  const stdout = execSync(cmd, { encoding: 'utf8' }).trim();
  if (stdout !== containerName) {
    throw new Error(`No se encontro el contenedor '${containerName}' en ejecucion.`);
  }
}

function flattenDocument(input, prefix = '', acc = {}) {
  if (input === null || input === undefined) {
    return acc;
  }

  for (const [key, value] of Object.entries(input)) {
    const fullKey = prefix ? `${prefix}_${key}` : key;

    if (value instanceof Date) {
      acc[fullKey] = value.toISOString();
      continue;
    }

    if (Array.isArray(value)) {
      acc[fullKey] = value
        .map((item) => {
          if (item instanceof Date) return item.toISOString();
          if (item && typeof item === 'object') return JSON.stringify(item);
          return item;
        })
        .join('|');
      continue;
    }

    if (value && value._bsontype === 'ObjectId') {
      acc[fullKey] = value.toString();
      continue;
    }

    if (value && value._bsontype) {
      acc[fullKey] = value.toString();
      continue;
    }

    if (value && typeof value === 'object') {
      flattenDocument(value, fullKey, acc);
      continue;
    }

    acc[fullKey] = value;
  }

  return acc;
}

async function exportCollectionToXlsx(db, collectionName, outputFileName) {
  const collection = db.collection(collectionName);
  const docs = await collection.find({}).toArray();
  const flatRows = docs.map((doc) => flattenDocument(doc));

  const allColumns = new Set();
  for (const row of flatRows) {
    Object.keys(row).forEach((k) => allColumns.add(k));
  }
  const orderedColumns = Array.from(allColumns).sort();

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(collectionName);
  worksheet.columns = orderedColumns.map((column) => ({
    header: column,
    key: column,
    width: Math.min(Math.max(column.length + 2, 14), 50),
  }));

  for (const row of flatRows) {
    worksheet.addRow(row);
  }

  const outputPath = path.join(OUTPUT_DIR, outputFileName);
  await workbook.xlsx.writeFile(outputPath);
  return { outputPath, rows: flatRows.length };
}

async function main() {
  ensureContainerRunning(CONTAINER_NAME);
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const client = new MongoClient(MONGO_URI);
  await client.connect();

  try {
    const db = client.db(DATABASE_NAME);

    const [logs, feedback] = await Promise.all(
      COLLECTION_EXPORTS.map(({ collectionName, outputFileName }) =>
        exportCollectionToXlsx(db, collectionName, outputFileName)
      )
    );

    console.log('\nExport completado.');
    console.log(`Archivo 1: ${logs.outputPath} (${logs.rows} filas)`);
    console.log(`Archivo 2: ${feedback.outputPath} (${feedback.rows} filas)`);
  } finally {
    await client.close();
  }
}

main().catch((err) => {
  console.error(`Error en exportacion Mongo->XLSX: ${err.message}`);
  process.exit(1);
});
