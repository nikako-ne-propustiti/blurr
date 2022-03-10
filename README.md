# PSI projekat ![backend_test](https://github.com/KockaAdmiralac/PSI/actions/workflows/backend_test.yml/badge.svg) ![frontend_test](https://github.com/KockaAdmiralac/PSI/actions/workflows/frontend_test.yml/badge.svg) [![Build and deploy to Azure](https://github.com/nikako-ne-propustiti/PSI/actions/workflows/master_blurr.yml/badge.svg)](https://github.com/nikako-ne-propustiti/PSI/actions/workflows/master_blurr.yml)

Projekat iz [Principa softverskog inženjerstva](http://si3psi.etf.rs/) u školskoj 2021/2022 godini od tima Nikako Ne Propustiti:

 - [Aleksa Marković](https://github.com/topofkeks)
 - [Ivan Pešić](https://github.com/ivan-pesic)
 - [Luka Simić](https://github.com/KockaAdmiralac)
 - [Miljan Marković](https://github.com/pigajunior)

Šablon za ovaj projekat je uzet [odavde](github.com/ohbarye/rails-react-typescript-docker-example).

# Korišćenje

```bash
$ git clone https://github.com/KockaAdmiralac/PSI.git && cd PSI

# Setup
$ docker-compose run frontend yarn
$ docker-compose run backend bin/rails db:create db:migrate

# Start
$ docker-compose up -d

# Open frontend
$ open http://localhost:80

# Check backend API
$ curl -H 'Host: backend.localhost' http://localhost/greetings/hello
```

