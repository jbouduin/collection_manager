import * as React from "react";
import { CardConditionDto, LanguageDto } from "../../../common/dto";
import { CardSetViewmodel } from "../viewmodels";


export const ConfigurationContext = React.createContext(null);
export const LanguagesContext = React.createContext(new Array<LanguageDto>());
export const CardSymbolContext = React.createContext(new Map<string, string>());
export const CardSetContext = React.createContext(new Array<CardSetViewmodel>());
export const CardConditionContext = React.createContext(new Array<CardConditionDto>());
