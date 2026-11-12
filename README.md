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

# Navodila za uporabo in zagon / Guide / Tutorial 


## 1. Funkcionalnosti aplikacije

FixDesk omogoča:

- Prijavo in odjavo uporabnikov.
- Avtentikacijo z JWT žetonom v HttpOnly piškotku.
- Upravljanje dostopa glede na uporabniško vlogo.
- Ustvarjanje novih IT zahtevkov.
- Pregled zahtevkov glede na uporabniško vlogo.
- Filtriranje zahtevkov po statusu in prioriteti.
- Dodeljevanje zahtevkov IT-tehnikom.
- Spreminjanje statusa zahtevkov.
- Vnos opisa rešitve.
- Zaključevanje rešenih zahtevkov.
- Komunikacijo med zaposlenim in IT-tehnikom prek komentarjev.

### Uporabniške vloge

**Zaposleni (EMPLOYEE)**

- Ustvari nov zahtevek.
- Pregleduje svoje zahtevke.
- Spremlja njihov status.
- Komunicira z IT-tehnikom.
- Zaključi zahtevek, ko je težava rešena.

**IT-tehnik (TECHNICIAN)**

- Pregleduje zahtevke, ki so mu dodeljeni.
- Začne obravnavo zahtevka.
- Komunicira s prijaviteljem.
- Vnese opis rešitve.
- Označi zahtevek kot rešen.

**Administrator (ADMIN)**

- Pregleduje vse zahtevke.
- Filtrira zahtevke.
- Pregleduje aktivne IT-tehnike.
- Dodeljuje in prerazporeja zahtevke tehnikom.

## 2. Zahteve za zagon

Pred zagonom je treba namestiti:

1. Git
2. Node.js 24 ali novejši
3. npm
4. Docker Desktop oziroma Docker Engine z Docker Compose

Povezave:

- Git: https://git-scm.com/
- Node.js: https://nodejs.org/
- Docker Desktop: https://www.docker.com/products/docker-desktop/

### Preverjanje namestitve

V terminalu izvedite:

```powershell
git --version
node --version
npm --version
docker --version
docker compose version
```

Če ukazi uspešno izpišejo različice, je okolje pripravljeno.

Pred nadaljevanjem zaženite Docker Desktop.

### Uporabljeni porti

| Storitev | Naslov |
|---|---|
| PostgreSQL | localhost:5433 |
| Backend API | http://localhost:3000 |
| Frontend | http://localhost:5173 |

Porti morajo biti prosti.

Pomembno: aplikacijo odpirajte prek `localhost`, ker so frontend URL, backend URL in CORS nastavitve trenutno prilagojeni lokalnemu razvoju.

## 3. Prenos projekta

Odprite PowerShell ali drug terminal.

Klonirajte repozitorij:

```powershell
git clone https://github.com/alenk2/projekt-rirs.git
```

Premaknite se v mapo projekta:

```powershell
cd projekt-rirs
```

Struktura projekta:

```text
projekt-rirs/
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── db.ts
│   │   ├── index.ts
│   │   └── seed.ts
│   ├── prisma7.config.ts
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── App.tsx
│   │   └── App.css
│   └── package.json
├── docs/
├── docker-compose.yml
├── .env.example
└── README.md
```

## 4. Nastavitev okoljskih spremenljivk

Projekt uporablja dve ločeni datoteki `.env`.

- Korenska `.env` vsebuje geslo za PostgreSQL.
- `backend/.env` vsebuje povezavo do podatkovne baze, JWT skrivnost in geslo za testne uporabnike.

Ti datoteki vsebujeta občutljive podatke in se ne dodajata v Git.

### 4.1 Korenska .env

V korenski mapi projekta ustvarite datoteko `.env`.

Če obstaja `.env.example`, jo lahko kopirate:

```powershell
Copy-Item .env.example .env
```

V datoteko vnesite:

```dotenv
POSTGRES_PASSWORD=FixDeskDb2026
```

To je primer gesla za lokalno testno bazo.

### 4.2 Backend .env

V mapi `backend/` ustvarite novo datoteko `.env`.

Vsebina:

