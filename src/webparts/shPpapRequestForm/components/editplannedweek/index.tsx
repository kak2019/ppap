import * as React from "react";
import { memo, useEffect, useCallback } from "react";
import {
  Spinner,
  Separator,
  ScrollablePane,
  Stack,
  Overlay,
  ScrollbarVisibility,
  DefaultButton,
} from "office-ui-fabric-react";
import {
  ListView,
  IViewField,
  SelectionMode,
  GroupOrder,
  IGrouping,
} from "@pnp/spfx-controls-react/lib/ListView";

import { useOrders,useUrlQueryParam } from "../../common/hooks";
import { IOrdersListItem } from "../../common/model";
import EditableText from "../editabletext";
import { returnToSource } from "../../common/utils";

export default memo(function index() {
  const [isFetching, orders, , fetchAllOrders, editOrderPartInfo, , , ,] =
    useOrders();
  const [sourcePage]= useUrlQueryParam(["Source"]);

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const handlePartPlannedWeekChange = (item: IOrdersListItem): void => {
    editOrderPartInfo({ order: item });
  };

  //#region =========styles and templates===========
  const viewFields: IViewField[] = [
    {
      name: "PPAPOrderNumber",
      displayName: "OrderID",
      isResizable: true,
      sorting: true,
      minWidth: 0,
      maxWidth: 65,
      render: (rowitem: IOrdersListItem) => {
        return <EditableText value={rowitem.PPAPOrderNumber} />;
      },
    },
    {
      name: "ItemNbr",
      displayName: "PartID",
      isResizable: true,
      sorting: true,
      minWidth: 0,
      maxWidth: 65,
      render: (rowitem: IOrdersListItem) => {
        return <EditableText value={rowitem.ItemNbr} />;
      },
    },
    {
      name: "ItemNm",
      displayName: "Item Name",
      isResizable: true,
      sorting: true,
      minWidth: 0,
      maxWidth: 200,
      render: (rowitem: IOrdersListItem) => {
        return <EditableText value={rowitem.ItemNm} />;
      },
    },
    {
      name: "PPAPplannedweek",
      displayName: "Planned Week",
      isResizable: true,
      sorting: true,
      minWidth: 0,
      maxWidth: 85,
      render: useCallback(
        (rowitem: IOrdersListItem) => {
          return (
            <EditableText
              value={rowitem.PPAPplannedweek}
              onChange={(newValue: string): void =>
                handlePartPlannedWeekChange({
                  ...rowitem,
                  PPAPplannedweek: newValue,
                })
              }
              width={80}
              editable={true}
              placeholder="eg. 202312"
            />
          );
        },
        [orders]
      ),
    },
    {
      name: "PPAPPartWeightCode",
      displayName: "Part Weight Code",
      isResizable: true,
      sorting: true,
      minWidth: 0,
      maxWidth: 85,
      render: (rowitem: IOrdersListItem) => {
        return <EditableText value={rowitem.PPAPPartWeightCode} />;
      },
    },
    {
      name: "PPAPPartWeight",
      displayName: "Part Weight",
      isResizable: true,
      sorting: true,
      minWidth: 0,
      maxWidth: 65,
      render: (rowitem: IOrdersListItem) => {
        return <EditableText value={rowitem.PPAPPartWeight} />;
      },
    },
    {
      name: "SQANm",
      displayName: "SQE Name",
      isResizable: true,
      sorting: true,
      minWidth: 0,
      maxWidth: 150,
      render: (rowitem: IOrdersListItem) => {
        return <EditableText value={rowitem.SQANm} />;
      },
    },
    {
      name: "PARMANm",
      displayName: "PARMA Name",
      isResizable: true,
      sorting: true,
      minWidth: 0,
      maxWidth: 150,
      render: (rowitem: IOrdersListItem) => {
        return <EditableText value={rowitem.PARMANm} />;
      },
    },
  ];

  const groupByFields: IGrouping[] = React.useMemo(() => {
    return [
      {
        name: "PPAPOrderNumber",
        order: GroupOrder.ascending,
      },
    ];
  }, []);

  const rootContainerStyle: React.CSSProperties = React.useMemo(() => {
    return {
      height: 680,
      width: 1000,
    };
  }, []);

  //#endregion
  return (
    <div>
      <Separator alignContent="start" style={{ width: 1000 }}>
        <h2>Click PPAP planned week column from below to update:</h2>
      </Separator>
      {isFetching ? <Spinner /> : ""}
      <Stack verticalFill grow style={rootContainerStyle}>
        <Stack.Item
          grow
          style={{ position: "relative", backgroundColor: "white" }}
        >
          <ScrollablePane scrollbarVisibility={ScrollbarVisibility.auto}>
            {orders.length === 0 && (
              <div
                style={{
                  fontSize: "16px",
                  textAlign: "center",
                  fontWeight: "450",
                }}
              >
                No items
              </div>
            )}
            <ListView
              items={orders}
              viewFields={viewFields}
              groupByFields={groupByFields}
              compact={false}
              selectionMode={SelectionMode.none}
              filterPlaceHolder="Search..."
              showFilter={true}
            />
          </ScrollablePane>
          {isFetching && <Overlay />}
        </Stack.Item>
      </Stack>
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
        <DefaultButton
          onClick={() => returnToSource(sourcePage.Source) }
        >
          Close
        </DefaultButton>
      </Stack>
    </div>
  );
});
