import { Button, Card, Classes, ContextMenu, Props, Tree, TreeNodeInfo } from "@blueprintjs/core";
import * as React from "react";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { CardSetSyncOptions, CardSyncOptions, CatalogSyncOptions, IQueryOrSyncParam } from "../../common/ipc-params";
import { CardSetSelectDto } from "../../common/dto";

interface tState {
  nodes: Array<TreeNodeInfo>;
}
export class TemporaryMainPanel extends React.Component<Props, tState> {
  private contentSizing = { popoverProps: { popoverClassName: Classes.POPOVER_CONTENT_SIZING } };
  public constructor(props: Props) {
    super(props);
    this.state = { nodes: new Array<TreeNodeInfo<CardSetSelectDto>>() };
  }

  private handleNodeCollapse(node: TreeNodeInfo<CardSetSelectDto>, nodePath: Array<number>, e: React.MouseEvent<HTMLElement>): void {
    console.log(node.isExpanded);
    // node.isExpanded = false; -> TODO error
    // this.setState(this.state);
  }

  private handleNodeClick(node: TreeNodeInfo<CardSetSelectDto>, nodePath: Array<number>, e: React.MouseEvent<HTMLElement>): void {
    console.log(node.nodeData.block, ":", node.nodeData.name);
  }

  private handleNodeExpand(node: TreeNodeInfo<CardSetSelectDto>, nodePath: Array<number>, e: React.MouseEvent<HTMLElement, MouseEvent>): void {
    console.log(node.isSelected);

  }

  public componentDidMount(): void {
    window.ipc.query({ type: "CardSet", options: null }).then((r) => {
      const cardSets = r as Array<CardSetSelectDto>;
      this.setState({ nodes: this.nest(cardSets, null) });
    });

  }

  private nest(items: Array<CardSetSelectDto>, id: string | undefined): Array<TreeNodeInfo> {
    return items
      .filter((item: CardSetSelectDto) => item.parent_set_code === id)
      .map(item => {
        const childNodes: Array<TreeNodeInfo> = this.nest(items, item.code);
        const node: TreeNodeInfo = {
          id: item.id,
          label: (
            <ContextMenu {...this.contentSizing} content={<div>{item.name}</div>}>
              {item.name}
            </ContextMenu>
          ),
          isExpanded: false, //!id,
          childNodes: childNodes.length > 0 ? childNodes : null,
          nodeData: item
        };
        return node;
      });
  }

  public render(): React.ReactNode {
    const chromeVersion = window.versions.chrome();
    const nodeVersion = window.versions.node();
    const elecVersion = window.versions.electron();
    const compact = true;
    const ping = "waiting for ping";
    return (
      <div>
        <PanelGroup direction="horizontal">
          <Panel defaultSize={20}>
            <Tree
              compact={compact}
              contents={this.state.nodes}
              onNodeClick={this.handleNodeClick}
              onNodeCollapse={this.handleNodeCollapse}
              onNodeExpand={this.handleNodeExpand}
              className={Classes.ELEVATION_0}
            />
          </Panel>
          <PanelResizeHandle />
          <Panel>
            <Card className={this.props.className}>
              <div>
                <h2>💖 Hello from React - Blueprint desktop!</h2>
                <p>
                  This app is using Chrome ({chromeVersion}), Node.js ({nodeVersion}), and Electron ({elecVersion})
                </p>
                <p>
                  {ping}
                </p>
                <p>
                  <h3>Sync</h3>
                  <Button text="Sync some catalogs" onClick={() => {
                    const param: IQueryOrSyncParam<CatalogSyncOptions> = {
                      type: "Catalog",
                      options: { catalogs: ["AbilityWords", "ArtifactTypes", "LandTypes"] }
                    };
                    window.ipc.sync(param);
                  }} />
                  <Button text="Sync symbology" onClick={() => {
                    const param: IQueryOrSyncParam<undefined> = {
                      type: "Symbology",
                      options: undefined
                    };
                    window.ipc.sync(param);
                  }} />
                  <Button text="Sync cardsets" onClick={() => {
                    const param: IQueryOrSyncParam<CardSetSyncOptions> = {
                      type: "CardSet",
                      options: { code: null }
                    };
                    window.ipc.sync(param);
                  }} />
                  <Button text="Sync UDS" onClick={() => {
                    const param: IQueryOrSyncParam<CardSyncOptions> = {
                      type: "Card",
                      options: { setCode: "UDS" }
                    };
                    window.ipc.sync(param);
                  }} />
                  <Button text="Sync MKM" onClick={() => {
                    const param: IQueryOrSyncParam<CardSyncOptions> = {
                      type: "Card",
                      options: { setCode: "MKM" }
                    };
                    window.ipc.sync(param);
                  }} />
                  <Button text="Sync SOI" onClick={() => {
                    const param: IQueryOrSyncParam<CardSyncOptions> = {
                      type: "Card",
                      options: { setCode: "SOI" }
                    };
                    window.ipc.sync(param);
                  }} />
                  <Button text="Sync TOTP" onClick={() => {
                    const param: IQueryOrSyncParam<CardSyncOptions> = {
                      type: "Card",
                      options: { setCode: "TOTP" }
                    };
                    window.ipc.sync(param);
                  }} />
                </p>
                <p>
                  <h3>Query</h3>
                  <Button text="Query Artifact types" onClick={() => window.ipc.query({ type: "Catalog", options: null })} />
                  <Button text="Query Sets" onClick={() => window.ipc.query({ type: "CardSet", options: null })} />
                  <Button text="Query Language" onClick={() => window.ipc.query({ type: "Language", options: null })} />
                  <Button text="Query Colors" onClick={() => window.ipc.query({ type: "Color", options: null })} />
                  <Button text="Query Symbology" onClick={() => window.ipc.query({ type: "Symbology", options: null })} />
                  <Button text="Query or Sync ruling" onClick={() => window.ipc.queryOrSync({ type: "Ruling", options: { cardId: "bd6e71a1-713e-4eca-bd65-9f0638c16794" } }).then((result) => console.log(result))} />
                </p>
              </div >
            </Card>
          </Panel>
          <PanelResizeHandle />
          <Panel defaultSize={20}>
            <PanelGroup direction="vertical">
              <Panel>
                 <Card>Here comes the image</Card>
              </Panel>
              <PanelResizeHandle />
              <Panel><Card>Here comes the info</Card></Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div >
    );
  }



}
