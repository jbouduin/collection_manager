import React from "react";
import { DisplayValueService } from "./display-value.service";
import { IpcProxyService } from "./ipc-proxy.service";
import { CardConditionDto, GameFormatDto, LanguageDto, MtgCardSetDto, RendererConfigurationDto } from "../../../common/dto";


export const CardConditionContext = React.createContext<Array<CardConditionDto>>(new Array<CardConditionDto>());
export const CardSetContext = React.createContext<Array<MtgCardSetDto>>(new Array<MtgCardSetDto>());
export const CardSymbolContext = React.createContext<Map<string, string>>(new Map<string, string>());
export const ConfigurationContext = React.createContext<RendererConfigurationDto>(null);
export const GameFormatContext = React.createContext<Array<GameFormatDto>>(new Array<GameFormatDto>());
export const DisplayValueServiceContext = React.createContext<DisplayValueService>(null);
export const IpcProxyServiceContext = React.createContext<IpcProxyService>(null);
export const LanguagesContext = React.createContext<Array<LanguageDto>>(new Array<LanguageDto>());
