// Photo-backed additions. No inferred prices or new-arrival claims.
// Run: node --env-file=.env.local scripts/expand-catalogue.mjs
import { Client, TablesDB, Storage, Query, Permission, Role } from 'node-appwrite';
import { InputFile } from 'node-appwrite/file';
const e = process.env;
const client = new Client().setEndpoint(e.NEXT_PUBLIC_APPWRITE_ENDPOINT).setProject(e.NEXT_PUBLIC_APPWRITE_PROJECT_ID).setKey(e.APPWRITE_API_KEY);
const db = new TablesDB(client);
const storage = new Storage(client);
const base = {databaseId:e.APPWRITE_DATABASE_ID,tableId:e.APPWRITE_PRODUCTS_COLLECTION_ID};
const categoryRows = await db.listRows({databaseId:e.APPWRITE_DATABASE_ID,tableId:e.APPWRITE_CATEGORIES_COLLECTION_ID,queries:[Query.limit(100)]});
const categories = new Map(categoryRows.rows.map(c=>[c.name,c.$id]));
const additions = [
  {id:'photo_posmith_dc_breaker',name:'63A DC Circuit Breaker',slug:'posmith-nd1-63dc-c63-breaker',brand:'Posmith',model:'ND1-63DC',category:'Circuit Breakers',photo:'catalog_posmith_components',description:'Posmith DC circuit breaker photographed alongside the solar protection components. Ask our team to confirm availability and suitability for your installation.',specifications:[{label:'Printed current marking',value:'C63'},{label:'Printed voltage',value:'500V DC'}]},
  {id:'photo_posmith_dc_spd',name:'DC Surge Protection Device',slug:'posmith-psm-1-dc-surge-protection',brand:'Posmith',model:'PSM-1 (DC)',category:'Surge Protection',photo:'catalog_posmith_components',description:'The DC-marked Posmith PSM-1 surge protection device shown in our product photo. Confirm the required configuration and quantity with our team.',specifications:[{label:'Ucpv',value:'1000V DC'},{label:'In',value:'20kA'},{label:'Imax',value:'40kA'}]},
  {id:'photo_posmith_voltage',name:'Adjustable Voltage Protector',slug:'posmith-pva-1-voltage-protector',brand:'Posmith',model:'PVA-1',category:'Voltage Protection',photo:'catalog_posmith_components',description:'Posmith PVA-1 adjustable voltage protector with a digital display, as shown in our product photograph. Ask for the available rating before ordering.',specifications:[{label:'Model on unit',value:'PVA-1'},{label:'Display',value:'Digital'}]},
  {id:'photo_joyelec_ac_breaker',name:'16A AC Circuit Breaker',slug:'joyelec-qyb2-63-c16-ac-breaker',brand:'JOYELEC',model:'QYB2-63',category:'Circuit Breakers',photo:'catalog_joyelec_components',description:'JOYELEC AC circuit breaker with C16 marking, shown at the right of our component photograph. Contact us for availability and installation requirements.',specifications:[{label:'Printed current marking',value:'C16'},{label:'Printed voltage',value:'415V AC'},{label:'Frequency',value:'50/60Hz'}]},
  {id:'photo_joyelec_ac_spd',name:'AC Surge Protection Device',slug:'joyelec-qy-spd-40-ac-surge-protection',brand:'JOYELEC',model:'QY-SPD-40',category:'Surge Protection',photo:'catalog_joyelec_components',description:'The red JOYELEC AC surge protection device in our component photograph. Ask our team about the configuration and quantity you need.',specifications:[{label:'Uc',value:'385V AC'},{label:'In',value:'20kA'},{label:'Imax',value:'40kA'}]},
  {id:'photo_joyelec_voltage',name:'Voltage & Current Protector',slug:'joyelec-vap-80-voltage-current-protector',brand:'JOYELEC',model:'VAP-80',category:'Voltage Protection',photo:'catalog_joyelec_components',description:'JOYELEC VAP-80 adjustable voltage and current protector with a digital display. The model is visible in our product photo; confirm the available rating with our team.',specifications:[{label:'Model on unit',value:'VAP-80'},{label:'Display',value:'Digital'}]},
];
for (const [fileId,path] of [
  ['catalog_posmith_components','assets/products/client_photos/enhanced_full/1000420741_enhanced.jpg'],
  ['catalog_joyelec_components','assets/products/client_photos/enhanced_full/1000420738_enhanced.jpg'],
]) {
  try { await storage.getFile({bucketId:e.APPWRITE_BUCKET_ID,fileId}); }
  catch (err) {
    if (err.code !== 404) throw err;
    await storage.createFile({bucketId:e.APPWRITE_BUCKET_ID,fileId,file:InputFile.fromPath(path),permissions:[Permission.read(Role.any())]});
    console.log('Uploaded product photograph:', fileId);
  }
}
for (const [index,p] of additions.entries()) {
  const existing = await db.listRows({...base,queries:[Query.equal('slug',p.slug),Query.limit(1)]});
  if (existing.rows.length) { console.log('Already present:',p.slug); continue; }
  const categoryId = categories.get(p.category);
  if (!categoryId) throw new Error('Missing category: '+p.category);
  await db.createRow({...base,rowId:p.id,data:{name:p.name,slug:p.slug,brand:p.brand,model:p.model,categoryId,
    shortDescription:p.description,description:p.description,price:null,currency:'NGN',published:true,inStock:true,
    isNewArrival:false,isNowAvailable:false,imageIds:[p.photo],specifications:JSON.stringify(p.specifications),sortOrder:10+index}});
  console.log('Created:',p.name,p.model);
}
const result = await db.listRows({...base,queries:[Query.equal('published',true),Query.limit(100)]});
console.log('Published product count:',result.total);
