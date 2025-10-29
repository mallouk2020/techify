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
    const q = `SELECT id, email, CASE WHEN password IS NULL THEN NULL ELSE substring(password from 1 for 8) END AS snippet, length(COALESCE(password,'')) AS len FROM "User" WHERE password IS NOT NULL AND password !~ '^\\$2[aby]\\$[0-9]{2}\\$[./A-Za-z0-9]{53}$'`;
    const res = await client.query(q);
    if(res.rows.length===0){
      console.log('No non-bcrypt password rows found.');
    } else {
      console.log(`Found ${res.rows.length} user(s) with non-bcrypt password values:`);
      for(const r of res.rows){
        console.log(`- id=${r.id} email=${r.email} len=${r.len} snippet=${r.snippet}`);
      }
    }
    await client.end();
  }catch(e){
    console.error('Error querying DB:', e.message||e);
    process.exit(1);
  }
}

main();
