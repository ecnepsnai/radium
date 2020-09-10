import * as React from 'react';
import '../../css/badge.scss';
import { Style } from './Style';

export interface BadgeProps {
    color: Style.Palette;
    pill?: boolean;
    className?: string;
}

/**
 * A small coloured label
 */
export class Badge extends React.Component<BadgeProps, {}> {
    public static className(props: BadgeProps): string {
        let className = 'badge ';
        className += 'bg-' + props.color.toString();
        if (props.pill) {
            className += ' rounded-pill';
        }
        if (props.className) {
            className += ' ' + props.className;
        }
        return className;
    }
    render(): JSX.Element {
        const className = Badge.className(this.props);
        return (
            <div className={className}>{ this.props.children }</div>
        );
    }
}

export interface EnabledBadgeProps {
    value: boolean;
    trueText?: string;
    falseText?: string;
}

export class EnabledBadge extends React.Component<EnabledBadgeProps, {}> {
    constructor(props: EnabledBadgeProps) {
        super(props);
    }
    private color = (): Style.Palette => {
        if (this.props.value) {
            return Style.Palette.Success;
        }
        return Style.Palette.Danger;
    }
    private text = (): string => {
        if (this.props.value) {
            return this.props.trueText ?? 'Enabled';
        }
        return this.props.falseText ?? 'Disabled';
    }
    render(): JSX.Element {
        return (
            <Badge color={this.color()} pill>{ this.text() }</Badge>
        );
    }
}
