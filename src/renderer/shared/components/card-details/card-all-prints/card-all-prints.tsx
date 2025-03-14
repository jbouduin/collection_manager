import { SectionCard, Tooltip } from "@blueprintjs/core";
import classNames from "classnames";
import * as React from "react";
import { ILanguageDto, IMtgCardLanguageDto, IMtgCardOtherPrint, IMtgCardSetDto } from "../../../../../common/dto";
import { CardSetContext, IpcProxyService, IpcProxyServiceContext, LanguagesContext } from "../../../context";
import { SvgProvider } from "../../svg-provider";
import { compareClassNameProp, getRarityColorClassname } from "../../utils";
import { CardAllPrintsProps } from "./card-all-prints.props";


export const CardAllPrints = React.memo(
  (props: CardAllPrintsProps) => {
    //#region State -------------------------------------------------------------
    const [state, setState] = React.useState<Array<IMtgCardOtherPrint>>(null);
    //#endregion

    //#region Context ---------------------------------------------------------------------
    const ipcProxyService = React.useContext<IpcProxyService>(IpcProxyServiceContext);
    const cardSetContext = React.useContext<Array<IMtgCardSetDto>>(CardSetContext);
    const languagesContext = React.useContext<Array<ILanguageDto>>(LanguagesContext);
    //#endregion

    //#region Effects -----------------------------------------------------------
    React.useEffect(
      () => {
        if (props.oracleId) {
          void ipcProxyService.getData(`/card/${props.cardId}/all-prints`)
            .then(
              (queryResult: Array<IMtgCardOtherPrint>) => setState(queryResult),
              (_r: Error) => setState(null)
            );
        } else {
          setState(null);
        }
      },
      [props.oracleId]
    );
    //#endregion

    //#region Rendering ---------------------------------------------------------
    return state
      ? renderSectionCard()
      : null;

    function renderSectionCard(): React.JSX.Element {
      return (
        <SectionCard padded={false}>
          {
            state.sort((a: IMtgCardOtherPrint, b: IMtgCardOtherPrint) => a.released_at.getTime() - b.released_at.getTime())
              .map((o: IMtgCardOtherPrint, idx: number) => renderSinglePrint(o, idx, idx == state.length - 1))
          }
        </SectionCard>
      );
    }

    function renderSinglePrint(print: IMtgCardOtherPrint, idx: number, isLast: boolean): React.JSX.Element {
      const set = cardSetContext.find((s: IMtgCardSetDto) => s.id == print.set_id);
      return (
        <div key={`p-${idx}`} style={{ display: "flex", flexDirection: "column" }}>
          <div key={`p-${idx}`} style={{ display: "flex", flexDirection: "row" }}>
            <div style={{ flexGrow: "1", alignContent: "center" }}>
              <SvgProvider
                className={getRarityColorClassname(print.rarity)}
                height={16}
                svg={set.svg}
                width={16}
              />
              {set.name}
              <br />
              {
                print.languages
                  .map((language: IMtgCardLanguageDto) => {
                    const languageDef = languagesContext.find((lng: ILanguageDto) => lng.id == language.lang);
                    return languageDef ? languageDef.button_text : language.lang;
                  })
                  .join(", ")
              }
            </div>
            <div>
              <Tooltip
                compact={true}
                content={
                  <div style={{ height: "400px" }}>
                    <img
                      src={`cached-image://${print.id}/?size=large&side=front`}
                      style={{ height: "100%" }}
                    />
                  </div>
                }
              >
                <img
                  src={`cached-image://${print.id}/?size=small&side=front`}
                  style={{ width: "60px", height: "100%" }}
                />
              </Tooltip>
            </div>
          </div>
          {
            !isLast &&
            <p className={classNames("bp5-divider", "ruling-divider")} />
          }
        </div>
      );
    }
    //#endregion
  },
  (prev: CardAllPrintsProps, next: CardAllPrintsProps) => {
    return prev.oracleId == next.oracleId && compareClassNameProp(prev.className, next.className);
  }
);
