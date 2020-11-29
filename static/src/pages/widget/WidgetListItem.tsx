import * as React from 'react';
import { Widget } from '../../types/Widget';
import { Link } from 'react-router-dom';
import { Dropdown, Menu } from '../../components/Menu';
import { Style } from '../../components/Style';
import { Icon } from '../../components/Icon';
import { Table } from '../../components/Table';

export interface WidgetListItemProps { widget: Widget, onReload: () => (void); }
export class WidgetListItem extends React.Component<WidgetListItemProps, {}> {
    private deleteMenuClick = () => {
        this.props.widget.DeleteModal().then(confirmed => {
            if (confirmed) {
                this.props.onReload();
            }
        });
    }

    render(): JSX.Element {
        const link = <Link to={'/widgets/widget/' + this.props.widget.ID}>{ this.props.widget.Name }</Link>;
        const dropdownLabel = <Icon.Bars />;
        const buttonProps = {
            color: Style.Palette.Secondary,
            outline: true,
            size: Style.Size.XS,
        };
        return (
            <Table.Row>
                <td>{ link }</td>
                <td>{ this.props.widget.Type }</td>
                <td>
                    <Dropdown label={dropdownLabel} button={buttonProps}>
                        <Menu.Link label="Edit" icon={<Icon.Edit />} to={'/widgets/widget/' + this.props.widget.ID + '/edit'}/>
                        <Menu.Divider />
                        <Menu.Item label="Delete" icon={<Icon.Delete />} onClick={this.deleteMenuClick}/>
                    </Dropdown>
                </td>
            </Table.Row>
        );
    }
}
