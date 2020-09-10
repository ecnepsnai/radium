import * as React from 'react';
import { StateManager } from './services/StateManager';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { GlobalModalFrame } from './components/Modal';
import { GlobalNotificationFrame } from './components/Notification';
import { GlobalRedirectFrame } from './components/Redirect';
import { Nav } from './components/Nav';
import { WidgetEdit } from './pages/widget/WidgetEdit';
import { WidgetList } from './pages/widget/WidgetList';
import { WidgetView } from './pages/widget/WidgetView';
import { OptionsMain } from './pages/options/OptionsMain';
import '../css/main.scss';
import { Loading } from './components/Loading';

export interface AppProps {}
interface AppState { loading: boolean; }
export class App extends React.Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props);
        this.state = { loading: true };
    }
    componentDidMount(): void {
        StateManager.Refresh().then(() => {
            this.setState({ loading: false });
        });
    }

    render(): JSX.Element {
        if (this.state.loading) {
            return (<div className="mt-3 ml-3"><Loading /></div>);
        }

        return (
            <Router>
                <Nav />
                <Switch>
                    <Route path="/widgets/widget/:id/edit" component={WidgetEdit} />
                    <Route path="/widgets/widget/:id" component={WidgetView} />
                    <Route path="/widgets/widget" component={WidgetEdit} />
                    <Route path="/widgets" component={WidgetList} />
                    <Route path="/options" component={OptionsMain} />
                </Switch>
                <GlobalModalFrame />
                <GlobalNotificationFrame />
                <GlobalRedirectFrame />
            </Router>
        );
    }
}
