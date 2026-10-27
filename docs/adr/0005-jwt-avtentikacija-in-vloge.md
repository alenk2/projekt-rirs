# JWT, varna gesla in strežniško preverjanje vlog

## Kontekst in problem

FixDesk razlikuje zaposlene, tehnike in administratorje. Zaščitene operacije morajo preveriti identiteto in dovoljenja, ne glede na prikaz v uporabniškem vmesniku.

## Obravnavane alternative

- **JWT v HttpOnly piškotku + bcrypt + preverjanje vlog na backendu:** Žeton za API in strežniško uveljavljanje pravic.
- **Strežniške seje s sejno shrambo:** Enostavnejši preklic seje, vendar zahteva hranjenje stanja sej.
- **JWT v localStorage:** Preprost odjemalski dostop, vendar je žeton dosegljiv JavaScriptu ob XSS.

## Sprejeta odločitev

Izbrana možnost: **JWT v HttpOnly piškotku, bcrypt in strežniško preverjanje vlog**, ker HttpOnly omeji dostop skript do žetona, backend lahko za vsako operacijo preveri vlogo, bcrypt pa ščiti shranjena gesla.

### Posledice

- **Pozitivno:** Backend preverja pravice uporabnikov in preprečuje nepooblaščena dejanja, tudi če uporabnik pošlje zahtevo neposredno na API.
- **Pozitivno:** Shranjevanje JWT žetona v HttpOnly piškotek izboljša varnost, saj JavaScript ne more neposredno dostopati do žetona.
- **Negativno:** Potrebna je zaščita pred CSRF pri zahtevah, ki spreminjajo stanje; SameSite=Lax sam po sebi ne reši vseh primerov.
- **Negativno:** Razmisliti je treba o poteku odjave, poteku veljavnosti in morebitnem preklicu žetonov.
