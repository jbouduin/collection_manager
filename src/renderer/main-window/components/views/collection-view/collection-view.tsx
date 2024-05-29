import { Button, Card, Props } from "@blueprintjs/core";
import * as React from "react";
import { CardSyncOptions, SyncOptions, SyncParam } from "../../../../../common/ipc-params";

export function CollectionView(props: Props) {
  //#region event handling ----------------------------------------------------
  const syncbuttonClick = React.useCallback(
    () => {
      window.ipc.sync(getIds())
    },
    []
  )
  //#endregion

  //#region Main --------------------------------------------------------------
  return (
    <Card className={props.className}>
      <h1>Collection View</h1>
      <Button onClick={syncbuttonClick}>Sync every possible layout</Button>
    </Card>
  );
  //#endregion

  //#region Auxiliary methods -------------------------------------------------
  function getIds(): SyncParam<CardSyncOptions> {
    return {
      type: "Card",
      options: {
        setCode: null,
        source: "user",
        cardIds: [
          "ce4bc5b7-233c-4076-8268-7f9bd346ec55",
          "256de015-2f5b-46e5-b6e7-cdb16a8de369",
          "b60c121e-7ece-4cdd-959e-9eda2688d485",
          "3dd02ab2-9451-436b-bfee-9c8232388c92",
          "932cf326-68cc-45c8-a5b0-b493c52ddc60",
          "b55b89f2-158a-40c0-8969-279b04b89ced",
          "d8f8f403-7314-4f35-85ba-1548f12e2bed",
          "301f6df1-1b97-4a63-8043-8b97147b200b",
          "84f71a16-915d-4b8e-8c39-cc46bcaa9de9",
          "6f102b30-8bbf-48dd-ab21-437b7e5d9d92",
          "f6e9b6ca-418f-48ea-bffc-6a542581f5c6",
          "4727ec31-5118-4f0c-b149-bbd7f544d0a7",
          "354dff47-ef22-4475-b211-636cebcd0054",
          "388791c3-8b40-437a-b2f9-625e11884dee",
          "e3e8e3e3-b1a0-4e3f-a0f2-2f32d5978df2",
          "a9b7040e-cd24-42cc-b043-9af8c557da6a",
          "af07c47f-8b4e-43cb-b469-2efb82aa5590",
          "c38285af-e78f-406d-be37-25318e4dee9f",
          "932205d1-1e1f-493e-914b-bfe23c04543c",
          "b3ef371a-c63f-455f-8088-8aee1ee62040",
          "823214d3-a788-4c26-96c9-049bd4644d72",
          "952547ca-401f-45b4-acad-12a84012be74",
          "755ba96a-c5ac-4de5-be3c-3881403506aa",
          "72c0427d-4666-407d-b5f6-03836dff52ae",
          "cf4e9335-06e3-4b27-8fd8-3e44ece89a36",
          "9c8b02a2-cb9a-4891-9edc-a082be0b9fc3",
          "8f136f54-52c4-4c94-a0f7-cfd444dcbffb",
          "00b3d591-c07d-4cd8-87d8-6afa4d0a16a5",
          "f91878f1-8ba2-4a78-81b7-c24583654e5e",
          "5915b5b6-f992-410c-9905-d66064b1ea78",
          "eb0e2851-47d2-4db5-8dc3-38a22256f839",
          "4a8ec061-e7ae-4dba-9361-64b59e7012fb",
          "fa092ca6-813f-4694-87aa-e18086f84d62",
          "d6faf668-d7b4-4020-8835-d290ccdabac2",
          "e2163769-4d51-47ae-aa8b-c993392254b8",
          "40985522-4f83-4ada-b50f-e4618c760e0f",
          "f531cb03-edf0-4e46-9c89-e6e1a95112eb",
          "3c094ce7-683c-4ef5-8ac3-c930386da78f",
          "8b9b1f6c-2c72-4cbb-ac96-20b486e20ea5",
          "9badcc58-0281-499c-9e1f-5d894761ca61",
          "05c8de73-fd56-49fa-aa17-d04ff1847f8d",
          "c76fa1c6-6000-47b2-9188-9c15b2c73f8f",
          "b9e8b1fe-7a73-4a04-84fa-f0e4696c9121",
          "abd59e69-0dfe-4161-8e95-41be9ae07716",
          "44af3038-5106-42e3-b9ed-29db209de4d1",
          "ae3257ec-d5f3-4cfb-8446-cbeb236ee10e",
          "42ecb371-53aa-4368-8ddd-88ae8e90ae0c",
          "6d84e2d4-38bf-4d46-99a6-37c2dda66b16",
          "66141af7-6986-4671-9bca-f6852b529fcf",
          "3a9a8ccc-9802-4022-915a-112e42bf42bd",
          "9e5f9bc3-f467-44ce-8af2-c04178ddaf87",
          "22de7999-a382-463a-a4e1-91d577e7c06a",
          "c02cd12d-a095-4468-b89b-ad2ff456f8ae",
          "08b526b3-7f4c-4f42-9906-ffbdd310efbf",
          "27d8e671-8d7a-479d-987f-b3e4acd72b41",
          "79a840ed-91cf-45ea-bad2-757856e88544",
          "171eb68a-bce4-4518-a4d4-9ec90e92aa0b",
          "d9815e4d-729d-4cfe-ab54-12c58bc3099e",
          "cca1decc-90fd-4df8-997e-52f8789032f8",
          "d0f953c3-09b9-42c7-816d-59fb0f8b541c",
          "2c5ed737-657b-43bf-b222-941da7579a4a",
          "d67c7d80-05c9-4bd3-9a8e-14dfe4c075cd",
          "b3ccdedf-06b9-414e-9abe-643f86dab1eb",
          "9c1b54f1-692b-429e-b7cb-65bafdd161ca",
          "a00dc84f-e732-41d0-af1f-ae440197c519",
          "f2a0a4cc-b7cb-4f73-9f28-33920ab5d97f",
          "b1580646-92f4-477a-afab-156f5fd4019d",
          "0a721c6c-a563-413e-a613-edd30922c270",
          "bdc2e583-c9ce-48cc-99f2-e96f4bbae7d8",
          "7e703632-5ed0-4509-a12b-594269f865f1",
          "38a9c414-4d7f-4702-b7c5-8594610865d0",
          "b18132eb-d4ff-4505-ae07-6876fdc85a19",
          "6cfbc008-21c8-4345-b5ec-e4e360473aaa"
        ]
      }
    }

  }
  //#endregion
}
