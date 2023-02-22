import * as React from "react";
import { memo, useContext, useEffect, useCallback, useState } from "react";
import { DynamicForm } from "@pnp/spfx-controls-react/lib/DynamicForm";
import { useRequest, useUrlQueryParam } from "../../common/hooks";
import {
  DefaultButton,
  PrimaryButton,
  ScrollablePane,
  ScrollbarVisibility,
  SelectionMode,
  Separator,
  Spinner,
  Stack,
} from "office-ui-fabric-react";
import AppContext from "../../common/AppContext";
import { IDynamicFieldProps } from "@pnp/spfx-controls-react/lib/controls/dynamicForm/dynamicField";
import { IViewField, ListView } from "@pnp/spfx-controls-react";
import { dispToEdit, returnToSource } from "../../common/utils";

interface IDispFormProps {
  itemId: string;
  listId: string;
}
export default memo(function DisplayForm(props: IDispFormProps) {
  const [isFetching, request, fetchRequestById, , , , changeRequestListId] =
    useRequest();
  const ctx = useContext(AppContext);
  const [sourcePage] = useUrlQueryParam(["Source"]);
  useEffect(() => {
    if (props.itemId !== "" && props.listId !== "") {
      fetchRequestById(+props.itemId);
      changeRequestListId(props.listId);
    }
  }, [props]);
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

  const rootContainerStyle: React.CSSProperties = React.useMemo(() => {
    return {
      height: 280,
    };
  }, []);
  const hideField = useCallback(() => null, []);
  const renderSelectParts = useCallback(
    (
      fieldProperties: IDynamicFieldProps
    ): React.ReactElement<IDynamicFieldProps> => {
      const seletedItems = JSON.parse(fieldProperties.fieldDefaultValue);
      return (
        <>
          <Separator alignContent="start">
            <h3>Selected parts:</h3>
          </Separator>
          <Stack verticalFill grow style={rootContainerStyle}>
            <Stack.Item
              grow
              style={{ position: "relative", backgroundColor: "white" }}
            >
              <ScrollablePane scrollbarVisibility={ScrollbarVisibility.auto}>
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
                <ListView
                  items={seletedItems}
                  viewFields={viewFields}
                  compact={true}
                  selectionMode={SelectionMode.none}
                />
              </ScrollablePane>
            </Stack.Item>
          </Stack>
        </>
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
          listId={props.listId}
          listItemId={+props.itemId}
          disabled={true}
          fieldOverrides={{
            Title: hideField,
            requestPartJSON: renderSelectParts,
          }}
        />
      )}
      <Stack
        horizontal
        verticalAlign="center"
        wrap
        styles={{ root: { width: 800 } }}
        tokens={{
          childrenGap: "4%",
          padding: "m 4px",
        }}
      >
        <PrimaryButton onClick={() => dispToEdit()} disabled={isNotReady}>
          File Upload
        </PrimaryButton>

        <DefaultButton onClick={() => returnToSource(sourcePage.Source)}>
          Close
        </DefaultButton>
      </Stack>
    </div>
  );
});
