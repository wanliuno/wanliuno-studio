// Copyright 2018 Superblocks AB
//
// This file is part of Superblocks Lab.
//
// Superblocks Lab is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation version 3 of the License.
//
// Superblocks Lab is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Superblocks Lab.  If not, see <http://www.gnu.org/licenses/>.

import React from 'react';
import style from './style.less';
import './react-splitter-layout.css';
import Panes from './panes';
import TopBar from '../topbar';
import BottomBar from './bottomBar';
import ContactContainer from '../contactContainer';
import { Preview, TransactionLogPanel, Console, Explorer, EventLogPanel } from './panels';
import { IconTransactions, IconShowPreview, IconPanelRun, IconFolderOpen, IconEventLog } from '../icons';
import { SideButton } from './sideButton';
import { SplitterLayout } from './splitterLayout';
import { Panel } from './panel';
import classnames from 'classnames';
import { Panels, IPanelsState, IEnvironment } from '../../models/state';
import { Deployer } from './deployer';
import OnlyIf from '../onlyIf';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

interface IProps {
    router: any;
    functions: any;
    panels: IPanelsState;
    selectedEnvironment: IEnvironment;
    togglePanel(panel: Panels): void;
    closePanel(panel: Panels): void;
}

interface IState {
    sidePanelDragging: boolean;
}

@DragDropContext(HTML5Backend)
export class ProjectEditor extends React.Component<IProps, IState> {
    state: IState = { sidePanelDragging: false };

    constructor(props: IProps) {
        super(props);
        // Mute defalt ctrl-s behavior.
        window.addEventListener(
            'keydown',
            (e) => {
                if ( e.keyCode === 83 && (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey) ) {
                    e.preventDefault();
                }
            },
            false
        );
    }

    toggleSidePanelDragging() {
        this.setState({ sidePanelDragging: !this.state.sidePanelDragging });
    }

    isPanelOpen = (panel: Panels) => this.props.panels[panel] && this.props.panels[panel].open;

    render() {
        const { router,
                functions,
                togglePanel,
                closePanel,
                selectedEnvironment } = this.props;

        const { sidePanelDragging } = this.state;

        return (
            <div className={style.projecteditor}>
                <TopBar functions={functions} />
                <div className={style.mainWrapper}>
                    <div className={classnames([style.sideButtonsContainer, style.sideButtonsContainerLeft])}>
                        <SideButton name='Explorer'
                            icon={<IconFolderOpen color='#fff' />}
                            onClick={() => togglePanel(Panels.Explorer)}
                        />
                    </div>

                    <div className={style.mainLayout}>
                        <div className={style.splitterContainer}>
                            <SplitterLayout
                                primaryIndex={1}
                                secondaryMinSize={0}
                                secondaryInitialSize={280}
                                customClassName={!this.isPanelOpen(Panels.Explorer) ? 'hideFileSystemPanel' : undefined}
                                onSecondaryPaneSizeChange={() => null}>
                                <div className={style.control}>
                                    <Panel
                                        name='Explorer'
                                        onClose={() => this.props.closePanel(Panels.Explorer)}
                                        dragging={this.state.sidePanelDragging}>
                                        <Explorer />
                                    </Panel>
                                    <ContactContainer />
                                </div>
                                <div>
                                    <SplitterLayout
                                        primaryIndex={0}
                                        secondaryMinSize={232}
                                        secondaryInitialSize={500}
                                        onDragStart={() => this.toggleSidePanelDragging()}
                                        onDragEnd={() => this.toggleSidePanelDragging()}
                                        onSecondaryPaneSizeChange={() => null}>

                                        <Panes dragging={sidePanelDragging} />

                                        { this.isPanelOpen(Panels.Transactions) &&
                                        <Panel name='Transactions History' onClose={() => closePanel(Panels.Transactions)} dragging={sidePanelDragging}>
                                            <TransactionLogPanel
                                                dragging={sidePanelDragging}
                                                router={router}
                                                onClose={() => closePanel(Panels.Transactions)}
                                                selectedEnvironment={selectedEnvironment.name}
                                            />
                                        </Panel>}

                                        { this.isPanelOpen(Panels.Preview) &&
                                        <Panel name='Preview' onClose={() => closePanel(Panels.Preview)} dragging={sidePanelDragging}>
                                            <Preview
                                                dragging={sidePanelDragging}
                                                onClose={() => closePanel(Panels.Preview)}
                                            />
                                        </Panel>}

                                    </SplitterLayout>
                                </div>
                            </SplitterLayout>
                        </div>

                        <div className={style.bottomButtonsContainer}>
                            <OnlyIf test={this.isPanelOpen(Panels.CompilerOutput)}>
                                <div className={style.bottomPanelContainer}>
                                    <Panel name='Run' onClose={() => closePanel(Panels.CompilerOutput)} dragging={sidePanelDragging}>
                                        <Console />
                                    </Panel>
                                </div>
                            </OnlyIf>
                            <OnlyIf test={this.isPanelOpen(Panels.EventLog)}>
                                <div className={style.bottomPanelContainer}>
                                    <Panel name='Event Log' onClose={() => closePanel(Panels.EventLog)} dragging={sidePanelDragging}>
                                        <EventLogPanel />
                                    </Panel>
                                </div>
                            </OnlyIf>

                            <SideButton name='Run'
                                icon={<IconPanelRun />}
                                onClick={() => togglePanel(Panels.CompilerOutput)}  />

                            <div style={{marginLeft: 'auto'}}>
                                <SideButton name='Event Log'
                                    icon={<IconEventLog />}
                                    onClick={() => togglePanel(Panels.EventLog)}  />
                            </div>
                        </div>
                    </div>

                    <div className={classnames([style.sideButtonsContainer, style.sideButtonsContainerRight])}>
                        <SideButton name='Transactions'
                            icon={<IconTransactions />}
                            onClick={() => togglePanel(Panels.Transactions)}  />

                        <SideButton name='Preview'
                            icon={<IconShowPreview />}
                            onClick={() => togglePanel(Panels.Preview)}  />
                    </div>
                </div>

                <BottomBar endpoint={selectedEnvironment.endpoint} />
                <Deployer />
            </div>
        );
    }
}
