# PostgreSQL kot relacijska podatkovna baza

## Kontekst in problem

Uporabniki, zahtevki, kategorije in komentarji imajo jasno določene odnose. Sistem mora ohranjati sklice in celovitost podatkov tudi ob spremembah.

## Obravnavane alternative

- **PostgreSQL:** Relacije, tuji ključi in transakcije.
- **MongoDB:** Prilagodljivi dokumenti, a relacije bi morali voditi drugače.
- **SQLite:** Enostavna lokalna baza, manj primerna za načrtovano ločeno strežniško okolje.

## Sprejeta odločitev

Izbrana možnost: **PostgreSQL**, ker se relacijski model FixDesk naravno preslika v tabele, tuji ključi pa preprečujejo neveljavne povezave med zahtevki in uporabniki.

### Posledice

- **Pozitivno:** Podpora relacijski integriteti in transakcijam.
- **Pozitivno:** Dobra podpora za filtriranje in poizvedovanje po zahtevkih.
- **Negativno:** PostgreSQL bomo imeli v Docker kontejneru, ki porablja sistemske vire in ga je treba ustrezno konfigurirati.
- **Negativno:** Spremembe sheme zahtevajo premišljene migracije.
