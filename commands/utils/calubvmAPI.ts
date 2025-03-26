// calub vm API wrapper

export enum UserRank {
    UNREGISTERED = 0,
    USER = 1,
    ADMINISTRATOR = 2,
    MODERATOR = 3
}

export class CollabVMAPIErr extends Error {
    constructor (msg : string, public HTTPStatus : number) {
        super(msg);
        Object.setPrototypeOf(this, CollabVMAPIErr.prototype);
    }
}

export interface CollabVMUser {
    username : string;
    rank : UserRank;
}

export interface voteInfoData {
    Yes : number; // ppl that voted for yes
    No : number; // ppl that voted for no
    Time: number; // time remaining (ms)
}
 
export interface VMInfo {
    id : string;
    users : Array<CollabVMUser>;
    turnQueue : Array<CollabVMUser>;
    voteInfo : voteInfoData;
}

export interface ChatLogEntry {
    username : string;
    message : string;
    timestamp : string;
    vm : string;
}

// its more of a glorified namespace than anything smh
export class CollabVMAPI {
    constructor() {
    }

    // Gets list of all online VMs
    public static async getVMList() : Promise<string[] | null> {
        const payload = await fetch("https://cvmapi.elijahr.dev/api/v1/list", {method: "GET", signal: AbortSignal.timeout(30000)});
        if (payload.status != 200) {
            throw new CollabVMAPIErr("Request failed", payload.status);
        }
        // @ts-ignore
        const data : { [key: string]: any } = await payload.json();
        var array : string[] = [];
        for (const key in data) {
            array.push(data[key]);
        }
        return array;
    }

    // Gets VM data of the specified vm.
    public static async getVMData(vmNodeID : string) : Promise<VMInfo | null>  {
        const payload = await fetch("https://cvmapi.elijahr.dev/api/v1/vminfo/"+vmNodeID, {method: "GET", signal: AbortSignal.timeout(30000),})
        if (payload.status != 200) {
            throw new CollabVMAPIErr("Request failed", payload.status);
        }
        //@ts-ignore
        const inf : VMInfo = await payload.json();
        return inf;
    }

    // Returns chatlogs with the specified query arguments. If none provided, returns last 10 logged messages
    public static async getChatData(vmNodeID : string = "", 
                                    msgAmount : number = 10, 
                                    random : boolean = false, 
                                    username : string = "", 
                                    ) : Promise<Array<ChatLogEntry> | null> {
        
        var url : string = `https://cvmapi.elijahr.dev/api/v1/chatlogs?count=${msgAmount}&random=${random}`
        // using ifs here feels a little bit scuffed
        if (vmNodeID != "") {
            url += `&vm=${vmNodeID}`
        }
        if (username != "") {
            url += `&username=${username}`
        }
        const resp = await fetch(url, {method: "GET", signal: AbortSignal.timeout(30000)})
        if (resp.status != 200) {
            throw new CollabVMAPIErr("Request failed", resp.status)
        }
        // @ts-ignore
        const body : Array<ChatLogEntry> = await resp.json();
        return body;
    } 
}