import { Button, Dialog, DialogBody, DialogFooter, Section } from "@blueprintjs/core";
import { cloneDeep, noop } from "lodash";
import * as React from "react";
import { CardConditionDto, CollectionDto, OwnedCardCollectionMapDto, OwnedCardQuantityDto } from "../../../../../common/dto";
import { CardCondition } from "../../../../../common/types";
import { CardConditionContext, IpcProxyService, IpcProxyServiceContext } from "../../../../shared/context";
import { OwnedCardQuantityViewmodel } from "../../../viewmodels";
import { buildEditableState } from "./build-editable-state";
import { OwnedCardTable } from "./own-card-table";
import { OwnedCardDialogProps } from "./owned-card-dialog.props";


export function OwnedCardDialog(props: OwnedCardDialogProps) {
  //#region State -------------------------------------------------------------
  const [viewmodels, setViewmodels] = React.useState<Map<number, Array<OwnedCardQuantityViewmodel>>>(null);
  const [collections, setCollections] = React.useState<Array<CollectionDto>>(null);
  //#endregion

  //#region Context -----------------------------------------------------------
  const cardConditionContext = React.useContext<Array<CardConditionDto>>(CardConditionContext);
  const ipcProxyService = React.useContext<IpcProxyService>(IpcProxyServiceContext);
  //#endregion

  //#region Effects -----------------------------------------------------------
  React.useEffect(
    () => {
      void Promise.all([
        ipcProxyService.getData<Array<CollectionDto>>("/collection"),
        ipcProxyService.getData<Array<OwnedCardQuantityDto>>(`/card/${props.cardId}/collection`)
      ])
        .then(
          (result: [Array<CollectionDto>, Array<OwnedCardQuantityDto>]) => {
            setCollections(result[0]);
            setViewmodels(buildViemmodels(result[1], result[0]));
          },
          (_r: Error) => {
            setViewmodels(null);
            setCollections(null);
          }
        );
    },
    []
  );
  //#endregion

  //#region Event handling ----------------------------------------------------
  function onSave(): void {
    void ipcProxyService
      .postData<Array<OwnedCardQuantityDto>, Array<OwnedCardQuantityDto>>(`/card/${props.cardId}/collection`, buildRequestBody())
      .then(
        (result: Array<OwnedCardQuantityDto>) => {
          if (result) {
            setViewmodels(buildViemmodels(result, collections));
            props.onClose(result);
          }
        },
        noop
      );
  }

  function onCancel(): void {
    props.onClose(null);
  }

  function onQuantityChanged(collectionId: number, conditionId: CardCondition, isFoil: boolean, newQuantity: number): void {
    const newState = cloneDeep(viewmodels);
    newState.get(collectionId).find((vm: OwnedCardQuantityViewmodel) => vm.conditionId == conditionId && vm.isFoil == isFoil).quantity = newQuantity;
    setViewmodels(newState);
  }
  //#endregion

  //#region Rendering ---------------------------------------------------------
  return (
    <Dialog
      canEscapeKeyClose={true}
      canOutsideClickClose={true}
      className={props.className}
      isOpen={true}
      onClose={() => props.onClose(null)}
    >
      <DialogBody>{viewmodels && renderPanels()}</DialogBody>
      <DialogFooter actions={renderActions()} />
    </Dialog>
  );

  function renderActions(): React.JSX.Element {
    const disabled = viewmodels
      ? Array.from(viewmodels.values())
        .flat(1)
        .findIndex((vm: OwnedCardQuantityViewmodel) => vm.hasChanges) < 0
      : true;
    return (
      <>
        <Button
          disabled={disabled}
          icon="floppy-disk"
          onClick={onSave}
        >
          Save
        </Button>
        <Button
          icon="cross"
          onClick={onCancel}
          text="Cancel"
        />
      </>
    );
  }

  function renderPanels(): React.JSX.Element {
    return (
      <>
        {
          Array.from(viewmodels).map((value, idx) => {
            const collection = collections.find((c: CollectionDto) => c.id == value[0]);
            const foils = value[1]
              .filter((qty: OwnedCardQuantityViewmodel) => qty.isFoil == true)
              .reduce((previousValue: number, currentValue: OwnedCardQuantityViewmodel) => previousValue + currentValue.quantity, 0);
            const nonFoils = value[1]
              .filter((qty: OwnedCardQuantityViewmodel) => qty.isFoil == false)
              .reduce((previousValue: number, currentValue: OwnedCardQuantityViewmodel) => previousValue + currentValue.quantity, 0);
            return (
              <>
                <Section
                  collapseProps={{ defaultIsOpen: idx == 0 }}
                  collapsible={true}
                  compact={true}
                  icon="layers"
                  title={
                    <>
                      {collection.name} ({nonFoils} / {foils})
                    </>
                  }
                >
                  <div style={{ padding: "15px" }}>
                    <OwnedCardTable
                      onQuantityChanged={
                        (conditionId: CardCondition, isFoil: boolean, newQuantity: number) => onQuantityChanged(value[0], conditionId, isFoil, newQuantity)
                      }
                      quantities={value[1]}
                      readOnly={false}
                    />
                  </div>
                </Section>
              </>
            );
          })
        }
      </>
    );
  }
  //#endregion

  //#region Auxiliary methods -------------------------------------------------
  function buildViemmodels(existing: Array<OwnedCardQuantityDto>, collections: Array<CollectionDto>): Map<number, Array<OwnedCardQuantityViewmodel>> {
    const dtoMapByCollection = existing
      .map((dto: OwnedCardQuantityDto) => dto.collectionMaps)
      .flat(1)
      .reduce<Map<number, Array<OwnedCardQuantityDto>>>(
        (prev, current) => {
          if (!prev.has(current.collection_id)) {
            prev.set(current.collection_id, new Array<OwnedCardQuantityDto>());
          }
          return prev;
        },
        new Map<number, Array<OwnedCardQuantityDto>>()
      );

    dtoMapByCollection.forEach((resultDtoArray: Array<OwnedCardQuantityDto>, collectionId: number) => {
      existing.forEach((dto: OwnedCardQuantityDto) => {
        const collectionDto = dto.collectionMaps.find((cm: OwnedCardCollectionMapDto) => cm.collection_id == collectionId);
        if (collectionDto) {
          const ownedCardQuantityDto: OwnedCardQuantityDto = {
            id: dto.id,
            card_id: dto.card_id,
            condition_id: dto.condition_id,
            is_foil: dto.is_foil,
            comments: dto.comments,
            created_at: dto.created_at,
            modified_at: dto.modified_at,
            collectionMaps: [cloneDeep(collectionDto)]
          };
          resultDtoArray.push(ownedCardQuantityDto);
        }
      });
    });

    collections
      .filter((c: CollectionDto) => !c.is_folder && !dtoMapByCollection.has(c.id))
      .forEach((c: CollectionDto) => dtoMapByCollection.set(c.id, new Array<OwnedCardQuantityDto>()));
    const result = new Map<number, Array<OwnedCardQuantityViewmodel>>();
    dtoMapByCollection
      .forEach((resultDtoArray: Array<OwnedCardQuantityDto>, collectionId: number) => result.set(
        collectionId,
        buildEditableState(cardConditionContext, props.cardId, collectionId, resultDtoArray)
      ));
    return result;
  }

  function buildRequestBody(): Array<OwnedCardQuantityDto> {
    const result = new Array<OwnedCardQuantityDto>();
    Array.from(viewmodels)
      .map((mapEntry: [number, Array<OwnedCardQuantityViewmodel>]) => mapEntry[1])
      .flat(1)
      .filter((vm: OwnedCardQuantityViewmodel) => vm.hasChanges)
      .forEach((vm: OwnedCardQuantityViewmodel) => {
        let inResult: OwnedCardQuantityDto = result.find((r: OwnedCardQuantityDto) => r.condition_id == vm.conditionId && r.is_foil == vm.isFoil);
        if (!inResult) {
          inResult = {
            collectionMaps: new Array<OwnedCardCollectionMapDto>(),
            id: vm.dto.id,
            created_at: vm.dto.created_at,
            modified_at: vm.dto.modified_at,
            card_id: vm.dto.card_id,
            condition_id: vm.conditionId,
            is_foil: vm.isFoil,
            comments: vm.dto.comments
          };
          result.push(inResult);
        }
        inResult.collectionMaps.push(...vm.dto.collectionMaps);
      });
    return result;
  }
  //#endregion
}
