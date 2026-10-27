# Uporabniške zgodbe

## US-01 – Prijava IT težave (MVP)

- **Povezana funkcionalnost:** 1 – Prijava IT težave
- **Uporabniška vloga:** Zaposleni
- **Uporabniška zgodba:** Kot **zaposleni** želim **oddati IT zahtevek z opisom težave in oceno vpliva ter nujnosti**, da **lahko IT podpora organizirano obravnava mojo težavo**.
- **Acceptance criteria:**
  1. Obrazec zahteva neprazen naslov, opis, kategorijo, vpliv in nujnost; brez teh podatkov oddaja ni mogoča in prikaže se napaka pri manjkajočem polju.
  2. Kategorijo je mogoče izbrati le iz kategorij, ki so na voljo v sistemu; vpliv in nujnost imata vrednosti nizka, srednja ali visoka.
  3. Ob uspešni oddaji se ustvari zahtevek s statusom `OPEN`, prijaviteljem, ki je trenutno prijavljen, in časom nastanka.
  4. Po oddaji se uporabniku prikaže številka novega zahtevka in povezava do njegovih podrobnosti.

## US-02 – Samodejno določanje prioritete (MVP)

- **Povezana funkcionalnost:** 2 – Samodejno določanje prioritete
- **Uporabniška vloga:** Zaposleni
- **Uporabniška zgodba:** Kot **zaposleni** želim **da sistem ob oddaji določi prioriteto iz vpliva in nujnosti**, da **se resnejše težave ustrezno razvrstijo za obravnavo**.
- **Acceptance criteria:**
  1. Sistem pri ustvarjanju zahtevka izračuna prioriteto po vnaprej določeni preslikavi kombinacij vpliva in nujnosti.
  2. Kombinacija **visok vpliv + visoka nujnost** vrne prioriteto `CRITICAL` (kritična).
  3. Kombinacija **nizek vpliv + nizka nujnost** vrne prioriteto `LOW` (nizka).
  4. Vsaka od devetih kombinacij treh stopenj vpliva in nujnosti ima natanko eno določeno prioriteto iz množice `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`; rezultat se shrani pri zahtevku.
  5. Zaposleni prioritete ne more ročno nastaviti ali spremeniti prek obrazca oziroma API-ja.


## US-03 – Dodeljevanje zahtevkov tehnikom (MVP)

- **Povezana funkcionalnost:** 3 – Dodeljevanje zahtevkov IT tehnikom
- **Uporabniška vloga:** IT administrator
- **Uporabniška zgodba:** Kot **IT administrator** želim **nedodeljen zahtevek dodeliti izbranemu tehniku**, da **je jasno, kdo je odgovoren za njegovo obravnavo**.
- **Acceptance criteria:**
  1. Administrator lahko na seznamu loči nedodeljene zahtevke od dodeljenih.
  2. Pri dodeljevanju sistem ponudi samo aktivne uporabnike z vlogo `TECHNICIAN`.
  3. Po potrditvi se v `assigned_to` shrani izbrani tehnik in njegovo ime se izpiše v podrobnostih zahtevka.
  4. Dodeljeni zahtevek postane viden v seznamu zahtevkov izbranega tehnika.
  5. Zaposleni ali tehnik ne moreta spremeniti dodelitve; poskus prek API-ja vrne odgovor o zavrnjenem dostopu.

## US-04 – Obravnava zahtevka po postopku (MVP)

- **Povezana funkcionalnost:** 4 – Obravnava zahtevka po določenem postopku
- **Uporabniška vloga:** IT tehnik in zaposleni
- **Uporabniška zgodba:** Kot **IT tehnik** želim **obravnavati dodeljen zahtevek in zapisati rešitev**, da **lahko zaposleni preveri odpravo težave in zaključi postopek**.
- **Acceptance criteria:**
  1. Samo dodeljeni tehnik lahko zahtevek prestavi iz `OPEN` v `IN_PROGRESS`.
  2. Za prehod iz `IN_PROGRESS` v `RESOLVED` mora tehnik vnesti neprazen opis rešitve; sistem shrani tudi čas rešitve.
  3. Samo zaposleni, ki je zahtevek prijavil, lahko svoj zahtevek iz `RESOLVED` prestavi v `CLOSED`; sistem shrani čas zaprtja.
  4. Poskusi preskoka stanja, npr. `OPEN` → `CLOSED`, so zavrnjeni z razumljivim sporočilom.
  5. Trenutno stanje je vidno na seznamu in v podrobnostih zahtevka.