```dotenv
DATABASE_URL="postgresql://fixdesk:FixDeskDb2026@localhost:5433/fixdesk?schema=public"

JWT_SECRET="zamenjajte_s_to_dolgo_nakljucno_skrivnostjo"

SEED_USER_PASSWORD="FixDeskTest2026"
```

Pomen spremenljivk:

| Spremenljivka | Namen |
|---|---|
| DATABASE_URL | Povezava do PostgreSQL podatkovne baze |
| JWT_SECRET | Skrivni ključ za podpisovanje JWT žetonov |
| SEED_USER_PASSWORD | Geslo testnih uporabniških računov |

Geslo v `DATABASE_URL` mora biti enako kot `POSTGRES_PASSWORD`.

### Generiranje JWT skrivnosti

Za varnejšo nastavitev lahko v terminalu izvedete:

```powershell
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Izpisano vrednost kopirajte v `JWT_SECRET`.

Testno geslo `FixDeskTest2026` je namenjeno izključno lokalnemu testiranju.

## 5. Zagon PostgreSQL podatkovne baze

V korenski mapi projekta izvedite:

```powershell
docker compose up -d
```

Docker bo prenesel ustrezno PostgreSQL sliko, ustvaril vsebnik in zagnal podatkovno bazo.

Preverite stanje:

```powershell
docker compose ps
```

Vsebnik PostgreSQL mora biti zagnan.

Podatkovna baza uporablja:

| Nastavitev | Vrednost |
|---|---|
| Gostitelj | localhost |
| Port | 5433 |
| Podatkovna baza | fixdesk |
| Uporabnik | fixdesk |
| Geslo | Vrednost POSTGRES_PASSWORD |

Podatki se hranijo v Docker volumnu, zato ostanejo shranjeni tudi po ustavitvi vsebnika.

## 6. Namestitev backend aplikacije

Odprite terminal in se premaknite v mapo:

```powershell
cd backend
```

Namestite odvisnosti:

```powershell
npm install
```

### 6.1 Prisma migracije

Projekt uporablja Prisma ORM za delo s PostgreSQL.

Konfiguracijska datoteka se imenuje `prisma7.config.ts`, zato jo pri Prisma ukazih navedemo izrecno.

Izvedite:

```powershell
npx prisma migrate deploy --config prisma7.config.ts
```

Ta ukaz ustvari podatkovne tabele na podlagi migracij, ki so že vključene v projekt.

Nato ustvarite Prisma Client:

```powershell
npx prisma generate --config prisma7.config.ts
```

Če ukaza uspeta, je podatkovna baza pripravljena za uporabo.

### 6.2 Ustvarjanje testnih uporabnikov

Projekt vsebuje seed skripto za ustvarjanje treh testnih uporabnikov.

V mapi `backend/` izvedite:

```powershell
npx tsx src/seed.ts
```

Skripta ustvari oziroma posodobi tri uporabniške račune.

| Vloga | E-poštni naslov | Geslo |
|---|---|---|
| Zaposleni | employee@fixdesk.local | FixDeskTest2026 |
| IT-tehnik | technician@fixdesk.local | FixDeskTest2026 |
| Administrator | admin@fixdesk.local | FixDeskTest2026 |

Če ste v `.env` spremenili `SEED_USER_PASSWORD`, uporabite novo vrednost namesto `FixDeskTest2026`.

Vsi trije uporabniki so namenjeni testiranju funkcionalnosti aplikacije.

### 6.3 Ustvarjanje kategorij

Za ustvarjanje zahtevkov mora podatkovna baza vsebovati vsaj eno kategorijo.

Če je baza popolnoma nova, lahko kategorije ustvarite prek PostgreSQL terminala.

Odprite nov terminal in izvedite:

```powershell
docker exec -it fixdesk-db psql -U fixdesk -d fixdesk
```

V PostgreSQL konzoli izvedite:

```sql
INSERT INTO categories (name, description)
VALUES
    ('Strojna oprema', 'Tezave z napravami'),
    ('Programska oprema', 'Tezave s programsko opremo'),
    ('Omrezje', 'Tezave z omrezno povezavo');
