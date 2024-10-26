# Backgammon Social Site

Questo progetto è una web application per giocare a backgammon online, consentendo a due persone o a una persona contro un agente intelligente (bot) di sfidarsi. La piattaforma permette anche di organizzare tornei tra giocatori e include una classifica (leaderboard) aggiornata con i punteggi personali.

## Indice
- [Introduzione](#introduzione)
- [Caratteristiche del Progetto](#caratteristiche-del-progetto)
- [Ruoli del Team](#ruoli-del-team)
- [Modalità di Lavoro](#modalità-di-lavoro)
- [Architettura e Tecnologie](#architettura-e-tecnologie)
- [Istruzioni per l'Installazione](#istruzioni-per-linstallazione)
- [Contributi e Convenzioni](#contributi-e-convenzioni)


## Introduzione
Lo Sprint Zero è stato essenziale per pianificare il progetto, delineare le funzionalità principali, stabilire le basi per la comunicazione e strutturare il backlog delle user stories, necessario per procedere con gli sprint di sviluppo.

## Caratteristiche del Progetto
- **Gioco Online**: Gioca a backgammon online contro altri utenti o contro un agente intelligente.
- **Tornei**: Organizza e partecipa a tornei fino a quattro giocatori.
- **Leaderboard**: Classifica aggiornata basata sui rating personali.
- **Interfaccia Utente**: UI semplice e intuitiva, progettata per un'esperienza di gioco ottimale.
- **Comunicazione**: Notifiche e messaggistica per tornei e sfide.

## Ruoli del Team
- Scrum Master: Cristian Orsi
- Product Owner: Enis Brajevic
- Developer 1: Matteo Fornaini
- Developer 2: Mattia Ferrarini
- Developer 3: Enrico Mazzotti
- Developer 4: Lorenzo Giarrusso

## Modalità di Lavoro
Il team lavora cinque giorni a settimana, con orari flessibili per ogni membro. La comunicazione avviene su Mattermost per i messaggi e su Microsoft Teams per le videochiamate, mentre il linguaggio principale per codice e documentazione tecnica è l'inglese.

## Architettura e Tecnologie
Il progetto è suddiviso in tre principali componenti:
- **Frontend**: Sviluppato in Vue.js.
- **Backend**: Sviluppato in Python .
- **Database**: Gestione dati per utenti, tornei e classifiche.

### Docker
Per la gestione dei container, il progetto utilizza un Dockerfile con multi-stage build:
- **Stage Frontend**: Costruisce l'app Vue per generare i file statici.
- **Stage Backend**: Configura e avvia l'applicazione Python, che serve i file statici del frontend e gestisce le API.

## Istruzioni per l'Installazione

1. Clona il repository:
   ```bash
   git clone https://aminsep.disi.unibo.it/gitlab/swe-team-3/backgammon-social-site.git
   cd backgammon-social-site
   ```

2. Crea e avvia i container Docker:
   ```bash
   docker-compose up --build
   ```

3. Accedi all'app: L'app sarà disponibile su `http://localhost:8080`.

## Contributi e Convenzioni

- **Lingua**: Inglese per codice.
- **Versioning**:
  - Workflow di branching: usa prefissi (`feature/`, `bugfix/`, `docs/`).
  - Nome branch: minuscolo, separato da `-` (e.g. `feature/game-board`).
  - Nome commit: in forma imperativa (e.g. `Add login endpoint`).
  - Merge su main: previa revisione positiva di un altro membro del team.