## US-05 – Komunikacija pri zahtevku (MVP)

- **Povezana funkcionalnost:** 5 – Komunikacija pri zahtevku
- **Uporabniška vloga:** Zaposleni in IT tehnik
- **Uporabniška zgodba:** Kot **zaposleni** želim **izmenjevati sporočila z dodeljenim tehnikom znotraj zahtevka**, da **lahko pojasnim težavo brez ločenih komunikacijskih kanalov**.
- **Acceptance criteria:**
  1. Komentar pri zahtevku lahko objavita njegov prijavitelj in trenutno dodeljeni tehnik.
  2. Prazen komentar ali komentar, ki vsebuje samo presledke, se ne shrani.
  3. Vsak shranjen komentar vsebuje vsebino, avtorja, čas objave in povezavo do zahtevka.
  4. Komentarji se prikažejo kronološko od najstarejšega do najnovejšega.
  5. Uporabnik brez dostopa do zahtevka ne more brati njegovih komentarjev ali dodati novega.

## US-06 – Pregled in filtriranje zahtevkov (MVP)

- **Povezana funkcionalnost:** 6 – Pregled in filtriranje zahtevkov glede na vlogo
- **Uporabniška vloga:** Zaposleni, IT tehnik in IT administrator
- **Uporabniška zgodba:** Kot **uporabnik FixDesk** želim **videti samo zahtevke, do katerih imam pravico, in jih filtrirati po stanju ter prioriteti**, da **hitreje najdem tiste, ki me zanimajo**.
- **Acceptance criteria:**
  1. Zaposleni vidi le zahtevke, kjer je `created_by` enak njegovemu ID-ju.
  2. Tehnik vidi le zahtevke, kjer je `assigned_to` enak njegovemu ID-ju, administrator pa vidi vse zahtevke.
  3. Filter po stanju prikazuje samo zahtevke iz izbranega stanja, filter po prioriteti pa samo izbrane prioritete.
  4. Ob sočasni uporabi obeh filtrov morajo zahtevki ustrezati **obema** pogojema.
  5. Če noben zahtevek ne ustreza filtrom, se prikaže sporočilo »Ni zahtevkov za izbrane filtre« in možnost ponastavitve filtrov.

## US-07 – Razvrščanje po kategorijah

- **Povezana funkcionalnost:** 7 – Razvrščanje zahtevkov po kategorijah
- **Uporabniška vloga:** Zaposleni
- **Uporabniška zgodba:** Kot **zaposleni** želim **izbrati kategorijo IT težave**, da **lahko podpori jasno sporočim, katerega področja se težava nanaša**.
- **Acceptance criteria:**
  1. Ob oddaji zahtevka je na voljo izbirnik kategorij iz tabele `categories`.
  2. Uporabnik mora pred oddajo izbrati eno obstoječo kategorijo.
  3. Izbrana kategorija se shrani v `category_id` in se prikaže v podrobnostih zahtevka.
  4. Neobstoječi ID kategorije se pri oddaji prek API-ja zavrne.

## US-08 – Iskanje zahtevkov

