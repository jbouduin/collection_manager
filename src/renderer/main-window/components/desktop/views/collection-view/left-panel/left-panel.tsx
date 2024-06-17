import * as React from "react";
import { HeaderView } from "./header-view/header-view";
import { LeftPanelProps } from "./left-panel.props";
import { CollectionViewmodel } from "../../../../../viewmodels/collection/collection.viewmodel";
import { TreeConfigurationViewmodel } from "../../../../../viewmodels/database-view/tree-configuration.viewmodel";
import { BaseTreeView } from "../../../../../components/common/base-tree-view/base-tree-view";
import { TreeNodeInfo } from "@blueprintjs/core";
import { QueryParam } from "../../../../../../../common/ipc-params";
import { DtoCollection } from "../../../../../../../common/dto";

export function LeftPanel(props: LeftPanelProps) {


  const [collections, setCollections] = React.useState<Array<CollectionViewmodel>>(new Array<CollectionViewmodel>());

  React.useEffect(
    () => {
      const queryCollections: QueryParam<null> = {
        type: "Collection",
        options: null
      };
      window.ipc.query(queryCollections)
        .then((result: Array<DtoCollection>) => setCollections(result.map((collection: DtoCollection) => new CollectionViewmodel(collection))));
    },
    [props]
  )

  function applyFilterProps(data: Array<CollectionViewmodel>, _filterProps: TreeConfigurationViewmodel): Array<CollectionViewmodel> {
    return data;
  }

  function buildTree(data: CollectionViewmodel[], __filterProps: TreeConfigurationViewmodel): TreeNodeInfo<string | CollectionViewmodel>[] {
    return buildTreeByParentRecursive(data, null);
  }

  //#region Main --------------------------------------------------------------
  return (
    <div className="card-set-tree-wrapper">
      <HeaderView

      />
      <BaseTreeView<CollectionViewmodel, TreeConfigurationViewmodel>
        data={collections}
        onDataSelected={props.onCollectionSelected}
        filterProps={undefined}
        applyFilterProps={applyFilterProps}
        buildTree={buildTree}
      />
    </div>
  );
  //#endregion

  function buildTreeByParentRecursive(collections: Array<CollectionViewmodel>, id: number | null): Array<TreeNodeInfo<CollectionViewmodel>> {
    return collections
      .filter((item: CollectionViewmodel) => item.parentId === id)
      .sort((a: CollectionViewmodel, b: CollectionViewmodel) => a.name.localeCompare(b.name))
      .map((collection: CollectionViewmodel) => {
        const childNodes: Array<TreeNodeInfo<CollectionViewmodel>> = buildTreeByParentRecursive(collections, collection.id);
        const node = mapViewModelToTreeItem(collection);
        node.childNodes = childNodes.length > 0 ? childNodes : null;
        return node;
      });
  }

  function mapViewModelToTreeItem(collection: CollectionViewmodel): TreeNodeInfo<CollectionViewmodel> {
    const node: TreeNodeInfo<CollectionViewmodel> = {
      id: collection.id,
      label: collection.name,
      isExpanded: false,
      isSelected: false,
      nodeData: collection
    };
    return node;
  }
}
