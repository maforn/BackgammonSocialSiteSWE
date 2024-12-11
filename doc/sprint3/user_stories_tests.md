1 esempio di test per ogni user story:
---

#132 Da utente, vorrei invitare una persona random ad una partita online
test: 'returns a random opponent username' at /client/src/tests/inviteService.test.ts

#169 Da utente che sta giocando una partita, vorrei avere un pulsante per abbandonare la partita e tornare al menù principale
test: 'calls the correct endpoint when confirmQuit is called' at /client/src/tests/GameView.test.ts

#183 Da utente che sta giocando una partita, vorrei poter raddoppiare la posta in gioco tramite il dado del raddoppio per vincere il doppio dei punti con questo scontro
test: 'calls the correct endpoint when proposeDoubling is called' at /client/src/tests/GameView.test.ts

#182 Da utente che sta giocando una partita, vorrei fare gammon o backgammon
test: 'should correctly determine if a gammon condition is met' at /client/src/tests/gameService.test.ts

#103 Da utente che sta giocando una partita, vorrei vedere un messaggio di vittoria o sconfitta a fine partita (insieme di scontri)
test: 'renders correctly' at /client/src/tests/MatchOverView.test.ts

#76 Da utente che sta configurando il suo torneo, vorrei poter decidere il numero di scontri per determinare la vittoria di una partita
test: 'should show create panel on showCreatePanel method call' at /client/src/tests/TournamentView.test.ts

#170 Da utente che sta configurando il suo torneo, vorrei impostare il formato del torneo a 'gironi'
test: 'test_update_tournament_stats' at /server/tests/test_tournaments.py

#74 Da utente che sta configurando il suo torneo, vorrei poter limitare la partecipazione ad un torneo a utenti specifici
test: 'test_add_participant_to_closed_tournament' at /server/tests/test_tournaments.py

#5 Da utente, vorrei poter cambiare la mia password se me la sono scordata 
test: 'should set message on successful password reset' at /client/src/tests/PasswordResetView.test.ts

#10 Da utente, vorrei poter vedere i tornei a me disponibili
test: 'test_available_tournaments' at /server/tests/test_tournaments.py

#11 Da utente, vorrei poter vedere il mio rating su una leaderboard generale
test 'renders correctly with initial data' at /client/src/tests/LeaderboardView.test.ts

#14 Da utente, vorrei poter condividere il risultato della mia partita sul mio account social (e.g. Facebook)
test: 'renders correctly' at /client/src/tests/MatchOverView.test.ts

#28 Da utente, vorrei poter vedere le mie statistiche
test: 'fetches and displays user data correctly' at /client/src/tests/UserStatsView.test.ts

#75 Da utente che sta configurando il suo torneo, vorrei poter rendere la partecipazione al torneo libera per qualsiasi utente
test: 'test_add_participant_to_open_tournament' at /server/tests/test_tournaments.py

#77 Da utente, vorrei poter partecipare ai tornei a me disponibili (che vedo)
test: 'should show join panel on showJoinPanel method call' at /client/src/tests/TournamentView.test.ts

#78 Da utente, vorrei che la leaderboard generale fosse ordinata in base al rating
test 'renders correctly with initial data' at /client/src/tests/LeaderboardView.test.ts

#199 Da utente, vorrei chiedere all'AI un consiglio sulla mossa da fare
test: 'should call the AI suggestions endpoint' at /client/src/tests/gameService.test.ts

#201 Da utente, vorrei che la partita concludesse in mio favore se l'avversario è inattivo
test: 'should call the requestTimeout method' at /client/src/tests/GameView.test.ts