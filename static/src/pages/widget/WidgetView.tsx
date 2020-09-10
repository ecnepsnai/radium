import * as React from 'react';

import { Page } from '../../components/Page';
import { Widget } from '../../types/Widget';
import { Buttons, EditButton, DeleteButton } from '../../components/Button';
import { match } from 'react-router-dom';
import { Card } from '../../components/Card';
import { ListGroup } from '../../components/ListGroup';
import { Layout } from '../../components/Layout';
import { PageLoading } from '../../components/Loading';
import { Redirect } from '../../components/Redirect';
import { URLParams } from '../../services/Params';

export interface WidgetViewProps { match: match }
interface WidgetViewState { loading: boolean, widget?: Widget }

export class WidgetView extends React.Component<WidgetViewProps, WidgetViewState> {
    constructor(props: WidgetViewProps) {
        super(props);
        this.state = { loading: true };
    }

    componentDidMount(): void {
        this.loadWidget();
    }

    loadWidget(): void {
        const id = (this.props.match.params as URLParams).id;
        Widget.Get(id).then(widget => {
            this.setState({ loading: false, widget: widget });
        });
    }

    private deleteClick = () => {
        this.state.widget.DeleteModal().then(confirmed => {
            if (confirmed) {
                Redirect.To('/widgets');
            }
        });
    }

    render(): JSX.Element {
        if (this.state.widget == null) { return ( <PageLoading /> ); }

        return (
            <Page title="View Widget">
                <Buttons>
                    <EditButton to={'/widgets/widget/' + this.state.widget.ID + '/edit'} />
                    <DeleteButton onClick={this.deleteClick} />
                </Buttons>
                <Layout.Row>
                    <Layout.Column>
                        <Card.Card>
                            <Card.Header>Widget Details</Card.Header>
                            <ListGroup.List>
                                <ListGroup.TextItem title="Name">{ this.state.widget.Name }</ListGroup.TextItem>
                                <ListGroup.TextItem title="Type">{ this.state.widget.Type }</ListGroup.TextItem>
                            </ListGroup.List>
                        </Card.Card>
                    </Layout.Column>
                </Layout.Row>
            </Page>
        );
    }
}
