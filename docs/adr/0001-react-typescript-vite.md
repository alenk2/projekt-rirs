# React, TypeScript in Vite za frontend

## Kontekst in problem

FixDesk potrebuje spletni vmesnik z več pogledi za zaposlene, tehnike in administratorje. Kako razviti ponovno uporabljiv in vzdržljiv vmesnik ter hitro lokalno razvojno okolje?

## Obravnavane alternative

- **React + TypeScript + Vite:** Komponente, preverjanje tipov in hiter razvojni strežnik.
- **Vue + TypeScript + Vite:** Podoben komponentni pristop, vendar bi zahteval prilagoditev na drugo ogrodje.
- **HTML, CSS in JavaScript brez ogrodja:** Manj začetnih odvisnosti, a več ročnega upravljanja stanja in pogledov.

## Sprejeta odločitev

Izbrana možnost: **React + TypeScript + Vite**, ker React omogoča ponovno uporabo komponent med vlogami, TypeScript pomaga odkriti napake v podatkovnih strukturah, z Reactom in TypeScriptom pa že imam izkušnje.

### Posledice

- **Pozitivno:** Skupne komponente obrazcev, tabel in komentarjev.
- **Pozitivno:** Hitrejše odkrivanje tipnih napak in enostaven razvoj z Vite.
- **Negativno:** Dodatna orodja in odvisnosti ter potreba po upravljanju stanja/pravilnega posodabljanja podatkov.
- **Negativno:** Spremembe API-ja lahko zahtevajo posodobitve tipov na frontendu.