```

Ukaz izvedite samo enkrat na novi bazi, da ne ustvarjate podvojenih kategorij.

PostgreSQL konzolo zapustite z:

```text
\q
```

Če ime Docker vsebnika ni `fixdesk-db`, ga preverite z ukazom:

```powershell
docker compose ps
```

### 6.4 Zagon backenda

V terminalu, ki je odprt v mapi `backend/`, izvedite:

```powershell
npm run dev
```

Backend je dostopen na:

http://localhost:3000

### Preverjanje delovanja

V brskalniku odprite:

http://localhost:3000/api/health

Za preverjanje povezave s podatkovno bazo:

http://localhost:3000/api/db-health

Če API in podatkovna baza delujeta, lahko nadaljujete z zagonom frontenda.

Terminal z backend aplikacijo pustite odprt.

## 7. Namestitev frontend aplikacije

Odprite nov terminal.

Premaknite se v mapo frontend:

```powershell
cd projekt-rirs/frontend
```

Če ste že v korenski mapi projekta, zadostuje:

```powershell
cd frontend
```

Namestite odvisnosti:

```powershell
npm install
```

Zaženite React aplikacijo:

```powershell
npm run dev
```

Odprite:

http://localhost:5173

Prikazati se mora prijavna stran aplikacije FixDesk.

Za pravilno delovanje morajo biti istočasno zagnani:

1. PostgreSQL Docker vsebnik.
2. Express backend.
3. React frontend.

## 8. Testiranje celotne aplikacije

V nadaljevanju je opisan celoten proces od ustvarjanja zahtevka do zaključka.

Uporabite tri testne račune, ki ste jih ustvarili s seed skripto.

### 8.1 Prijava zaposlenega

Prijavite se:

**E-pošta:** employee@fixdesk.local

**Geslo:** FixDeskTest2026

Po uspešni prijavi se prikažeta:

- Seznam "Moji zahtevki".
- Obrazec za ustvarjanje novega zahtevka.

### 8.2 Ustvarjanje novega zahtevka

Izpolnite obrazec s testnimi podatki:

| Polje | Primer |
|---|---|
| Naslov | Tiskalnik ne deluje |
| Opis | Tiskalnik ne tiska dokumentov |
| Kategorija | Strojna oprema |
| Vpliv | HIGH |
| Nujnost | HIGH |

Kliknite gumb za ustvarjanje zahtevka.

Preverite:

- Zahtevek je uspešno ustvarjen.
- Zahtevek se pojavi v seznamu.
- Začetni status je `OPEN`.
- Zahtevek še nima dodeljenega tehnika.

Zaposleni lahko vidi samo svoje zahtevke.

### 8.3 Dodajanje komentarja

Odprite podrobnosti ustvarjenega zahtevka.

V razdelku Komentarji napišite:

```text
Tiskalnik sem ponovno zagnal, vendar težava ostaja.
```

Kliknite "Pošlji komentar".

Preverite, da se komentar prikaže skupaj z avtorjem in časom objave.

### 8.4 Dodeljevanje zahtevka

Odjavite se.

Prijavite se kot administrator:

**E-pošta:** admin@fixdesk.local

**Geslo:** FixDeskTest2026

Administrator vidi seznam vseh zahtevkov.

Poiščite zahtevek "Tiskalnik ne deluje" in odprite njegove podrobnosti.

V razdelku za dodeljevanje izberite IT-tehnika:

```text
Test Technician
```

Kliknite "Dodeli tehnika".

Preverite:

- Zahtevek je uspešno dodeljen.
- V tabeli je prikazano ime tehnika.
- Dodelitev ostane shranjena po osvežitvi strani.

### 8.5 Obravnava zahtevka

Odjavite se in prijavite kot IT-tehnik:

**E-pošta:** technician@fixdesk.local

**Geslo:** FixDeskTest2026

Na seznamu "Dodeljeni zahtevki" mora biti viden zahtevek, ki ga je dodelil administrator.

Odprite njegove podrobnosti.

Kliknite:

```text
Začni obravnavo
```

Status zahtevka se spremeni:

```text
OPEN → IN_PROGRESS
```

IT-tehnik lahko sedaj dodaja komentarje in obravnava težavo.

### 8.6 Odgovor IT-tehnika

V razdelku Komentarji napišite:

```text
Preverite, ali je tiskalnik povezan v omrezje.
```

Pošljite komentar.

Preverite, da je komentar prikazan pod sporočilom zaposlenega.

Komentarji morajo biti razvrščeni kronološko.

### 8.7 Reševanje zahtevka

Kot IT-tehnik vnesite opis rešitve:

```text
Ponovno sem namestil gonilnike tiskalnika.
```

Kliknite:

```text
Označi kot rešeno
```

Status se spremeni:

```text
IN_PROGRESS → RESOLVED
```

Opis rešitve se shrani v podatkovno bazo.

### 8.8 Zaključek zahtevka

Odjavite se in ponovno prijavite kot zaposleni:

```text
employee@fixdesk.local
```

Odprite svoj zahtevek.

Preverite, da sta vidna:

- Opis rešitve IT-tehnika.
- Zgodovina komentarjev.

Kliknite:

```text
Zaključi zahtevek
```

Status se spremeni:

```text
RESOLVED → CLOSED
```

Po zaključku:

- Zahtevek ostane v seznamu.
- Komentarji ostanejo vidni.
- Dodajanje novih komentarjev ni več dovoljeno.
- Zaključenega zahtevka ni več mogoče dodeliti drugemu tehniku.

## 9. Testiranje filtriranja zahtevkov

Aplikacija podpira filtriranje po statusu in prioriteti.

### Filtriranje po statusu

Možne vrednosti:

- OPEN
- IN_PROGRESS
- RESOLVED
- CLOSED

### Filtriranje po prioriteti

Možne vrednosti:

- LOW
- MEDIUM
- HIGH
- CRITICAL

Oba filtra lahko uporabljate hkrati.

Primer:

```text
Status: RESOLVED
Prioriteta: MEDIUM
```

Seznam prikaže samo zahtevke, ki ustrezajo izbranima filtroma.

Filtriranje se izvaja prek backend API-ja:

```http
GET /api/tickets?status=RESOLVED&priority=MEDIUM
```

## 10. Preverjanje uporabniških pravic

Aplikacija omejuje dostop na podlagi uporabniških vlog.

| Funkcionalnost | Zaposleni | IT-tehnik | Administrator |
|---|---|---|---|
| Ustvarjanje zahtevka | Da | Ne | Ne |
| Pregled lastnih zahtevkov | Da | Ne | Da |
| Pregled dodeljenih zahtevkov | Ne | Da | Da |
| Pregled vseh zahtevkov | Ne | Ne | Da |
| Dodeljevanje zahtevkov | Ne | Ne | Da |
| Začetek obravnave | Ne | Da, če je dodeljen | Ne |
| Označitev zahtevka kot rešenega | Ne | Da, če je dodeljen | Ne |
| Zaključek zahtevka | Da, če je prijavitelj | Ne | Ne |
| Komentiranje | Da, če je prijavitelj | Da, če je dodeljen | Ne |

Backend preverja pravice tudi na ravni API endpointov.

Skrivanje gumbov v React uporabniškem vmesniku zato ni edina zaščita.

Neprijavljen uporabnik pri zaščitenih endpointih prejme HTTP 401.

Uporabnik brez ustreznih pravic praviloma prejme HTTP 403.

## 11. Preverjanje statusov

Dovoljeni prehodi statusov:

| Začetni status | Novi status | Dovoljena vloga |
|---|---|---|
| OPEN | IN_PROGRESS | Dodeljeni IT-tehnik |
| IN_PROGRESS | RESOLVED | Dodeljeni IT-tehnik |
| RESOLVED | CLOSED | Prijavitelj zahtevka |

Nedovoljeni prehodi se zavrnejo.

Pri prehodu v RESOLVED je obvezen opis rešitve.

Ob rešitvi se shrani čas `resolvedAt`.

Ob zaključku se shrani čas `closedAt`.

## 12. Samodejno določanje prioritete

Podatkovni model omogoča tri ravni vpliva in nujnosti:

- LOW
- MEDIUM
- HIGH

Prioriteta ima štiri možne vrednosti:

- LOW
- MEDIUM
- HIGH
- CRITICAL

V trenutni implementaciji backend pri ustvarjanju zahtevka še uporablja privzeto prioriteto `MEDIUM`.

Samodejni izračun prioritete na podlagi vpliva in nujnosti je predvidena izboljšava.

Ko bo implementiran, je treba preveriti vseh devet kombinacij vpliva in nujnosti ter njihovo ujemanje z določeno matriko prioritet.

## 13. Preverjanje kode

### Backend

V mapi `backend/` izvedite:

```powershell
npm run typecheck
npm run build
```

### Frontend

V mapi `frontend/` izvedite:

```powershell
npm run lint
npm run build
```

Vsi ukazi se morajo zaključiti brez napak.

## 14. Ustavitev aplikacije

Frontend in backend ustavite s kombinacijo:

```text
Ctrl + C
```

Podatkovno bazo ustavite iz korenske mape:

```powershell
docker compose down
```

Ta ukaz ustavi vsebnike, vendar ohrani podatkovni volume.

### Ponovni zagon

Pri naslednjem zagonu izvedite:

V korenski mapi:

```powershell
docker compose up -d
```

V mapi `backend/`:

```powershell
npm run dev
```

V mapi `frontend/`:

```powershell
npm run dev
```

Migracij in ustvarjanja testnih uporabnikov ni treba ponavljati, če je podatkovna baza ostala shranjena.

### Popolna ponastavitev podatkovne baze

Za brisanje vseh podatkov in Docker volumna:

```powershell
docker compose down -v
```

POZOR: Ta ukaz izbriše podatke v testni bazi.

Po ponastavitvi je treba ponovno izvesti migracije, ustvariti uporabnike in dodati kategorije.

## 15. Pogoste težave

### Docker se ne zažene

Preverite, ali Docker Desktop deluje.

```powershell
docker compose ps
```

### Port 5433 je že zaseden

Preverite, ali na portu teče drug program.

Po potrebi spremenite preslikavo porta v `docker-compose.yml` in ustrezno prilagodite `DATABASE_URL`.

### Prisma ne najde podatkovne baze

Preverite:

- Ali Docker vsebnik deluje.
- Ali je `DATABASE_URL` pravilno nastavljen.
- Ali se geslo ujema z `POSTGRES_PASSWORD`.
- Ali uporabljate port 5433.

### Prisma Client ni generiran

V mapi backend izvedite:

```powershell
npx prisma generate --config prisma7.config.ts
```

### Prijava ne deluje

Preverite:

- Ali backend deluje.
- Ali ste izvedli seed skripto.
- Ali uporabljate pravilno geslo.
- Ali je frontend odprt na `http://localhost:5173`.

