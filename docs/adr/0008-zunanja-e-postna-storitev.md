# Zunanja e-poštna storitev za obvestila

## Kontekst in problem

Ob komentarju tehnika ali zaposlenega mora ustrezni prejemnik dobiti obvestilo. Pošiljanje e-pošte ne sme razkriti API ključa v brskalniku.

## Obravnavane alternative

- **Zunanji ponudnik prek API-ja (Resend ali SendGrid):** Pošiljanje e-pošte iz backenda prek ponudnikovega API-ja.
- **Lasten SMTP strežnik:** Več nadzora, a zahtevna implementacija in vzdrževanje.
- **Samo obvestila v aplikaciji:** Brez zunanje odvisnosti, vendar uporabnik obvestila izven aplikacije ne prejme.

## Sprejeta odločitev

Izbrana možnost: **zunanja e-poštna storitev prek backenda**, ker zmanjša breme vzdrževanja poštne infrastrukture. Konkretni ponudnik (Resend ali SendGrid) še ni dokončno izbran; API ključ bo le v strežniških okoljskih spremenljivkah.

### Posledice

- **Pozitivno:** Uporabnik lahko dobi sporočilo tudi, ko ni prijavljen v FixDesk.
- **Pozitivno:** Ni potrebe po vzdrževanju lastnega poštnega strežnika.
- **Negativno:** Zunanja storitev lahko odpove ali uvede omejitve oziroma stroške.
- **Negativno:** Treba je obravnavati neuspešno pošiljanje, varovanje ključev in osebnih podatkov.
