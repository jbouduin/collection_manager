import { Button, InputGroup, Label, TextArea } from "@blueprintjs/core";
import React from "react";
import { CommittableTextEditorProps } from "./committable-text-editor.props";
import { CommittableTextEditorState } from "./committable-text-editor.state";
import { CommittableTextEditorViewmodel } from "./committable-text-editor.viewmodel";
import { handleStringChange } from "../utils/change-handlers";

export function CommittableTextEditor(props: CommittableTextEditorProps) {
  //#region auxiliary constants -----------------------------------------------
  const save_button_id = "##save_button''";
  const cancel_button_id = "##cancel_button";
  //#endregion

  //#region State -------------------------------------------------------------
  const [state, setState] = React.useState<CommittableTextEditorState>(undefined);
  //#endregion

  //#region Effects -----------------------------------------------------------
  React.useEffect(
    () => {
      const newState: CommittableTextEditorState = {
        value: new CommittableTextEditorViewmodel(props.orgValue, props.isNullable),
        readOnly: true
      };
      setState(newState);
    },
    []
  );
  //#endregion

  //#region Event handling ----------------------------------------------------
  function onClick(): void {
    const newState: CommittableTextEditorState = {
      value: state.value,
      readOnly: false
    };
    setState(newState);
  }

  function onChange(value: string): void {
    state.value.displayValue = value;
    const newState: CommittableTextEditorState = {
      value: state.value,
      readOnly: false
    };
    setState(newState);
  }

  function onBlur(e: React.FocusEvent): void {
    if (e.relatedTarget?.id != save_button_id && e.relatedTarget?.id != cancel_button_id) {
      const newState: CommittableTextEditorState = {
        value: state.value,
        readOnly: true
      };
      newState.value.cancelChanges();
      setState(newState);
    }
  }

  function onCancelInput(event: React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLInputElement>): void {
    event.preventDefault();
    const newState: CommittableTextEditorState = {
      value: state.value,
      readOnly: true
    };
    newState.value.cancelChanges();
    setState(newState);
  }

  function onCommitInput(): void {
    void props.onCommit(state.value.value)
      .then(() => {
        const newState: CommittableTextEditorState = {
          value: new CommittableTextEditorViewmodel(state.value.value, props.isNullable),
          readOnly: true
        };
        setState(newState);
      });
  }

  function onKeyDownInput(e: React.KeyboardEvent<HTMLInputElement>): void {
    switch (e.key) {
      case "Enter":
        onCommitInput();
        e.preventDefault();
        break;
      case "Escape":
        onCancelInput(e);
        break;
    }
  }
  //#endregion

  //#region Main --------------------------------------------------------------
  return (
    <>
      {
        state &&
        <div onBlur={(e) => onBlur(e)}>
          {
            !props.multiple && props.label && <>{getLabeledInputGroup()}</>
          }
          {
            !props.multiple && !props.label && <>{getInputGroup()}</>
          }
          {
            props.multiple && props.label && <div className="committable-input-wrapper">{getLabeledTextArea()}</div>
          }
          {
            props.multiple && !props.label && <div className="committable-input-wrapper">{getTextArea()}</div>
          }
        </div>
      }
    </>
  );
  //#endregion

  //#region Auxiliary functions -----------------------------------------------
  function getButtons(): React.JSX.Element {
    return (
      <>
        <Button
          icon="tick"
          id={save_button_id}
          intent="success"
          key={save_button_id}
          minimal
          onClick={onCommitInput}
        />
        <Button
          icon="cross"
          id={cancel_button_id}
          intent="danger"
          key={cancel_button_id}
          minimal
          onClick={onCancelInput}
        />
      </>
    );
  }

  function getTextArea(): React.JSX.Element {
    return (
      <>
        <TextArea
          fill={true}
          maxLength={2048}
          minLength={props.minlength}
          onChange={handleStringChange((value: string) => onChange(value))}
          onClick={() => onClick()}
          placeholder={props.placeholder}
          readOnly={state.readOnly}
          small
          value={state.value.displayValue}
        />
        {
          !state.readOnly &&
          <div className="committable-input-buttons">
            {getButtons()}
          </div>
        }
      </>
    );
  }

  function getLabeledTextArea(): React.JSX.Element {
    return (
      <Label>
        {props.label}
        {getTextArea()}
      </Label>
    );
  }

  function getInputGroup(): React.JSX.Element {
    return (
      <InputGroup
        maxLength={props.maxLength}
        minLength={props.minlength}
        multiple={props.multiple}
        onBlur={undefined}
        onChange={handleStringChange((value: string) => onChange(value))}
        onClick={() => onClick()}
        onKeyDown={onKeyDownInput}
        placeholder={props.placeholder}
        readOnly={state.readOnly}
        rightElement={!state.readOnly && <>{getButtons()}</>}
        small
        value={state.value.displayValue}
      />
    );
  }

  function getLabeledInputGroup(): React.JSX.Element {
    return (
      <Label>
        {props.label}
        {getInputGroup()}
      </Label>
    );
  }
  //#endregion
}
