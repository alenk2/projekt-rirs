# FixDesk

**FixDesk** je spletna aplikacija za upravljanje IT zahtevkov znotraj podjetja ali organizacije. Zaposlenim omogoča prijavo tehničnih težav in spremljanje reševanja, IT tehnikom obravnavo zahtevkov in komunikacijo z zaposlenimi, administratorjem pa dodeljevanje zahtevkov ter pregled nad delom IT podpore. Sistem predvideva tudi samodejno določanje prioritete glede na vpliv in nujnost težave.

## Uporabljene tehnologije

| Del | Tehnologije |
| --- | --- |
| Frontend | React, TypeScript, Vite |
| Backend | Node.js, Express, TypeScript |
| Podatkovna baza | PostgreSQL |
| Dostop do baze | Prisma ORM |
| Avtentikacija | JWT, bcrypt |
| Lokalni razvoj | Docker Compose, npm |
| Nadzor različic | Git, GitHub |

## Dokumentacija

Dokumentacija projekta je v mapi [`docs/`](docs/):

- [Zasnova rešitve](docs/01-zasnova-resitve.md)
- [Funkcionalnosti in obseg](docs/02-funkcionalnosti-in-obseg.md)
- [Podatkovni model](docs/03-podatkovni-model.md)
- [Arhitektura in tehnološki sklad](docs/04-arhitektura-in-tehnoloski-sklad.md)
- [Uporabniške zgodbe in kriteriji sprejema](docs/05-uporabniske-zgodbe.md)
- [Wireframe-i](docs/06-wireframes.md)
- ADR-ji
  - [0001 - React, TypeScript in Vite za frontend](docs/adr/0001-react-typescript-vite.md)
  - [0002 - Node.js, Express in TypeScript za backend](docs/adr/0002-node-express-typescript.md)
  - [0003 - PostgreSQL kot relacijska podatkovna baza](docs/adr/0003-postgresql-relacijska-baza.md)
  - [0004 - Prisma ORM za dostop do podatkovne baze](docs/adr/0004-prisma-orm.md)
  - [0005 - JWT avtentikacija in uporabniške vloge](docs/adr/0005-jwt-avtentikacija-in-vloge.md)
  - [0006 - REST API in JSON za komunikacijo](docs/adr/0006-rest-json-api.md)
  - [0007 - Docker Compose za lokalni razvoj](docs/adr/0007-docker-compose-lokalni-razvoj.md)
  - [0008 - Zunanja e-poštna storitev za obvestila](docs/adr/0008-zunanja-e-postna-storitev.md)
  - [0009 - Git in GitHub za nadzor različic](docs/adr/0009-git-github-razlicice.md)


