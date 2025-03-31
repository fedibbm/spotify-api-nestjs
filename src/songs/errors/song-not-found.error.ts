export class SongNotFoundError extends Error{
    constructor(message? : string){
        super(message || "song not found");
        this.name = "SongNotFoundError";
    }
}