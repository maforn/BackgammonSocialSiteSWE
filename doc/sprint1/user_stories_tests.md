1 esempio di test per ogni user story:
---

#2 Da utente, vorrei potermi registrare al sito se non l'ho già fatto
test: 'should register a user' at /client/src/tests/auth.test.ts

#3 Da utente, vorrei poter accedere al sito se mi sono già registrato
test: 'should login a user' at /client/src/tests/auth.test.ts

#18 Da utente che sta giocando una partita , vorrei vedere la board e le pedine per giocare
test: 'test_custom_board_configuration' at /server/tests/test_board_configuration.py

#20 Da utente che sta giocando una partita, vorrei poter lanciare i dadi in modo da poter poi spostare le mie pedine
test: 'should fetch dice throw result and update diceResult on diceThrow method call' at /client/src/tests/GameView.test.ts

#17 Da utente che sta giocando una partita, vorrei poter muovere le mie pedine su una punta non occupata
test: 'test_move_piece' at /server/tests/test_game.py

#19 Da utente che sta giocando una partita, vorrei poter mangiare una pedina avversaria con la mia pedina
test: 'test_move_piece' at /server/tests/test_game.py

#21 Da utente che sta giocando una partita, vorrei poter spostare la mia pedina su una pila di altre mie pedine
test: 'test_move_piece' at /server/tests/test_game.py

#22 Da utente che sta giocando una partita, vorrei vedere un messaggio di vittoria o sconfitta a fine partita

#6 Da utente, vorrei poter invitare un'altra persona online ad una partita
test: 'test_create_invite_endpoint' at /server/tests/test_invites.py

#12 Da utente, vorrei poter accettare l'invito ad una partita contro un'altra persona online per iniziare la partita
test: 'test_receive_invite_endpoint' at /server/tests/test_invites.py

#29 Da utente, vorrei che quando l'utente invitato ad una partita accetti, la partita inizi
test: 'test_accept_invite_endpoint' at /server/tests/test_invites.py 