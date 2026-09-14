const fs = require('fs');
const p = 'src/components/home/who-we-serve.tsx';
let s = fs.readFileSync(p, 'utf8');

s = s.replace(
  'import Link from "next/link";',
  'import Link from "next/link";\nimport Image from "next/image";'
);

s = s.replace(
  `  summary: string;
  query: string;
}`,
  `  summary: string;
  query: string;
  /** Optional backdrop photo. Cards without one keep the plain frosted panel. */
  image?: string;
}`
);

const rows = [
  ['electrical-contractors', null],
  ['solar-installers', 'solar-installers'],
  ['engineers', 'engineers'],
  ['industrial-technicians', 'industrial-technicians'],
  ['businesses', 'businesses'],
  ['retailers', 'retailers'],
  ['homeowners', null],
];
for (const [id, file] of rows) {
  if (!file) continue;
  const re = new RegExp(`(\{ id: "${id}",[^}]*?)( \}),`);
  if (!re.test(s)) throw new Error('row not found: ' + id);
  s = s.replace(re, `$1, image: "/audiences/${file}.jpeg"$2,`);
}

// Card body: decorative photo + scrim behind the text.
const oldBody = `                    <Link href={\`/products?q=\${encodeURIComponent(item.query)}\`} className={styles.card}>
                      <span className={styles.number}>{item.number}</span>`;
const newBody = `                    <Link href={\`/products?q=\${encodeURIComponent(item.query)}\`} className={styles.card}>
                      {item.image && (
                        <>
                          {/* Decorative: the title already names the audience. */}
                          <Image
                            src={item.image}
                            alt=""
                            fill
                            sizes="(min-width: 1024px) 240px, (min-width: 640px) 214px, 172px"
                            className={styles.cardImage}
                          />
                          <span aria-hidden="true" className={styles.cardScrim} />
                        </>
                      )}
                      <span className={styles.number}>{item.number}</span>`;
if (!s.includes(oldBody)) throw new Error('card body not found');
s = s.replace(oldBody, newBody);

fs.writeFileSync(p, s);
console.log('images wired:', (s.match(/\/audiences\//g) || []).length);
