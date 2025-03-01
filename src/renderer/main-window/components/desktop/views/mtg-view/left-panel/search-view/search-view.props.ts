import { Props } from "@blueprintjs/core";

export interface SearchViewProps extends Props {
  onSearch: (queryString: string) => void;
}
