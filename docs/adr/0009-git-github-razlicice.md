# Git in GitHub za nadzor različic

## Kontekst in problem

Koda, dokumentacija, podatkovna shema in ADR-ji se bodo spreminjali skozi vaje. Spremembe morajo biti sledljive in obnovljive.

## Obravnavane alternative

- **Git + GitHub:** Lokalna zgodovina ter oddaljeni repozitorij za sodelovanje in oddajo.
- **Git samo lokalno:** Deluje brez gostovanja, a brez priročne skupne oddaljene kopije.
- **Ročno arhiviranje ZIP datotek:** Preprosto, vendar oteži primerjanje in združevanje sprememb.

## Sprejeta odločitev

Izbrana možnost: **Git in GitHub**, ker omogočata sledljiv razvoj, varnostno kopijo oddanih različic ter lažji pregled sprememb kode in dokumentacije.

### Posledice

- **Pozitivno:** Zgodovina sprememb in možnost vračanja.
- **Pozitivno:** Dokumentacijo ter migracije lahko verzioniramo skupaj s kodo.
- **Negativno:** Potrebna je natančnost pri commitih in reševanju konfliktov.
- **Negativno:** Skrivnosti in lokalne generirane datoteke je treba izločiti iz repozitorija.
