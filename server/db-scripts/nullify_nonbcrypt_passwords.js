const { Client } = require('pg');

async function main(){
  const databaseUrl = process.env.DATABASE_URL;
  if(!databaseUrl){
    console.error('DATABASE_URL not set in environment');
    process.exit(2);
  }
  const client = new Client({ connectionString: databaseUrl });
  try{
    await client.connect();
    const selectQ = `SELECT id,email FROM "User" WHERE password IS NOT NULL AND password !~ '^\\$2[aby]\\$[0-9]{2}\\$[./A-Za-z0-9]{53}$'`;
    const res = await client.query(selectQ);
    if(res.rows.length===0){
      console.log('No non-bcrypt password rows found. Nothing to do.');
      await client.end();
      return;
    }
    const ids = res.rows.map(r=>r.id);
    console.log(`Nullifying password for ${ids.length} user(s):`);
    for(const r of res.rows){
      console.log(`- id=${r.id} email=${r.email}`);
    }

    const updateQ = `UPDATE "User" SET password = NULL WHERE id = ANY($1::text[])`;
    const updRes = await client.query(updateQ, [ids]);
    console.log(`Updated ${updRes.rowCount} rows (password set to NULL).`);
    await client.end();
  }catch(e){
    console.error('Error updating DB:', e.message||e);
    process.exit(1);
  }
}

main();
