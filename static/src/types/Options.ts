import { API } from "../services/API";

export namespace Options {
    export interface RadiumOptions {
        General: General;
    }

    export interface General {
        ServerURL: string;
    }

    export class Options {
        public static async Get(): Promise<RadiumOptions> {
            const results = await API.GET('/api/options');
            return results as RadiumOptions;
        }

        public static async Save(options: RadiumOptions): Promise<RadiumOptions> {
            const results = await API.POST('/api/options', options);
            return results as RadiumOptions;
        }
    }
}
