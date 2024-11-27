export class Tournament {
    owner: string;
    participants: string[];
    open: boolean;
    name: string;
    status: string;
    match_ids: string[][];
    rounds_to_win: number;

    constructor(
        owner: string,
        participants: string[],
        open: boolean,
        name: string,
        status: string,
        match_ids: string[][],
        rounds_to_win: number
    ){
        this.owner = owner;
        this.participants = participants;
        this.open = open;
        this.name = name;
        this.status = status;
        this.match_ids = match_ids;
        this.rounds_to_win = rounds_to_win;
    }
};