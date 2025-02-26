import { Tab, Tabs } from "@blueprintjs/core";
import * as React from "react";
import { LeftPanelProps } from "./left-panel.props";
import { SearchView } from "./search-view/search-view";
import { SetTreeView } from "./set-tree-view/set-tree-view";


export function LeftPanel(props: LeftPanelProps) {
  //#region Main --------------------------------------------------------------
  return (
    <div className="card-set-tree-wrapper">
      <Tabs
        animate={true}
        defaultSelectedTabId="set-tree-view"
        renderActiveTabPanelOnly={true}
      >
        <Tab
          id="set-tree-view"
          key="set-tree-view"
          panel={<SetTreeView {...props} />}
          title="Sets"
        />
        <Tab
          id="advanced-search"
          key="advanced-search"
          panel={<SearchView onSearch={(queryString: string) => props.onSearch(queryString)} />}
          title="Advanced Search"
        />
      </Tabs>
    </div>
  );
  //#endregion
}
