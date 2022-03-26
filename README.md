# Blurr ![backend_test](https://github.com/KockaAdmiralac/PSI/actions/workflows/backend_test.yml/badge.svg) ![frontend_test](https://github.com/KockaAdmiralac/PSI/actions/workflows/frontend_test.yml/badge.svg) [![Build and deploy to Azure](https://github.com/nikako-ne-propustiti/PSI/actions/workflows/master_blurr.yml/badge.svg)](https://github.com/nikako-ne-propustiti/PSI/actions/workflows/master_blurr.yml)

Projekat iz [Principa softverskog inženjerstva](http://si3psi.etf.bg.ac.rs/) u školskoj 2021/2022 godini od tima Nikako Ne Propustiti:

 - [Aleksa Marković](https://github.com/topofkeks)
 - [Ivan Pešić](https://github.com/ivan-pesic)
 - [Luka Simić](https://github.com/KockaAdmiralac)
 - [Miljan Marković](https://github.com/pigajunior)

**Sajt možete videti uživo na [blurr.social](https://blurr.social)** (barem u prvih godinu dana rađenja projekta, posle toga će da ostane neregistrovan).

Tema projekta je društvena mreža Blurr za postavljanje slika (nalik društvenoj mreži [Instagram](https://instagram.com)) koje se nakon postavljanja automatski zamagljuju i od ostalih korisnika traže šifru kako bi se odmaglile. Više detalja o samom projektu kao i njegovom razvoju može se naći na [vikiju ovog repozitorijuma](https://github.com/nikako-ne-propustiti/blurr/wiki). Detaljnije o napretku može se naći u [Projects](https://github.com/orgs/nikako-ne-propustiti/projects/2) tabu.

Šablon za ovaj projekat je uzet [odavde](https://github.com/ohbarye/rails-react-typescript-docker-example).

# Razvoj

```bash
# Kloniranje repozitorijuma sa izvornim kodom.
$ git clone https://github.com/nikako-ne-propustiti/blurr.git && cd blurr
# Instaliranje potrebnih paketa za frontend
$ docker-compose run frontend yarn
# Pravljenje baze za backend
$ docker-compose run backend bin/rails db:create db:migrate
# Pokretanje baze, frontend dev servera i backend servera
$ docker-compose up -d
```

Nakon pokretanja, ukoliko radite na frontend možete posetiti [localhost:3000](http://localhost:3000) na kom se pokreće *Webpack* razvojni server, a ukoliko radite na backend možete posetiti [localhost:3001](http://localhost:3001) na kome se pokreće *Ruby on Rails* razvojni server.
