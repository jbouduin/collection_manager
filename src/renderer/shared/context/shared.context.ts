import React from "react";
import { DisplayValueService } from "./display-value.service";
import { IpcProxyService } from "./ipc-proxy.service";
import { ICardConditionDto, IGameFormatDto, ILanguageDto, IMtgCardSetDto, IRendererConfigurationDto } from "../../../common/dto";
import { ISplashContext } from "./splash-context";
import { IToastContext } from "./toast-context";


export const CardConditionContext = React.createContext<Array<ICardConditionDto>>(new Array<ICardConditionDto>());
export const CardSetContext = React.createContext<Array<IMtgCardSetDto>>(new Array<IMtgCardSetDto>());
export const CardSymbolContext = React.createContext<Map<string, string>>(new Map<string, string>());
export const ConfigurationContext = React.createContext<IRendererConfigurationDto>(null);
export const DisplayValueServiceContext = React.createContext<DisplayValueService>(null);
export const GameFormatContext = React.createContext<Array<IGameFormatDto>>(new Array<IGameFormatDto>());
export const IpcProxyServiceContext = React.createContext<IpcProxyService>(null);
export const LanguagesContext = React.createContext<Array<ILanguageDto>>(new Array<ILanguageDto>());
export const SplashContext = React.createContext<ISplashContext>(null);
export const ToastContext = React.createContext<IToastContext>(null);
