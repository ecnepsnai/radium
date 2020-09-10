import { API } from "../services/API";
import { Modal } from "../components/Modal";
import { Notification } from "../components/Notification";

export class Widget {
    ID: string;
    Name: string;
    Type: string;

    constructor(json: any) {
        this.ID = json.ID as string;
        this.Name = json.Name as string;
        this.Type = json.Type as string;
    }


    /**
     * Return a blank widget
     */
    public static Blank(): Widget {
        return new Widget({
            Name: '',
            Type: 'doodad',
        });
    }

    /**
     * Create a new Widget
     */
    public static async New(parameters: NewWidgetParameters): Promise<Widget> {
        const data = await API.PUT('/api/widgets/widget', parameters);
        return new Widget(data);
    }

    /**
     * Save this widget
     */
    public async Save(): Promise<Widget> {
        const data = await API.POST('/api/widgets/widget/' + this.ID, this as EditWidgetParameters);
        return new Widget(data);
    }

    /**
     * Delete this widget
     */
    public async Delete(): Promise<any> {
        return await API.DELETE('/api/widgets/widget/' + this.ID);
    }

    /**
     * Show a modal to delete this widget
     */
    public async DeleteModal(): Promise<boolean> {
        return new Promise(resolve => {
            Modal.delete('Delete Widget?', 'Are you sure you want to delete this widget? This can not be undone.').then(confirmed => {
                if (!confirmed) {
                    resolve(false);
                    return;
                }

                API.DELETE('/api/widgets/widget/' + this.ID).then(() => {
                    Notification.success('Widget Deleted');
                    resolve(true);
                });
            });
        });
    }

    /**
     * Get the specified widget by its id
     */
    public static async Get(id: string): Promise<Widget> {
        const data = await API.GET('/api/widgets/widget/' + id);
        return new Widget(data);
    }

    /**
     * List all widgets
     */
    public static async List(): Promise<Widget[]> {
        const data = await API.GET('/api/widgets');
        return (data as any[]).map(obj => {
            return new Widget(obj);
        });
    }
}

export interface NewWidgetParameters {
    Name: string;
    Type: string;
}

export interface EditWidgetParameters {
    Name: string;
    Type: string;
}
