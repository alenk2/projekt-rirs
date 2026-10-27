# Funkcionalnosti in obseg

## 1. Uporabniške vloge

Sistem FixDesk predvideva tri uporabniške vloge. Dostop do podatkov in dovoljena dejanja so odvisni od vloge prijavljenega uporabnika.

### 1.1 Zaposleni

Opravila:
- Odda IT zahtevek z opisom težave, kategorijo, vplivom in nujnostjo.
- Pregleduje stanje in potek reševanja svojih zahtevkov.
- Izmenjuje komentarje/sporočila z IT tehnikom pri svojih zahtevkih.
- Potrdi, da je težava odpravljena, in zapre svoj rešeni zahtevek.

Omejitve:
- Nima dostopa do zahtevkov drugih zaposlenih.
- Ne more dodeljevati zahtevkov tehnikom ali spreminjati njihove sistemsko določene prioritete.
- Ne more sam označiti zahtevka kot rešenega ali upravljati uporabniških računov.

### 1.2 IT tehnik

Opravila:
- Pregleduje zahtevke, ki so mu dodeljeni.
- Dodeljeni zahtevek prevzame v obravnavo in spreminja njegovo stanje v skladu z dovoljenim postopkom.
- Komunicira z zaposlenim ki je oddal prijavo prek komentarjev/sporočil.
- Zabeleži opis izvedene rešitve in zahtevek označi kot rešen.

Omejitve:
- Ne more upravljati uporabniških računov ali spreminjati uporabniških vlog.
- Ne more dodeljevati zahtevkov drugim tehnikom.
- Nima dostopa do zahtevkov, ki mu niso dodeljeni.

### 1.3 IT administrator

Opravila:
- Pregleduje vse zahtevke in njihove statuse.
- Dodeljuje in prerazporeja zahtevke IT tehnikom.
- Spremlja obremenjenost tehnikov in zahtevke po prioritetah.
- Upravlja uporabniške račune, uporabniške vloge in kategorije zahtevkov.
- Po potrebi poseže v obravnavo zahtevka, na primer ob odsotnosti tehnika, ali če imajo vsi že preveč zahtevkov.

Omejitve:
- Nima neposrednega dostopa do gesel uporabnikov v berljivi obliki.
- Ne spreminja identitete prijavitelja že oddanega zahtevka ali briše zgodovine obravnave.

## 2. Predvidene funkcionalnosti

Imamo 14 predvidenih funkcionalnosti, od teh je prvih 6 MVP oz. najbolj ključne funkcionalnosti:

1. **(MVP) Prijava IT težave:** zaposleni ustvari zahtevek z naslovom, opisom, kategorijo, oceno vpliva in nujnosti. Ob oddaji sistem zabeleži prijavitelja in čas nastanka.
2. **(MVP) Samodejno določanje prioritete:** sistem na podlagi kombinacije vpliva in nujnosti izračuna prioriteto zahtevka (nizka, srednja, visoka ali kritična) po vnaprej določenih pravilih.
3. **(MVP) Dodeljevanje zahtevkov IT tehnikom:** administrator pregleduje nedodeljene zahtevke in jih dodeli izbranemu tehniku; dodelitev je vidna v podrobnostih zahtevka.
4. **(MVP) Obravnava zahtevka po določenem postopku:** zahtevek prehaja med stanji **Odprt → V obravnavi → Rešen → Zaprt**. Tehnik ga prevzame in označi kot rešenega, zaposleni pa potrdi rešitev in ga zapre.
5. **(MVP) Komunikacija pri zahtevku:** zaposleni in dodeljeni tehnik si v okviru zahtevka izmenjujeta komentarje/sporočila, ki se shranijo skupaj z avtorjem in časom objave.
6. **(MVP) Pregled in filtriranje zahtevkov glede na vlogo:** zaposleni vidi svoje zahtevke, tehnik dodeljene zahtevke, administrator pa vse; zahtevke je mogoče filtrirati po stanju in prioriteti.
7. **Razvrščanje zahtevkov po kategorijah:** zahtevki so razvrščeni v kategorije, na primer strojna oprema, programska oprema, omrežje in uporabniški računi.
8. **Iskanje zahtevkov:** uporabnik išče med zahtevki, do katerih ima dostop, po identifikacijski številki, naslovu ali ključnih besedah opisa.
9. **Zgodovina sprememb zahtevka:** sistem beleži spremembe stanja, dodelitve in prioritete, vključno s časom in uporabnikom, ki je spremembo izvedel.
10. **Pregled obremenjenosti tehnikov:** administrator vidi število odprtih in aktivnih zahtevkov posameznega tehnika.
11. **Obvestila znotraj aplikacije:** uporabnik prejme obvestilo ob pomembni spremembi svojega zahtevka, na primer ob dodelitvi ali rešitvi.
12. **Obveščanje prek zunanje storitve:** ob novem komentarju oziroma sporočilu pri zahtevku sistem prek zunanje e-poštne storitve (npr. Resend ali SendGrid) pošlje obvestilo drugi strani: zaposlenemu, kadar piše tehnik, oziroma dodeljenemu tehniku, kadar piše zaposleni.
13. **Poročila o IT podpori:** administrator pregleduje število zahtevkov po kategoriji, prioriteti in stanju ter osnovne statistike reševanja.
14. **Upravljanje uporabnikov in kategorij:** administrator aktivira ali deaktivira uporabniške račune, določa vloge in vzdržuje seznam kategorij zahtevkov.

Poleg teh funkcionalnosti je potrebna seveda tudi prijava v sistem in preverjanje pravic ter CRUD operacije.

## 3. Kasnejše nadgradnje

1. **Samodejno dodeljevanje zahtevkov** glede na kategorijo težave, znanja in trenutno obremenjenost tehnikov.
2. **Opozorila** za zahtevke, pri katerih se približuje rok za odziv ali rešitev.
3. **E-poštna obvestila** ob novih komentarjih/sporočilu, spremembah stanja in dodelitvah.
4. **Baza znanja** s pogosto ponavljajočimi se težavami in predlaganimi rešitvami.
5. **Prilaganje datotek** (npr. posnetkov zaslona ali dnevniških zapisov) k zahtevkom.
6. **Ocena zadovoljstva** po zaključenem zahtevku in statistika kakovosti podpore.
7. **Ponovno odpiranje zahtevkov** ob neuspešni rešitvi, skupaj z dodatnimi stanji in pravili potrjevanja.

## 4. Out of scope
Stvari, ki jih ne bo v aplikaciji:

- Oddaljenega dostopa do računalnikov zaposlenih ali samodejnega popravljanja naprav.
- Integracij z zunanjimi sistemi za IT podporo, kot so Jira Service Management, ServiceNow ali Microsoft Teams.
- Mobilne aplikacije za Android ali iOS; rešitev bo spletna aplikacija.
- Plačil, naročnin ali izdajanja računov.
- Naprednega spremljanja omrežja in samodejnega zaznavanja okvar IT infrastrukture.
- Uporabe umetne inteligence za diagnosticiranje težav ali generiranje rešitev.

