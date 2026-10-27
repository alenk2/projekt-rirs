# Prisma ORM za dostop do baze

## Kontekst in problem

Backend mora varno izvajati poizvedbe nad povezanimi entitetami ter usklajevati spremembe podatkovnega modela z implementacijo.

## Obravnavane alternative

- **Prisma ORM:** Tipiziran odjemalec, shema in migracije.
- **SQL poizvedbe s knjižnico pg:** Več nadzora nad SQL, a več ročnega preslikavanja in vzdrževanja.
- **TypeORM:** ORM z drugim modelom entitet in migracij.

## Sprejeta odločitev

Izbrana možnost: **Prisma ORM**, ker tipiziran dostop zmanjša napake pri poizvedbah, shema Prisma pa omogoča sledljive migracije PostgreSQL strukture.

### Posledice

- **Pozitivno:** Tipizirane poizvedbe v TypeScriptu.
- **Pozitivno:** Migracije in podatkovni model so del repozitorija.
- **Negativno:** Dodatna plast abstrakcije in orodja za generiranje odjemalca (Prisma client).
- **Negativno:** Zahtevnejše poizvedbe lahko potrebujejo surov SQL.
