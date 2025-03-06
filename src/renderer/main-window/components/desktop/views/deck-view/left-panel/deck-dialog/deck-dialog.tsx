import { Button, Dialog, DialogBody, DialogFooter, FormGroup, HTMLSelect, Icon, InputGroup, SectionCard, TextArea } from "@blueprintjs/core";
import { cloneDeep } from "lodash";
import * as React from "react";
import { GameFormat } from "../../../../../../../../common/types";
import { displayValueRecordToSelectOptions, handleStringChange, handleValueChange, SelectOption, SvgProvider } from "../../../../../../../shared/components";
import { DisplayValueService, DisplayValueServiceContext } from "../../../../../../../shared/context";
import { DeckViewmodel } from "../../../../../../viewmodels";
import { DeckDialogProps } from "./deck-dialog.props";


export function DeckDialog(props: DeckDialogProps) {
  //#region State -------------------------------------------------------------
  const [deck, setDeck] = React.useState<DeckViewmodel>(props.deck);
  //#endregion

  //#region Context -----------------------------------------------------------
  const displayValueService = React.useContext<DisplayValueService>(DisplayValueServiceContext);
  //#endregion

  //#region Effect ------------------------------------------------------------
  React.useEffect(
    () => {
      if (props.deck) {
        setDeck(props.deck);
      }
    },
    [props.deck]
  );
  //#endregion

  //#region Memo --------------------------------------------------------------
  const gameFormats: Array<SelectOption<GameFormat>> = React.useMemo(
    () => new Array<SelectOption<GameFormat>>(
      { value: null, label: "" },
      ...displayValueRecordToSelectOptions(displayValueService.gameFormatDisplayValues)
    ),
    []
  );
  //#endregion

  //#region Rendering ---------------------------------------------------------
  return (
    <Dialog
      className={props.className}
      icon={getDialogIcon()}
      isOpen={props.isOpen}
      title={getTitle()}
    >
      <DialogBody>
        {deck && renderForm()}
      </DialogBody>
      <DialogFooter actions={renderActions()} />
    </Dialog>
  );

  function renderActions(): React.JSX.Element {
    return (
      <>
        <Button
          disabled={deck?.hasChanges ? false : true}
          icon="floppy-disk"
          onClick={() => props.onSave(deck)}
        >
          Save
        </Button>
        <Button
          icon="cross"
          onClick={props.onCancel}
        >
          Cancel
        </Button>
      </>
    );
  }

  function renderForm(): React.JSX.Element {
    return (
      <SectionCard padded={false}>
        <FormGroup
          key="deck-name"
          label="Name"
          labelFor="deck-name"
          labelInfo="required"
        >
          <InputGroup
            id="deck-name"
            inputMode="text"
            onChange={
              handleStringChange((value: string) => {
                const newViewmodel = cloneDeep(deck);
                newViewmodel.name = value;
                setDeck(newViewmodel);
              })
            }
            small={true}
            value={deck.name}
          />
        </FormGroup>
        <FormGroup
          key="deck-description"
          label="Description"
          labelFor="deck-description"
        >
          <TextArea
            autoResize={true}
            fill={true}
            onChange={handleStringChange((value: string) => {
              const newViewmodel = cloneDeep(deck);
              newViewmodel.description = value;
              setDeck(newViewmodel);
            })}
            value={deck.description ?? ""}
          />
        </FormGroup>
        {
          !deck.isFolder &&

          <FormGroup
            fill={true}
            key="target-format"
            label="Target Game Format"
            labelFor="deck-target-format"
          >
            <HTMLSelect
              id="card-sync-type"
              minimal={true}
              onChange={
                handleValueChange((value: GameFormat) => {
                  const newState = cloneDeep(deck);
                  newState.targetFormat = value;
                  setDeck(newState);
                })
              }
              options={gameFormats}
              value={deck.targetFormat}
            />
          </FormGroup>
        }
      </SectionCard>
    );
  }

  function getDialogIcon(): React.JSX.Element {
    if (props.deck) {
      if (props.deck.isFolder) {
        if (props.dialogAction == "create") {
          return (<Icon icon="folder-new" />);
        } else {
          return (<Icon icon="folder-close" />);
        }
      } else {
        return (<SvgProvider svg={props.deckSvg} />);
      }
    } else {
      return undefined;
    }
  }

  function getTitle(): string {
    if (props.deck) {
      if (props.deck.isFolder) {
        if (props.dialogAction == "create") {
          return "Create folder";
        } else {
          return "Edit folder";
        }
      } else {
        if (props.dialogAction == "create") {
          return "Create deck";
        } else {
          return "Edit deck";
        }
      }
    } else {
      return "";
    }
  }
  //#endregion
}
