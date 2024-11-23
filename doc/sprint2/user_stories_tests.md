1 esempio di test per ogni user story:
---

#22 Da utente che sta giocando una partita, vorrei vedere un messaggio di vittoria o sconfitta a fine scontro\
test: 'shows the winner when the game is over' at /client/src/tests/GameView.test.ts

#83 Da utente che sta giocando una partita, quando ho portato tutte le mie pedine nella base vorrei poter tirarle fuori dalla board in base ai numeri che mi escono dal lancio\
test: 'should allow moving pieces to the bear-off area if all pieces are in base' at /client/src/tests/gameService.test.ts

#67 Da utente che sta giocando una partita, quando al lancio del dado ottengo un doppio, vorrei poter muovere le mie pedine di quel numero 4 volte\
test: 'test_throw_dice' at /server/tests/test_game.py

#82 Da utente che sta per iniziare a giocare una partita, vorrei lanciare un dado: il giocatore che ottiene il numero maggiore farà la prima mossa (se i due numeri sono uguali il lancio si ripete)\
test: 'test_throw_start_dice' at /server/tests/test_game.py

#71 Da utente che sta giocando una partita, se i numeri del lancio dei dadi non mi permettono di muovere alcuna pedina allora il mio turno sarà terminato\
test: 'should return null if no valid moves are available' at /client/src/tests/gameService.test.ts

#23 Da utente che sta giocando una partita, vorrei poter commentare durante la partita\
test: 'should send preformed message on button click' at /client/src/tests/GameView.test.ts

#107 Da utente che sta giocando una partita, vorrei vedere lo stato di avanzamento della partita\
test: 'test_round_progression' at /server/tests/test_game.py

#7 Da utente che ha scelto le impostazioni per una partita contro l'AI, vorrei poter iniziare la partita e giocare contro l'AI\
test: 'test_move_ai' at /server/tests/test_game.py

#79 Da utente, vorrei poter scegliere le impostazioni 'numero di scontri per decretare la vittoria' e 'difficoltà', per giocare contro l'AI\
test: 'changes difficulty and rounds_to_win values' at /client/src/tests/PlayAiView.test.ts

#80 Da utente che vuole mandare l'invito ad una partita ad un'altra persona online, vorrei poter scegliere il numero di scontri necessari per determinare l'esito della partita\
test: 'displays the input to select the number of rounds to win' at client/src/tests/PlayHumanView.test.ts

#13 Da utente, vorrei che il mio rating fosse aggiornato alla fine di ogni partita in base al risultato\
test: 'test_new_ratings_after_match_normal_case' at /server/tests/test_rating.py