import dns from 'dns';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  console.log('DNS setServers warning:', e.message);
}

async function syncAllToAtlas() {
  const localUri = process.env.MONGODB_LOCAL_URI || 'mongodb://127.0.0.1:27017/ai_igms';
  let atlasUri = process.env.MONGODB_ATLAS_URI || 'mongodb+srv://AI_IGMS_SGP5:AI_IGMS_SGP5@ai-igms.fbka6kv.mongodb.net/ai_igms?retryWrites=true&w=majority';
  
  // Clean up any trailing backslash if present
  atlasUri = atlasUri.trim().replace(/\\+$/, '');

  console.log('Connecting to Local MongoDB:', localUri);
  const connLocal = await mongoose.createConnection(localUri).asPromise();
  console.log('Connecting to Atlas Cloud MongoDB:', atlasUri);
  const connAtlas = await mongoose.createConnection(atlasUri).asPromise();

  const localCols = await connLocal.db.listCollections().toArray();
  console.log('Local collections found:', localCols.map(c => c.name));

  for (let col of localCols) {
    const colName = col.name;
    const localDocs = await connLocal.db.collection(colName).find({}).toArray();
    console.log(`Syncing '${colName}': ${localDocs.length} local documents...`);
    
    if (localDocs.length > 0) {
      const atlasCol = connAtlas.db.collection(colName);
      for (let doc of localDocs) {
        await atlasCol.replaceOne({ _id: doc._id }, doc, { upsert: true });
      }
    }
  }

  // Also sync any documents from Atlas to Local if missing locally
  const atlasCols = await connAtlas.db.listCollections().toArray();
  for (let col of atlasCols) {
    const colName = col.name;
    const atlasDocs = await connAtlas.db.collection(colName).find({}).toArray();
    if (atlasDocs.length > 0) {
      const localCol = connLocal.db.collection(colName);
      for (let doc of atlasDocs) {
        await localCol.replaceOne({ _id: doc._id }, doc, { upsert: true });
      }
    }
  }

  console.log('\n================ VERIFICATION ================');
  const finalAtlasCols = await connAtlas.db.listCollections().toArray();
  console.log('Atlas total collections count:', finalAtlasCols.length);
  for (let c of finalAtlasCols) {
    const count = await connAtlas.db.collection(c.name).countDocuments();
    console.log(` Atlas collection -> [ ${c.name} ]: ${count} documents`);
  }

  await connLocal.close();
  await connAtlas.close();
  console.log('================================================\n');
  console.log('✅ SYNC COMPLETED SUCCESSFULLY!');
}

syncAllToAtlas().then(() => process.exit(0)).catch(err => {
  console.error('Sync Error:', err);
  process.exit(1);
});
