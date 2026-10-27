# REST API in JSON med frontendom in backendom

## Kontekst in problem

Frontend ne sme neposredno dostopati do podatkovne baze; aplikacija potrebuje jasen vmesnik med pogledom in logiko.

## Obravnavane alternative

- **REST API z JSON prek HTTP:** Standardni postopki in statusne kode, neposredno testiranje.
- **GraphQL:** Prilagodljivo izbiranje polj, vendar dodatna kompleksnost.
- **Strežniško upodabljanje strani:** Manj ločenosti med UI in backendom, drugačna organizacija projekta.

## Sprejeta odločitev

Izbrana možnost: **REST API z JSON**, ker je primeren za razmeroma jasne vire (zahtevki, komentarji, uporabniki), omogoča ločen razvoj frontend/backend in preprosto testiranje s Postmanom ali Brunom.

### Posledice

- **Pozitivno:** Jasne meje med komponentami sistema.
- **Pozitivno:** Enostavno preverjanje poti in HTTP statusnih kod.
- **Negativno:** Če spremenimo strukturo podatkov, ki jih pošilja backend, moramo po potrebi prilagoditi tudi frontend.
- **Negativno:** Nekateri pogledi lahko zahtevajo več HTTP zahtev kot pri prilagojenem poizvedovalnem API-ju.
