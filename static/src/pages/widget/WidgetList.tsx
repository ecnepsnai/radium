import * as React from 'react';
import { Widget } from '../../types/Widget';
import { PageLoading } from '../../components/Loading';
import { Page } from '../../components/Page';
import { Buttons, CreateButton } from '../../components/Button';
import { Table } from '../../components/Table';
import { WidgetListItem } from './WidgetListItem';

export interface WidgetListProps {}
interface WidgetListState {
    loading: boolean;
    widgets: Widget[];
}
export class WidgetList extends React.Component<WidgetListProps, WidgetListState> {
    constructor(props: WidgetListProps) {
        super(props);
        this.state = {
            loading: true,
            widgets: [],
        };
    }

    componentDidMount(): void {
        this.loadData();
    }

    private loadWidgets = () => {
        return Widget.List().then(widgets => {
            this.setState({
                widgets: widgets,
            });
        });
    }

    private loadData = () => {
        this.loadWidgets().then(() => {
            this.setState({ loading: false });
        });
    }

    render(): JSX.Element {
        if (this.state.loading) { return ( <PageLoading /> ); }

        return (
            <Page title="Widgets">
                <Buttons>
                    <CreateButton to="/widgets/widget" />
                </Buttons>
                <Table.Table>
                    <Table.Head>
                        <Table.Column>Name</Table.Column>
                        <Table.Column>Type</Table.Column>
                        <Table.MenuColumn />
                    </Table.Head>
                    <Table.Body>
                        {
                            this.state.widgets.map(widget => {
                                return <WidgetListItem widget={widget} key={widget.ID} onReload={this.loadData}></WidgetListItem>;
                            })
                        }
                    </Table.Body>
                </Table.Table>
            </Page>
        );
    }
}
