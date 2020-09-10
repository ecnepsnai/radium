import * as React from 'react';
import { Page } from '../../components/Page';
import { Widget } from '../../types/Widget';
import { match } from 'react-router-dom';
import { Form, Input, Select } from '../../components/Form';
import { Notification } from '../../components/Notification';
import { PageLoading } from '../../components/Loading';
import { URLParams } from '../../services/Params';
import { Redirect } from '../../components/Redirect';
import { StateManager } from '../../services/StateManager';

export interface WidgetEditProps { match: match }
interface WidgetEditState { loading: boolean, widget: Widget, isNew: boolean }

export class WidgetEdit extends React.Component<WidgetEditProps, WidgetEditState> {
    constructor(props: WidgetEditProps) {
        super(props);
        this.state = { loading: true, widget: null, isNew: false };
    }
    componentDidMount(): void {
        this.loadWidget();
    }
    loadWidget(): void {
        const id = (this.props.match.params as URLParams).id;
        if (id == null) {
            this.setState({ isNew: true, widget: Widget.Blank(), loading: false });
        } else {
            Widget.Get(id).then(widget => {
                this.setState({ loading: false, widget: widget });
            });
        }
    }
    private formSave = () => {
        if (this.state.isNew) {
            Widget.New(this.state.widget).then(widget => {
                Notification.success('Widget Saved');
                Redirect.To('/widgets/widget/' + widget.ID);
            });
        } else {
            this.state.widget.Save().then(widget => {
                Notification.success('Widget Saved');
                Redirect.To('/widgets/widget/' + widget.ID);
            });
        }
    }

    private changeName = (Name: string) => {
        const widget = this.state.widget;
        widget.Name = Name;
        this.setState({ widget: widget });
    }

    private changeType = (Type: string) => {
        const widget = this.state.widget;
        widget.Type = Type;
        this.setState({ widget: widget });
    }

    render(): JSX.Element {
        if (this.state.loading) {
            return ( <PageLoading /> );
        }

        return (
        <Page title={ this.state.isNew ? 'New Widget' : 'Edit Widget' }>
            <Form showSaveButton onSubmit={this.formSave}>
                <Input
                    label="Name"
                    type="text"
                    placeholder="handsome_devil"
                    onChange={this.changeName}
                    defaultValue={this.state.widget.Name}
                    required
                />
                <Select
                    label="Type"
                    onChange={this.changeType}
                    defaultValue={this.state.widget.Type}
                    required>
                    { Object.keys(StateManager.Current().Enums['WidgetType']).map((key, idx) => {
                        return (<option value={StateManager.Current().Enums['WidgetType'][key]} key={idx}>{key}</option>);
                    })}
                </Select>
            </Form>
        </Page>
        );
    }
}