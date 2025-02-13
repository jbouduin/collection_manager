import { AnchorButton, Button, Classes, Dialog, DialogBody, DialogFooter, HTMLTable, Icon, Tab, Tabs } from "@blueprintjs/core";
import * as React from "react";
import { DtoCardSetDetails, DtoCardSetLanguage, DtoLanguage, RendererConfigurationDto } from "../../../../../common/dto";
import { CardSetDetailsQueryOptions, QueryParam } from "../../../../../common/ipc-params";
import { CardSetDetailsViewmodel } from "../../../viewmodels/card-set/card-set-details.viewmodel";
import { SvgProvider } from "../../common/svg-provider/svg-provider";
import { ConfigurationContext, LanguagesContext } from "../../context";
import { CardSetDialogProps } from "./card-set-dialog.props";
import { DisplayValueService, DisplayValueServiceContext } from "../../../../common/context";


export function CardSetDialog(props: CardSetDialogProps) {
  //#region State -------------------------------------------------------------
  const [cardSetDetails, setCardSetDetails] = React.useState<CardSetDetailsViewmodel>(undefined);
  //#endregion

  //#region Context -----------------------------------------------------------
  const displayValueService = React.useContext<DisplayValueService>(DisplayValueServiceContext);
  //#endregion

  //#region Effects -----------------------------------------------------------
  React.useEffect(
    () => {
      if (props.cardSetId) {
        const setDetailQueryParam: QueryParam<CardSetDetailsQueryOptions> = {
          type: "CardSetDetails",
          options: { cardSetId: props.cardSetId }
        };
        void window.ipc
          .query(setDetailQueryParam)
          .then((cardSetDetails: DtoCardSetDetails) => {
            setCardSetDetails(new CardSetDetailsViewmodel(cardSetDetails));
          });
      }
    },
    [props.cardSetId]
  );
  //#endregion

  //#region main --------------------------------------------------------------
  return (
    <>
      {
        cardSetDetails &&
        <ConfigurationContext.Consumer>
          {
            (configuration: RendererConfigurationDto) => (
              <Dialog
                canEscapeKeyClose={true}
                className={configuration.useDarkTheme ? Classes.DARK : ""}
                isCloseButtonShown={true}
                isOpen={props.isOpen}
                onClose={props.onDialogClose}
                shouldReturnFocusOnClose={true}
                title={renderTitle()}
              >
                <DialogBody>
                  {
                    renderBody()
                  }
                </DialogBody>
                <DialogFooter actions={renderActions()} />
              </Dialog>
            )
          }
        </ConfigurationContext.Consumer>
      }
    </>
  );
  // #endregion

  //#region Auxiliary rendering methods ---------------------------------------
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
        <Button onClick={props.onDialogClose}>Close</Button>
        <AnchorButton
          href={cardSetDetails.scryFallUri}
          icon="share"
          intent="primary"
          target="_blank"
          text="View on Scryfall"
        />
      </>
    );
  }

  function renderBody(): React.JSX.Element {
    return (
      <LanguagesContext.Consumer>
        {
          (languages: Array<DtoLanguage>) => (
            <Tabs
              animate={true}
              defaultSelectedTabId="core-details"
              id="set-detail-tabs"
              renderActiveTabPanelOnly={true}
            >
              <Tab id="core-details" panel={renderMainPropertiesTable(languages)} title="Main properties" />
              {
                cardSetDetails.isMultiLanguage &&
                <Tab id="language-details" panel={renderLanguagePropertiesTable(languages)} title="Languages" />
              }
              <Tab id="other-details" panel={renderOtherPropertiesTable()} title="Other" />
            </Tabs>
          )
        }
      </LanguagesContext.Consumer>
    );
  }

  function renderMainPropertiesTable(languages: Array<DtoLanguage>): React.JSX.Element {
    return (
      <HTMLTable
        border={0}
        bordered={false}
        compact={true}
        width="100%"
      >
        <tbody>
          {
            renderMainPropertiesTableLines(languages)
          }
        </tbody>
      </HTMLTable>
    );
  }

  function renderMainPropertiesTableLines(languages: Array<DtoLanguage>): Array<React.JSX.Element> {
    const table = new Array<React.JSX.Element>();
    table.push((
      <tr>
        <td style={{ paddingLeft: "0px" }}>Name:</td>
        <td style={{ paddingLeft: "0px" }}>{cardSetDetails.cardSetName}</td>
      </tr>
    ));
    table.push((
      <tr>
        <td style={{ paddingLeft: "0px" }}>Type:</td>
        <td style={{ paddingLeft: "0px" }}>{displayValueService.cardSetTypeDisplayValues.get(cardSetDetails.cardSetType)}</td>
      </tr>
    ));
    table.push((
      <tr>
        <td style={{ paddingLeft: "0px" }}>Block:</td>
        <td style={{ paddingLeft: "0px" }}>{cardSetDetails.block ?? "-"}</td>
      </tr>
    ));
    table.push((
      <tr>
        <td style={{ paddingLeft: "0px" }}>Release date:</td>
        <td style={{ paddingLeft: "0px" }}>{cardSetDetails.releaseDateString}</td>
      </tr>
    ));
    table.push((
      <tr>
        <td style={{ paddingLeft: "0px" }}>Number of printed cards:</td>
        <td style={{ paddingLeft: "0px" }}>{cardSetDetails.numberOfPrintedCards}</td>
      </tr>
    ));
    table.push((
      <tr>
        <td style={{ paddingLeft: "0px" }}>Last synchronization:</td>
        <td style={{ paddingLeft: "0px" }}>{cardSetDetails.lastFullSynchronizationString}</td>
      </tr>
    ));
    if (!cardSetDetails.isFullSynchronized) {
      table.push((
        <tr>
          <td colSpan={2} style={{ paddingLeft: "0px" }}>More details are available after a full synchronization of the set</td>
        </tr>
      ));
    } else {
      table.push((
        <tr>
          <td style={{ paddingLeft: "0px" }}>Number of unique cards (by name):</td>
          <td style={{ paddingLeft: "0px" }}>{cardSetDetails.numberOfUniqueCards}</td>
        </tr>
      ));
      table.push((
        <tr>
          <td style={{ paddingLeft: "0px" }}>{cardSetDetails.isMultiLanguage ? "Languages:" : "Language"}</td>
          <td style={{ paddingLeft: "0px" }}>{cardSetDetails.getLanguagesOfSet(languages)}</td>
        </tr>
      ));
    }
    return table;
  }

  function renderOtherPropertiesTable(): React.JSX.Element {
    return (
      <HTMLTable bordered={false} compact={true} width="100%">
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
    table.push((
      <tr>
        <td style={{ paddingLeft: "0px" }}>Foil only set:</td>
        <td style={{ paddingLeft: "0px" }}>
          {cardSetDetails.foilOnly && <Icon icon="tick" intent="success" />}
          {!cardSetDetails.foilOnly && <Icon icon="cross" intent="danger" />}
        </td>
      </tr>
    ));
    table.push((
      <tr>
        <td style={{ paddingLeft: "0px" }}>Non-Foil only set:</td>
        <td style={{ paddingLeft: "0px" }}>
          {cardSetDetails.nonFoilOnly && <Icon icon="tick" intent="success" />}
          {!cardSetDetails.nonFoilOnly && <Icon icon="cross" intent="danger" />}
        </td>
      </tr>
    ));
    table.push((
      <tr>
        <td style={{ paddingLeft: "0px" }}>Digital:</td>
        <td style={{ paddingLeft: "0px" }}>
          {cardSetDetails.digital && <Icon icon="tick" intent="success" />}
          {!cardSetDetails.digital && <Icon icon="cross" intent="danger" />}
        </td>
      </tr>
    ));
    table.push((
      <tr>
        <td style={{ paddingLeft: "0px" }}>MTG Online code:</td>
        <td style={{ paddingLeft: "0px" }}>{cardSetDetails.mtgOnlineCode}</td>
      </tr>
    ));
    table.push((
      <tr>
        <td style={{ paddingLeft: "0px" }}>Arena code:</td>
        <td style={{ paddingLeft: "0px" }}>{cardSetDetails.arenaCode}</td>
      </tr>
    ));
    table.push((
      <tr>
        <td style={{ paddingLeft: "0px" }}>TCG Player Id:</td>
        <td style={{ paddingLeft: "0px" }}>{cardSetDetails.tcgPlayerId}</td>
      </tr>
    ));
    return table;
  }

  function renderLanguagePropertiesTable(languages: Array<DtoLanguage>): React.JSX.Element {
    return (
      <HTMLTable bordered={false} compact={true} width="100%">
        <tbody>
          {
            renderLanguagePropertiesTableLines(languages)
          }
        </tbody>
      </HTMLTable>
    );
  }

  function renderLanguagePropertiesTableLines(languages: Array<DtoLanguage>): Array<React.JSX.Element> {
    return cardSetDetails.languagesWithNumberOfCards.map((cardSetDetailsLanguage: DtoCardSetLanguage) => {
      return (
        <tr>
          <td style={{ paddingLeft: "0px" }}>{languages.find((language: DtoLanguage) => language.id == cardSetDetailsLanguage.lang).display_text}:</td>
          <td style={{ paddingLeft: "0px" }}>{`${cardSetDetailsLanguage.number_of_cards} cards`}</td>
        </tr>
      );
    });
  }
  //#endregion
}
