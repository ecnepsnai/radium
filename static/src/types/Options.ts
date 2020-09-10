import { API } from "../services/API";

export namespace Options {
    export interface radiumOptions {
        General: General;
    }

    export interface General {
        ServerURL: string;
    }

    export class Options {
        public static async Get(): Promise<radiumOptions> {
            const results = await API.GET('/api/options');
            return results as radiumOptions;
        }

        public static async Save(options: radiumOptions): Promise<radiumOptions> {
            const results = await API.POST('/api/options', options);
            return results as radiumOptions;
        }
    }
}
