import * as React from 'react';
import { Style } from './Style';
import { Button } from './Button';
import { Bootstrap, BSModule } from '../services/Bootstrap';
import { Rand } from '../services/Rand';
import { Form } from './Form';

export interface ModalButton {
    /**
     * The label for the button
     */
    label: JSX.Element | string;
    /**
     * The color of the button
     */
    color?: Style.Palette;
    /**
     * Event fired when the button is clicked
     */
    onClick?: () => void;
    /**
     * If true, clicking this button will not dismiss the modal
     */
    dontDismiss?: boolean;
    /**
     * If true the button is disabled
     */
    disabled?: boolean;
}

export interface ModalProps {
    /**
     * The title of the modal
     */
    title?: string;
    /**
     * The header of the modal
     */
    header?: JSX.Element;
    /**
     * Array of buttons for the modal
     */
    buttons?: ModalButton[];
    /**
     * Event fired after the modal was dismissed and is no longer visible
     */
    dismissed?: () => void;
    /**
     * Optional ID for the modal. If none is specified then the modal DOM is not removed after the modal is shown
     */
    id?: string;
    /**
     * Optional size for the modal
     */
    size?: Style.Size;
    /**
     * Optional if the modal can not be dismissed by clicking the background or pressing esc
     */
    static?: boolean;
}

interface ModalState {
    id: string;
    bsModal?: BSModule;
}

export class Modal extends React.Component<ModalProps, ModalState> {
    private static modals: { [id: string]: BSModule; } = {};
    constructor(props: ModalProps) {
        super(props);
        this.state = { id: props.id ?? Rand.ID() };
    }
    componentDidMount(): void {
        const element = document.getElementById(this.state.id);
        const id = this.state.id;
        element.addEventListener('hidden.bs.modal', () => {
            if (this.props.dismissed) {
                this.props.dismissed();
            }
            GlobalModalFrame.removeModal();
            delete Modal.modals[id];
        });
        let backdrop: boolean | string = true;
        if (this.props.static) {
            backdrop = 'static';
        }
        const bsm = Bootstrap.Modal(element, { show: true, backdrop: backdrop });
        bsm.show();
        this.setState({ bsModal: bsm });
        Modal.modals[id] = bsm;
    }
    private buttonClick = (button: ModalButton): Function => {
        return () => {
            if (button.onClick) { button.onClick(); }
            if (!button.dontDismiss) { this.state.bsModal.hide(); }
        };
    };
    private closeButton = () => {
        if (this.props.static) { return null; }
        return (
        <button type="button" className="btn-close" data-dismiss="modal" aria-label="Close"></button>
        );
    }
    private header = () => {
        if (this.props.title) {
            return (
                <div className="modal-header">
                    <h5 className="modal-title">{ this.props.title }</h5>
                    { this.closeButton() }
                </div>
            );
        } else if (this.props.header) {
            return this.props.header;
        }
        return null;
    }
    private footer = () => {
        if (!this.props.buttons || this.props.buttons.length == 0) {
            return null;
        }

        return (
            <div className="modal-footer">
                {
                    this.props.buttons.map(button => {
                        button.color = button.color ?? Style.Palette.Primary;
                        return <Button color={button.color} onClick={this.buttonClick(button)} key={Rand.ID()} disabled={button.disabled}>{ button.label }</Button>;
                    })
                }
            </div>
        );
    }
    render(): JSX.Element {
        let className = 'modal-dialog';
        if (this.props.size) {
            className += ' modal-' + this.props.size.toString();
        }

        return (
            <div className="modal fade" id={this.state.id}>
                <div className={className}>
                    <div className="modal-content">
                        { this.header() }
                        <div className="modal-body">
                            { this.props.children }
                        </div>
                        { this.footer() }
                    </div>
                </div>
            </div>
        );
    }

    public static dismiss(id: string): void {
        Modal.modals[id].hide();
    }

