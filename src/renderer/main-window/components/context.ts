import * as React from "react";

import { DtoLanguage } from "../../../common/dto";
import { CardSetViewmodel } from "../viewmodels";


export const ConfigurationContext = React.createContext(null);
export const LanguagesContext = React.createContext(new Array<DtoLanguage>());
export const CardSymbolContext = React.createContext(new Map<string, string>());
export const CardSetContext = React.createContext(new Array<CardSetViewmodel>());
