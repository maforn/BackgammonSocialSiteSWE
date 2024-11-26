export class Tournament {
    owner: string;
    participants: string[];
    open: boolean;
    name: string;
    status: string;
    match_ids: string[][];

    constructor(
        owner: string,
        participants: string[],
        open: boolean,
        name: string,
        status: string,
        match_ids: string[][]
    ){
        this.owner = owner;
        this.participants = participants;
        this.open = open;
        this.name = name;
        this.status = status;
        this.match_ids = match_ids;
    }
};