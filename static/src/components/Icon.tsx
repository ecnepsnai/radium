import * as React from 'react';
import { Style } from './Style';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
    faBars,
    faCheckCircle,
    faCog,
    faEdit,
    faExclamationCircle,
    faExclamationTriangle,
    faInfoCircle,
    faMinus,
    faPlus,
    faQuestionCircle,
    faSignOutAlt,
    faSpinner,
    faStarOfLife,
    faTimesCircle,
    faTrashAlt,
    faUser,
    faUserEdit,
    faUsers,
    faWrench,
} from '@fortawesome/free-solid-svg-icons';
import '../../css/icon.scss';

export namespace Icon {
    export interface IconProps {
        pulse?: boolean;
        spin?: boolean;
        color?: Style.Palette;
    }

    interface EIconProps {
        icon: IconProp;
        options: IconProps;
    }

    class EIcon extends React.Component<EIconProps, {}> {
        render(): JSX.Element {
            let className = '';
            if (this.props.options.color) {
                className = 'text-' + this.props.options.color.toString();
            }
            return ( <FontAwesomeIcon icon={this.props.icon} pulse={this.props.options.pulse} spin={this.props.options.spin} className={className}/> );
        }
    }

    export class Asterisk extends React.Component<IconProps, {}> {render(): JSX.Element { return ( <EIcon icon={faStarOfLife} options={this.props}/> );}}
    export class Bars extends React.Component<IconProps, {}> {render(): JSX.Element { return ( <EIcon icon={faBars} options={this.props}/> );}}
    export class CheckCircle extends React.Component<IconProps, {}> {render(): JSX.Element { return ( <EIcon icon={faCheckCircle} options={this.props}/> );}}
    export class Cog extends React.Component<IconProps, {}> {render(): JSX.Element { return ( <EIcon icon={faCog} options={this.props}/> );}}
    export class Delete extends React.Component<IconProps, {}> {render(): JSX.Element { return ( <EIcon icon={faTrashAlt} options={this.props}/> );}}
    export class Edit extends React.Component<IconProps, {}> {render(): JSX.Element { return ( <EIcon icon={faEdit} options={this.props}/> );}}
    export class ExclamationCircle extends React.Component<IconProps, {}> {render(): JSX.Element { return ( <EIcon icon={faExclamationCircle} options={this.props}/> );}}
    export class ExclamationTriangle extends React.Component<IconProps, {}> {render(): JSX.Element { return ( <EIcon icon={faExclamationTriangle} options={this.props}/> );}}
    export class InfoCircle extends React.Component<IconProps, {}> {render(): JSX.Element { return ( <EIcon icon={faInfoCircle} options={this.props}/> );}}
    export class Minus extends React.Component<IconProps, {}> {render(): JSX.Element { return ( <EIcon icon={faMinus} options={this.props}/> );}}
    export class Plus extends React.Component<IconProps, {}> {render(): JSX.Element { return ( <EIcon icon={faPlus} options={this.props}/> );}}
    export class QuestionCircle extends React.Component<IconProps, {}> {render(): JSX.Element { return ( <EIcon icon={faQuestionCircle} options={this.props}/> );}}
    export class SignOut extends React.Component<IconProps, {}> {render(): JSX.Element { return ( <EIcon icon={faSignOutAlt} options={this.props}/> );}}
    export class Spinner extends React.Component<IconProps, {}> {render(): JSX.Element { return ( <EIcon icon={faSpinner} options={this.props}/> );}}
    export class TimesCircle extends React.Component<IconProps, {}> {render(): JSX.Element { return ( <EIcon icon={faTimesCircle} options={this.props}/> );}}
    export class User extends React.Component<IconProps, {}> {render(): JSX.Element { return ( <EIcon icon={faUser} options={this.props}/> );}}
    export class UserEdit extends React.Component<IconProps, {}> {render(): JSX.Element { return ( <EIcon icon={faUserEdit} options={this.props}/> );}}
    export class Users extends React.Component<IconProps, {}> {render(): JSX.Element { return ( <EIcon icon={faUsers} options={this.props}/> );}}
    export class Wrench extends React.Component<IconProps, {}> {render(): JSX.Element { return ( <EIcon icon={faWrench} options={this.props}/> );}}

    export interface LabelProps { icon: JSX.Element; spin?: boolean; label: string|number; }
    export class Label extends React.Component<LabelProps, {}> {
        render(): JSX.Element {
            return (
                <span>
                    { this.props.icon }
                    <span className="ml-1">{ this.props.label }</span>
                </span>
            );
        }
    }
}