- **Povezana funkcionalnost:** 8 – Iskanje zahtevkov
- **Uporabniška vloga:** IT administrator
- **Uporabniška zgodba:** Kot **IT administrator** želim **iskati zahtevke po številki, naslovu ali besedilu opisa**, da **hitro najdem prijavo, ki jo moram obravnavati**.
- **Acceptance criteria:**
  1. Vnos veljavne številke zahtevka omogoča iskanje po njegovem ID-ju.
  2. Besedilna poizvedba išče neobčutljivo na velike in male črke po naslovu in opisu zahtevka.
  3. Rezultati vsebujejo samo zahtevke, do katerih ima prijavljeni uporabnik dostop.
  4. Če zadetkov ni, sistem prikaže sporočilo »Ni najdenih zahtevkov«.

## US-09 – Zgodovina sprememb

- **Povezana funkcionalnost:** 9 – Zgodovina sprememb zahtevka
- **Uporabniška vloga:** IT administrator
- **Uporabniška zgodba:** Kot **IT administrator** želim **videti zgodovino sprememb stanja, dodelitve in prioritete**, da **lahko preverim potek obravnave zahtevka**.
- **Acceptance criteria:**
  1. Ob vsaki spremembi stanja ali dodelitve sistem ustvari zapis v `ticket_history`.
  2. Če se prioriteta spremeni po sistemskih pravilih ali dovoljenem administratorskem postopku, se zabeleži tudi ta sprememba.
  3. Zapis vsebuje polje, staro vrednost, novo vrednost, čas spremembe in ID izvajalca.
  4. Administrator vidi zapise določenega zahtevka razvrščene od najnovejšega do najstarejšega.
  5. Običajni uporabniki zgodovine ne morejo spreminjati ali brisati.

## US-10 – Pregled obremenjenosti tehnikov

- **Povezana funkcionalnost:** 10 – Pregled obremenjenosti tehnikov
- **Uporabniška vloga:** IT administrator
- **Uporabniška zgodba:** Kot **IT administrator** želim **videti število nedokončanih zahtevkov za vsakega tehnika**, da **lahko naloge razporejam glede na obremenjenost**.
- **Acceptance criteria:**
  1. Za vsakega aktivnega tehnika je prikazano število njegovih dodeljenih zahtevkov v stanju `OPEN` in `IN_PROGRESS`.
  2. Število ne vključuje zahtevkov v stanju `RESOLVED` ali `CLOSED`.
  3. Ob spremembi dodelitve ali stanja se vrednosti po osvežitvi prikaza ustrezno posodobijo.
  4. Stran je dostopna samo administratorju.

## US-11 – Obvestila znotraj aplikacije

- **Povezana funkcionalnost:** 11 – Obvestila znotraj aplikacije
- **Uporabniška vloga:** Zaposleni
- **Uporabniška zgodba:** Kot **zaposleni** želim **prejeti obvestilo v aplikaciji, ko je moj zahtevek dodeljen ali rešen**, da **sem obveščen o napredku brez stalnega preverjanja seznama**.
- **Acceptance criteria:**
  1. Ob dodelitvi zahtevka sistem ustvari obvestilo za prijavitelja.
  2. Ob prehodu njegovega zahtevka v `RESOLVED` sistem ustvari obvestilo za prijavitelja.
  3. Obvestilo vsebuje številko zahtevka, vrsto dogodka in čas dogodka ter povezavo na zahtevek.
  4. Uporabnik vidi samo svoja obvestila; po odprtju jih lahko označi kot prebrana.

> **Podatkovni model:** Za implementacijo te funkcionalnosti bo treba prvotni model razširiti z entiteto `notifications` (prejemnik, zahtevek, tip, čas, prebrano).

## US-12 – E-poštno obveščanje prek zunanje storitve

- **Povezana funkcionalnost:** 12 – Obveščanje prek zunanje storitve
- **Uporabniška vloga:** Zaposleni in IT tehnik
- **Uporabniška zgodba:** Kot **IT tehnik** želim **prejeti e-poštno obvestilo, ko zaposleni napiše nov komentar pri mojem dodeljenem zahtevku**, da **lahko pravočasno odgovorim**.
- **Acceptance criteria:**
  1. Ob komentarju zaposlenega sistem poskusi poslati e-pošto trenutno dodeljenemu tehniku.
  2. Ob komentarju tehnika sistem poskusi poslati e-pošto prijavitelju zahtevka.
  3. Sporočilo vsebuje številko in naslov zahtevka ter povezavo do njegovih podrobnosti, ne pa gesel ali avtentikacijskih žetonov.
  4. Avtor komentarja ne prejme obvestila o svojem lastnem komentarju.
  5. Če zunanja storitev ni dosegljiva, že objavljeni komentar ostane shranjen, napaka pri pošiljanju pa se zabeleži na strežniku.

