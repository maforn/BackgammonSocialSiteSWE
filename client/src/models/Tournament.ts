class TournamentStats {
    username: string;
    wins: number;
    losses: number;
    matches: number;
    points: number;
    constructor(username: string, wins: number, losses: number, matches: number, points: number){
        this.username = username;
        this.wins = wins;
        this.losses = losses;
        this.matches = matches;
        this.points = points;
    }
}

export class Tournament {
    owner: string;
    participants: string[];
    confirmed_participants: string[];
    open: boolean;
    name: string;
    type: string;
    status: string;
    match_ids: string[];
    rounds_to_win: number;
    stats: TournamentStats[];

    constructor(
        owner: string,
        participants: string[],
        open: boolean,
        name: string,
        type: string,
        status: string,
        match_ids: string[],
        rounds_to_win: number
    ){
        this.owner = owner;
        this.participants = participants;
        this.confirmed_participants = [];
        this.open = open;
        this.name = name;
        this.type = type;
        this.status = status;
        this.match_ids = match_ids;
        this.rounds_to_win = rounds_to_win;
        this.stats = [];
    }
};