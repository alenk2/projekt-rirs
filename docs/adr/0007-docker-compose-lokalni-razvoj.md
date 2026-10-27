# Docker Compose za lokalni PostgreSQL

## Kontekst in problem

Projekt mora biti mogoče predvidljivo zagnati na različnih računalnikih. V prvi fazi frontend in backend tečeta lokalno, podatkovna baza pa v vsebniku.

## Obravnavane alternative

- **Docker Compose za PostgreSQL, npm za frontend/backend:** Ponovljiva konfiguracija baze brez vsebnikovanja razvojnega strežnika.
- **Ročno nameščen PostgreSQL:** Brez Dockerja, a odvisnost od lokalne namestitve in nastavitev.
- **Vsi deli v Docker Compose:** Večja izolacija, a dodatne razvojne konfiguracije za hot reload in debugiranje.

## Sprejeta odločitev

Izbrana možnost: **Docker Compose za PostgreSQL ter lokalni npm zagon aplikacij**, ker omogoča dosledno različico in nastavitve baze, hkrati pa ohranja preprosto poganjanje in razhroščevanje React ter Express aplikacije.

### Posledice

- **Pozitivno:** Manj razlik pri nastavitvi baze med razvijalci.
- **Pozitivno:** Frontend in backend je enostavno zagnati v razvojnih načinih.
- **Negativno:** Dodatno potrebujemo Docker, ki mora biti nameščen in zagnan.
- **Negativno:** Treba je uskladiti vrata, okoljske spremenljivke ter migracije baze.
