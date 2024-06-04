import { Classes } from "@blueprintjs/core";
import * as React from "react";

import { DtoLanguage } from "../../../common/dto";

export const DARK_THEME = Classes.DARK;
export const LIGHT_THEME = "";
export const ThemeContext = React.createContext(DARK_THEME);

export const LanguagesContext = React.createContext(new Array<DtoLanguage>());