Za ponovno ustvarjanje testnih uporabnikov:

```powershell
npx tsx src/seed.ts
```

### Ni kategorij za izbiro

Preverite, ali tabela `categories` vsebuje podatke.

Če je prazna, dodajte začetne kategorije po navodilih iz poglavja 7.3.

### Zahtevka ni mogoče zaključiti

Zahtevek mora imeti status `RESOLVED`.

Zaključi ga lahko samo zaposleni, ki ga je ustvaril.

### Tehnik ne vidi zahtevka

Administrator mora zahtevek najprej dodeliti temu tehniku.

## 16. Projektna dokumentacija

Dodatna dokumentacija se nahaja v mapi `docs/`.

Pomembne datoteke:

- [Zasnova rešitve](docs/01-zasnova-resitve.md)
- [Funkcionalnosti in obseg](docs/02-funkcionalnosti-in-obseg.md)
- [Uporabniške zgodbe](docs/05-uporabniske-zgodbe.md)
- [Arhitekturne odločitve](docs/adr/)

Projekt je razvijan po načelih GitHub Flow.

Razvojne naloge so evidentirane kot GitHub Issues, spremembe pa so združene prek Pull Requestov.

## 17. Varnostna opozorila

Projekt je namenjen lokalnemu razvoju in demonstraciji MVP funkcionalnosti.

Testni uporabniški računi in prikazana gesla niso namenjeni produkcijski uporabi.

Za produkcijsko uporabo bi bilo treba dodatno urediti:

- Varno upravljanje okoljskih spremenljivk in skrivnosti.
- HTTPS povezave.
- Ustrezno CSRF zaščito.
- Varne produkcijske nastavitve piškotkov in CORS.
- Produkcijsko infrastrukturo in nadzor storitev.
