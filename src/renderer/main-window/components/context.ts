import * as React from "react";
import { CardConditionDto, LanguageDto, MtgCardSetDto } from "../../../common/dto";


export const ConfigurationContext = React.createContext(null);
export const LanguagesContext = React.createContext(new Array<LanguageDto>());
export const CardSymbolContext = React.createContext(new Map<string, string>());
export const CardSetContext = React.createContext(new Array<MtgCardSetDto>());
export const CardConditionContext = React.createContext(new Array<CardConditionDto>());
