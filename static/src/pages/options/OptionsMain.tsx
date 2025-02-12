import * as React from 'react';
import { Page } from '../../components/Page';
import { Options } from '../../types/Options';
import { StateManager } from '../../services/StateManager';
import { Form } from '../../components/Form';
import { OptionsGeneral } from './OptionsGeneral';
import { OptionsUsers } from './OptionsUsers';
import { Notification } from '../../components/Notification';

export interface OptionsMainProps {}
interface OptionsMainState {
    loading?: boolean,
    options: Options.RadiumOptions,
}
export class OptionsMain extends React.Component<OptionsMainProps, OptionsMainState> {
    constructor(props: OptionsMainProps) {
        super(props);
        this.state = {
            options: StateManager.Current().Options
        };
    }

    private changeGeneral = (value: Options.General) => {
        this.setState(state => {
            const options = state.options;
            options.General = value;
            return { options: options };
        });
    }

    private onSubmit = () => {
        this.setState({ loading: true });
        Options.Options.Save(this.state.options).then(() => {
            StateManager.Refresh().then(() => {
                Notification.success('Options Saved');
                this.setState({ loading: false });
            });
        });
    }

    render(): JSX.Element {
        return (
            <Page title="Options">
                <Form className="cards" showSaveButton onSubmit={this.onSubmit} loading={this.state.loading}>
                    <OptionsGeneral defaultValue={this.state.options.General} onUpdate={this.changeGeneral}/>
                    <OptionsUsers />
                    <div className="mb-2"></div>
                </Form>
            </Page>
        );
    }
}
