import { AnchorButton, Button, Classes, Dialog, DialogBody, DialogFooter, HTMLTable, Icon, Tab, Tabs } from "@blueprintjs/core";
import * as React from "react";

import { CardSetDialogProps } from "./card-set-dialog.props";
import { SvgProvider } from "../../svg-provider/svg-provider";
import { CardSetDetailsQueryOptions, QueryParam } from "../../../../../../common/ipc-params";
import { DtoCardSetDetails, DtoCardSetLanguage, DtoLanguage } from "../../../../../../common/dto";
import { CardSetDetailsViewmodel } from "../../../../viewmodels/card-set/card-set-details.viewmodel";

export function CardSetDialog(props: CardSetDialogProps) {
  console.log("cardsetdialog function");
  // NOW use a theme provider
  // NOW use  @blueprintjs/eslint-config

  const [cardSetDetails, setCardSetDetails] = React.useState<CardSetDetailsViewmodel>(undefined);

  React.useEffect(
    () => {
      if (props.cardSetId) {
        const setDetailQueryParam: QueryParam<CardSetDetailsQueryOptions> = {
          type: "CardSetDetails",
          options: { cardSetId: props.cardSetId }
        };
        window.ipc
          .query(setDetailQueryParam)
          .then((cardSetDetails: DtoCardSetDetails) => {
            console.log(cardSetDetails);
            setCardSetDetails(new CardSetDetailsViewmodel(cardSetDetails));
          });
      }
    },
    [props.cardSetId]
  );

  //#region main --------------------------------------------------------------
  return (
    <>
      {
        cardSetDetails &&
        <Dialog
          isOpen={props.isOpen}
          onClose={props.onClose}
          shouldReturnFocusOnClose={true}
          canEscapeKeyClose={true}
          isCloseButtonShown={true}
          title={renderTitle()}
          className={Classes.DARK}>
          <DialogBody>
            {
              renderBody()
            }
          </DialogBody>
          <DialogFooter actions={renderActions()} />
        </Dialog>
      }
    </>
  );
  // #endregion

  //#region Auxiliare methods -------------------------------------------------
  function renderTitle(): React.JSX.Element {
    return (
      <>
        <SvgProvider svg={props.cardSetSvg} />
        {cardSetDetails.cardSetName}
      </>
    );
  }

  function renderActions(): React.JSX.Element {
    return (
      <>
        <Button onClick={props.onClose}>Close</Button>
        <AnchorButton
          intent="primary"
          href={cardSetDetails.scryFallUri} text="View on Scryfall"
          target="_blank"
          icon="share"
        />
      </>
    );
  }

  function renderBody(): React.JSX.Element {
    return (
      <Tabs animate={true} id="set-detail-tabs" defaultSelectedTabId="core-details" renderActiveTabPanelOnly={true}>
        <Tab id="core-details" panel={renderMainPropertiesTable()} title="Main properties" />
        {
          cardSetDetails.isMultiLanguage &&
          <Tab id="language-details" panel={renderLanguagePropertiesTable()} title="Languages" />
        }
        <Tab id="other-details" panel={renderOtherPropertiesTable()} title="Other" />
      </Tabs>
    );
  }

  function renderMainPropertiesTable(): React.JSX.Element {
    return (
      <HTMLTable compact={true} bordered={false} border={0} width="100%">
        <tbody>
          {
            renderMainPropertiesTableLines()
          }
        </tbody>
      </HTMLTable>
    );
  }

  function renderMainPropertiesTableLines(): Array<React.JSX.Element> {
    const table = new Array<React.JSX.Element>();
    table.push((<tr><td>Name:</td><td>{cardSetDetails.cardSetName}</td></tr>));
    table.push((<tr><td>Type:</td><td>{cardSetDetails.cardSetType}</td></tr>));
    table.push((<tr><td>Block:</td><td>{cardSetDetails.block ?? "-"}</td></tr>));
    table.push((<tr><td>Release date:</td><td>{cardSetDetails.releaseDate.toLocaleDateString()}</td></tr>));
    table.push((<tr><td>Number of printed cards:</td><td>{cardSetDetails.numberOfPrintedCards}</td></tr>));
    table.push((<tr><td>Last synchronization:</td><td>{cardSetDetails.lastFullSynchronization}</td></tr>));
    if (!cardSetDetails.isFullSynchronized) {
      table.push((<tr><td colSpan={2}>More details are available after a full synchronization of the set</td></tr>));
    } else {
      table.push((<tr><td>Number of unique cards (by name):</td><td>{cardSetDetails.numberOfUniqueCards}</td></tr>));
      table.push((<tr><td>{cardSetDetails.isMultiLanguage ? "Languages:" : "Language"}</td><td>{cardSetDetails.getLanguagesOfSet(props.languages)}</td></tr>));
    }

    return table;
  }

  function renderOtherPropertiesTable(): React.JSX.Element {
    return (
      <HTMLTable compact={true} bordered={false} width="100%">
        <tbody>
          {
            renderOtherPropertiesTableLines()
          }
        </tbody>
      </HTMLTable>
    );
  }

  function renderOtherPropertiesTableLines(): Array<React.JSX.Element> {
    const table = new Array<React.JSX.Element>();
    table.push(
      (
        <tr>
          <td>Foil only set:</td>
          <td>
            {cardSetDetails.foilOnly && <Icon icon="tick" intent="success" />}
            {!cardSetDetails.foilOnly && <Icon icon="cross" intent="danger" />}
          </td>
        </tr>
      ));
    table.push(
      (
        <tr>
          <td>Non-Foil only set:</td>
          <td>
            {cardSetDetails.nonFoilOnly && <Icon icon="tick" intent="success" />}
            {!cardSetDetails.nonFoilOnly && <Icon icon="cross" intent="danger" />}
          </td>
        </tr>
      ));
    table.push(
      (
        <tr>
          <td>Digital:</td>
          <td>
            {cardSetDetails.digital && <Icon icon="tick" intent="success" />}
            {!cardSetDetails.digital && <Icon icon="cross" intent="danger" />}
          </td>
        </tr>
      ));
    table.push((<tr><td>MTG Online code:</td><td>{cardSetDetails.mtgOnlineCode}</td></tr>));
    table.push((<tr><td>Arena code:</td><td>{cardSetDetails.arenaCode}</td></tr>));
    table.push((<tr><td>TCG Player Id:</td><td>{cardSetDetails.tcgPlayerId}</td></tr>));
    return table;
  }

  function renderLanguagePropertiesTable(): React.JSX.Element {
    return (
      <HTMLTable compact={true} bordered={false} width="100%">
        <tbody>
          {
            renderLanguagePropertiesTableLines()
          }
        </tbody>
      </HTMLTable>
    );
  }

  function renderLanguagePropertiesTableLines(): Array<React.JSX.Element> {
    return cardSetDetails.languagesWithNumberOfCards.map((cardSetDetailsLanguage: DtoCardSetLanguage) => {
      return (
        <tr>
          <td>{props.languages.find((language: DtoLanguage) => language.id == cardSetDetailsLanguage.lang).display_text}:</td>
          <td>{`${cardSetDetailsLanguage.number_of_cards} cards`}</td>
        </tr>
      );
    });
  }
  //#endregion
}