    /**
     * A confirm dialog where the two buttons are 'Cancel' and 'Delete'
     * @param title The title of the dialog
     * @param body The body of the dialog
     * @returns A promise that is resolved with wether or not the user clicked the 'Delete' button
     */
    public static delete(title: string, body: string): Promise<boolean> {
        return new Promise(resolve => {
            const buttonClick = (confirm: boolean): () => (void) => {
                return () => {
                    resolve(confirm);
                };
            };
            const dismissed = () => {
                buttonClick(false)();
            };
            const buttons: ModalButton[] = [
                {
                    label: 'Cancel',
                    color: Style.Palette.Secondary,
                    onClick: buttonClick(false),
                },
                {
                    label: 'Delete',
                    color: Style.Palette.Danger,
                    onClick: buttonClick(true),
                }
            ];
            const id = Rand.ID();
            GlobalModalFrame.showModal(
                <Modal title={title} buttons={buttons} dismissed={dismissed} key={id} id={id}>
                    <p>{ body }</p>
                </Modal>
            );
        });
    }

    /**
     * A confirm dialog where the two buttons are 'Cancel' and 'Confirm'. Not sutible for dangerous actions.
     * @param title The title of the dialog
     * @param body The body of the dialog
     * @returns A promise that is resolved with wether or not the user clicked the 'Confirm' button
     */
    public static confirm(title: string, body: string): Promise<boolean> {
        return new Promise(resolve => {
            const buttonClick = (confirm: boolean): () => (void) => {
                return () => {
                    resolve(confirm);
                };
            };
            const dismissed = () => {
                buttonClick(false)();
            };
            const buttons: ModalButton[] = [
                {
                    label: 'Cancel',
                    color: Style.Palette.Secondary,
                    onClick: buttonClick(false),
                },
                {
                    label: 'Confirm',
                    color: Style.Palette.Primary,
                    onClick: buttonClick(true),
                }
            ];
            const id = Rand.ID();
            GlobalModalFrame.showModal(
                <Modal title={title} buttons={buttons} dismissed={dismissed} key={id} id={id}>
                    <p>{ body }</p>
                </Modal>
            );
        });
    }
}

export class ModalHeader extends React.Component<{}, {}> {
    render(): JSX.Element {
        return (
            <div className="modal-header">
                { this.props.children }
                <button type="button" className="btn-close" data-dismiss="modal" aria-label="Close"></button>
            </div>
        );
    }
}

interface GlobalModalFrameProps {}
interface GlobalModalFrameState {
    modal?: JSX.Element;
}

export class GlobalModalFrame extends React.Component<GlobalModalFrameProps, GlobalModalFrameState> {
    constructor(props: GlobalModalFrameProps) {
        super(props);
        this.state = {};
        GlobalModalFrame.instance = this;
    }

    private static instance: GlobalModalFrame;

    public static showModal(modal: JSX.Element): void {
        this.instance.setState(state => {
            if (state.modal != undefined) {
                throw new Error('Refusing to stack modals');
            }
            return { modal: modal };
        });
    }

    public static removeModal(): void {
        try {
            document.body.classList.remove('modal-open');
            document.querySelector('.modal-backdrop').remove();
        } catch (e) {
            //
        }
        this.instance.setState({ modal: undefined });
    }

    render(): JSX.Element {
        return (
            <div id="global-modal-frame">
                {
                    this.state.modal
                }
            </div>
        );
    }
}

export interface ModalFormProps {
    /**
     * The title of the modal
     */
    title: string;
    /**
     * Submit method - called when the submit button is clicked if the form is valid. Return a promise that when resolved
     * will dismiss the modal.
     */
    onSubmit: () => (Promise<unknown>);
}
interface ModalFormState {
    loading?: boolean;
}
/**
 * A modal with a form element. Buttons in the footer of the modal are used for the form element.
 */
export class ModalForm extends React.Component<ModalFormProps, ModalFormState> {
    constructor(props: ModalFormProps) {
        super(props);
        this.state = {};
        this.formRef = React.createRef();
    }
    private formRef: React.RefObject<Form>;

    private saveClick = () => {
        if (!this.formRef.current.validateForm()) {
            return;
        }

        this.setState({ loading: true });
        this.props.onSubmit().then(() => {
            GlobalModalFrame.removeModal();
        }, () => {
            this.setState({ loading: false });
        });
    }

    render(): JSX.Element {
        const buttons: ModalButton[] = [
            {
                label: 'Discard',
                color: Style.Palette.Secondary,
                disabled: this.state.loading,
            },
            {
                label: 'Save',
                color: Style.Palette.Primary,
                onClick: this.saveClick,
                dontDismiss: true,
                disabled: this.state.loading,
            }
        ];

        return (
            <Modal title={this.props.title} buttons={buttons} static>
                <Form ref={this.formRef}>
                    { this.props.children }
                </Form>
            </Modal>
        );
    }
}
