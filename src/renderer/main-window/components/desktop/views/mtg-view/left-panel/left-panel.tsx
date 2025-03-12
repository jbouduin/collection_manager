import { Tab, Tabs } from "@blueprintjs/core";
import * as React from "react";
import { IMtgCardSetDto } from "../../../../../../../common/dto";
import { CardSetContext } from "../../../../../../shared/context";
import { CardSetTreeViewmodel } from "../../../../../viewmodels/card-set";
import { LeftPanelProps } from "./left-panel.props";
import { SearchView } from "./search-view/search-view";
import { SetTreeView } from "./set-tree-view/set-tree-view";


export function LeftPanel(props: LeftPanelProps) {
  //#region Main --------------------------------------------------------------
  return (
    <>
      <CardSetContext.Consumer>
        {
          (cardSets: Array<IMtgCardSetDto>) => (
            <Tabs
              animate={true}
              className="left-panel-tabs"
              defaultSelectedTabId="set-tree-view"
              renderActiveTabPanelOnly={true}
            >
              <Tab
                className="left-panel-tab-panel"
                id="set-tree-view"
                key="set-tree-view"
                panel={<SetTreeView {...props} cardSets={cardSets.map((c) => new CardSetTreeViewmodel(c, false, false))} />}
                title="Sets"
              />
              <Tab
                className="left-panel-tab-panel"
                id="advanced-search"
                key="advanced-search"
                panel={<SearchView onSearch={(queryString: string) => props.onSearch(queryString)} />}
                title="Advanced Search"
              />
            </Tabs>
          )
        }
      </CardSetContext.Consumer>
    </>
  );
  //#endregion
}
