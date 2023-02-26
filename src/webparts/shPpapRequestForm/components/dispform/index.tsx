import * as React from "react";
import { memo, useContext, useEffect, useCallback, useState } from "react";
import { DynamicForm } from "@pnp/spfx-controls-react/lib/DynamicForm";
import { useRequest, useUrlQueryParam } from "../../common/hooks";
import {
  DefaultButton,
  PrimaryButton,
  SelectionMode,
  Spinner,
  Stack,
} from "office-ui-fabric-react";
import AppContext from "../../common/AppContext";
import { IDynamicFieldProps } from "@pnp/spfx-controls-react/lib/controls/dynamicForm/dynamicField";
import { IViewField, ListView } from "@pnp/spfx-controls-react";
import { dispToEdit, returnToSource } from "../../common/utils";

export default memo(function DisplayForm() {
  const [isFetching, request, itemId, fetchRequestById, , listId, , , ,] =
    useRequest();
  const ctx = useContext(AppContext);
  const [sourcePage] = useUrlQueryParam(["Source"]);
  useEffect(() => {
    if (itemId !== "") {
      fetchRequestById(+itemId);
    }
  }, []);
  const [isNotReady, setIsNotReady] = useState(true);

  useEffect(() => {
    if (request?.RequestID?.length > 0) {
      setIsNotReady(false);
    }
  }, [request]);
  //#region =========styles and templates===========
  const viewFields: IViewField[] = [
    {
      name: "PPAPOrderNumber",
      displayName: "OrderID",
      isResizable: true,
      sorting: true,
      minWidth: 0,
      maxWidth: 65,
    },
    {
      name: "ItemNbr",
      displayName: "PartID",
      isResizable: true,
      sorting: true,
      minWidth: 0,
      maxWidth: 65,
    },
    {
      name: "ItemNm",
      displayName: "Item Name",
      isResizable: true,
      sorting: true,
      minWidth: 0,
      maxWidth: 200,
    },
    {
      name: "PPAPplannedweek",
      displayName: "Planned Week",
      isResizable: true,
      sorting: true,
      minWidth: 0,
      maxWidth: 85,
    },
    {
      name: "PPAPPartWeightCode",
      displayName: "Part Weight Code",
      isResizable: false,
      sorting: true,
      minWidth: 0,
      maxWidth: 85,
    },
    {
      name: "PPAPPartWeight",
      displayName: "Part Weight",
      isResizable: true,
      sorting: true,
      minWidth: 0,
      maxWidth: 65,
    },
    {
      name: "SQANm",
      displayName: "SQE Name",
      isResizable: true,
      sorting: true,
      minWidth: 0,
      maxWidth: 150,
    },
    {
      name: "PARMANm",
      displayName: "PARMA Name",
      isResizable: true,
      sorting: true,
      minWidth: 0,
      maxWidth: 150,
    },
  ];

  const hideField = useCallback(() => null, []);
  const renderSelectParts = useCallback(
    (
      fieldProperties: IDynamicFieldProps
    ): React.ReactElement<IDynamicFieldProps> => {
      const seletedItems = JSON.parse(fieldProperties.fieldDefaultValue);
      return (
        <div style={{ height: "280px" }}>
          <div style={{ height: "10%", lineHeight: "1em" }}>
            <h3>Selected parts:</h3>
          </div>
          <div style={{ height: "90%", overflow: "scroll" }}>
            <Stack style={{ width: 1000 }}>
              <ListView
                items={seletedItems}
                viewFields={viewFields}
                compact={true}
                selectionMode={SelectionMode.none}
              />
              {!seletedItems && (
                <div
                  style={{
                    fontSize: "16px",
                    textAlign: "center",
                    fontWeight: "450",
                  }}
                >
                  No parts selected
                </div>
              )}
            </Stack>
          </div>
        </div>
      );
    },
    []
  );

  //#endregion

  return (
    <div>
      {isFetching ? <Spinner /> : ""}
      {!isFetching && (
        <DynamicForm
          context={ctx.context}
          listId={listId}
          listItemId={+itemId}
          disabled={true}
          fieldOverrides={{
            Title: hideField,
            requestPartJSON: renderSelectParts,
          }}
        />
      )}
      <div style={{ height: "80px", lineHeight: "4em" }}>
        <PrimaryButton onClick={() => dispToEdit()} disabled={isNotReady}>
          File Upload
        </PrimaryButton>{" "}
        <DefaultButton onClick={() => returnToSource(sourcePage.Source)}>
          Close
        </DefaultButton>
      </div>
    </div>
  );
});