> **Tehnična opomba:** Zunanji ponudnik (npr. Resend ali SendGrid) je konfiguriran na backendu z okoljskimi spremenljivkami. Ta funkcionalnost je **izven MVP**, skladno s prvo nalogo.

## US-13 – Poročila o IT podpori

- **Povezana funkcionalnost:** 13 – Poročila o IT podpori
- **Uporabniška vloga:** IT administrator
- **Uporabniška zgodba:** Kot **IT administrator** želim **pregledati statistiko zahtevkov po kategoriji, prioriteti in stanju**, da **lažje prepoznam pogoste težave in obremenitve podpore**.
- **Acceptance criteria:**
  1. Poročilo prikazuje skupno število zahtevkov ter razčlenitev po kategorijah, prioritetah in stanjih.
  2. Vsak zahtevek se v posamezni razčlenitvi šteje natanko enkrat.
  3. Poročilo vključuje povprečen čas od `created_at` do `resolved_at` za rešene zahtevke; nerešeni zahtevki ne vplivajo na povprečje.
  4. Če ni relevantnih podatkov, sistem prikaže ničelna števila oziroma oznako »Ni podatkov« za povprečni čas.
  5. Poročilo je dostopno samo administratorju.

## US-14 – Upravljanje uporabnikov in kategorij

- **Povezana funkcionalnost:** 14 – Upravljanje uporabnikov in kategorij
- **Uporabniška vloga:** IT administrator
- **Uporabniška zgodba:** Kot **IT administrator** želim **upravljati račune, vloge in kategorije težav**, da **imajo uporabniki ustrezne pravice in lahko prijave pravilno razvrstijo**.
- **Acceptance criteria:**
  1. Administrator lahko obstoječemu uporabniku nastavi eno od vlog `EMPLOYEE`, `TECHNICIAN` ali `ADMIN`.
  2. Administrator lahko račun deaktivira; deaktiviran uporabnik se ne more več uspešno prijaviti.
  3. Administrator lahko doda kategorijo z enoličnim imenom; poskus vnosa že obstoječega imena se zavrne.
  4. Administrator lahko preimenuje obstoječo kategorijo, sprememba pa je vidna pri vseh povezanih zahtevkih.
  5. Spremembe uporabnikov in kategorij so zavrnjene, če jih poskuša izvesti zaposleni ali tehnik.

## US-15 – Prijava v sistem

- **Povezana funkcionalnost:** Prijava in preverjanje pravic (izrecno navedeno pod seznamom funkcionalnosti prve naloge)
- **Uporabniška vloga:** Zaposleni, IT tehnik in IT administrator
- **Uporabniška zgodba:** Kot **registriran uporabnik** želim **se prijaviti z e-pošto in geslom**, da **lahko varno dostopam do zahtevkov in dejanj, ki pripadajo moji vlogi**.
- **Acceptance criteria:**
  1. Prijava zahteva veljaven e-poštni naslov in neprazno geslo.
  2. Pri pravilnih podatkih aktivnega uporabnika backend izda JWT v piškotku `HttpOnly` z atributom `SameSite=Lax`.
  3. Pri napačnem geslu, neobstoječem ali neaktivnem računu se prijava zavrne brez razkritja, kateri podatek je napačen.
  4. Neprijavljen uporabnik ne more odpreti zaščitenih API končnih točk.
  5. Ob odjavi se prijavni piškotek razveljavi in uporabnik ne more več uporabljati zaščitenih funkcij brez ponovne prijave.