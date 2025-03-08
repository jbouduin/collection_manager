import { Region } from "@blueprintjs/table";

export function selectedRegionTransformToRowSelection(region: Region): Region {
  if (region.cols) {
    return { rows: region.rows };
  } else {
    return region;
  }
}

export function onDataSelected<T>(selectedRegions: Array<Region>, data: Array<T>, callback: (selected: Array<T>) => void): void {
  // NOW this gives the wrong result if columns have been sorted
  const selectedData = new Array<T>();
  selectedRegions
    .filter((region: Region) => region.rows)
    .forEach((region: Region) => {
      const firstRow = region.rows[0];
      const lastRow = region.rows[1];
      for (let cnt = firstRow; cnt <= lastRow; cnt++) {
        selectedData.push(data[cnt]);
      }
    });
  callback(selectedData);
}
