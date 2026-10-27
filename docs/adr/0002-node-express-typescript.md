# Node.js, Express in TypeScript za backend

## Kontekst in problem

Backend mora izvajati pravila za zahtevke, preverjati pravice uporabnikov in komunicirati s podatkovno bazo ter zunanjo e-poštno storitvijo.

## Obravnavane alternative

- **Node.js + Express + TypeScript:** Lahkoten REST strežnik in enoten jezik na obeh straneh.
- **NestJS + TypeScript:** Bolj strukturirano ogrodje, vendar več začetne konfiguracije.
- **Python + FastAPI:** Primeren za API, a uvede drug jezik in drugo razvojno okolje.

## Sprejeta odločitev

Izbrana možnost: **Node.js + Express + TypeScript**, ker omogoča enoten jezik s frontendom, enostavno sestavo API-ja in ponovno uporabo obstoječega znanja Node.js.

### Posledice

- **Pozitivno:** Enoten TypeScript sklad zmanjša preklapljanje med jeziki.
- **Pozitivno:** Express omogoča neposredno oblikovanje poti in vmesne programske opreme.
- **Negativno:** Strukturo projekta in validacijo zahtev moramo določiti sami.
- **Negativno:** Pri nepravilni uporabi asinhrone kode so možne napake in slabše odzivnosti.
