import { Options } from "./Options";
import { User } from "./User";

export class State {
    public readonly User: User;
    public readonly Runtime: Runtime;
    public readonly StartDate: string;
    public readonly Hostname: string;
    public readonly Version: string;
    public readonly Options: Options.radiumOptions;
    public readonly Enums: {[key: string]: {[key: string]: string;};};

    public constructor(json: any) {
        this.User = new User(json.User);
        this.Runtime = json.Runtime as Runtime;
        this.StartDate = json.StartDate as string;
        this.Hostname = json.Hostname as string;
        this.Version = json.Version as string;
        this.Options = json.Options as Options.radiumOptions;
        this.Enums = json.Enums as {[key: string]: {[key: string]: string;};};
    }
}

interface Runtime {
    ServerFQDN: string;
    Version: string;
    Config: string;
}
