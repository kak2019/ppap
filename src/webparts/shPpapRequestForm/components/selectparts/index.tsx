import * as React from "react";
import { memo, useEffect, useCallback, useMemo, useState } from "react";
import {
  Spinner,
  PrimaryButton,
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

import { useOrders, useRequest, useUrlQueryParam } from "../../common/hooks";
import { IOrdersListItem, IRequestListItem } from "../../common/model";
import EditableText from "../editabletext";
import { returnToSource } from "../../common/utils";

export default memo(function index() {
  const [
    isFetching,
    orders,
    selectedItems,
    fetchAllOrders,
    editOrderPartInfo,
    updateSelectedItem,
    addSelectedItem,
    removeSelectedItemById,
  ] = useOrders();
  const [
    isFetchingRequest,
    ,
    ,
    addRequest,
  ] = useRequest();
  const [sourcePage] = useUrlQueryParam(["Source"]);

  const selectedItemIds = useMemo(
    () => selectedItems.map((item) => item.ID),
    [selectedItems]
  );
  const [isStep1, setIsStep1] = useState(true);

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const _getSelection = useCallback(
    (items: IOrdersListItem[]): void => {
      const itemIds = items.map((el) => el.ID);
      if (itemIds.sort().toString() === selectedItemIds.sort().toString())
        return;

      // if selectId in paginatedIds and not in itemIds, then remove from seletedItems
      selectedItemIds.forEach((element) => {
        if (itemIds.indexOf(element) === -1) {
          removeSelectedItemById(element);
        }
      });

      items.forEach((element) => {
        addSelectedItem({ order: element });
      });

      //handleForceupdateMethod();
    },
    [selectedItemIds]
  );

  const handlePartWeightCodeChange = (item: IOrdersListItem): void => {
    //editOrderPartInfo({order:item});
    updateSelectedItem({ order: item });
  };
  const handlePartWeightChange = (item: IOrdersListItem): void => {
    //editOrderPartInfo({order:item});
    updateSelectedItem({ order: item });
  };
  const handleSubmit =  (): void => {
    let itemNbr: string = "";
    let isHeader = true;
    selectedItems.forEach((order) => {
      editOrderPartInfo({ order: order });
      if (!isHeader) {
        itemNbr += ";";
      } else {
        isHeader = !isHeader;
      }
      itemNbr += order.ItemNbr;
    });
    // Create request
    const requestNew: IRequestListItem = {
      itemNumber: itemNbr,
      Status: "Creating",
      requestPartJSON: JSON.stringify(selectedItems),
    };
    addRequest({ request: requestNew });
    setTimeout(()=>{if (!isFetchingRequest) returnToSource(sourcePage.Source)},0);
    
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

  const selViewFields: IViewField[] = [
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
      render: (rowitem: IOrdersListItem) => {
        return <EditableText value={rowitem.PPAPplannedweek} />;
      },
    },
    {
      name: "PPAPPartWeightCode",
      displayName: "Part Weight Code",
      isResizable: true,
      sorting: true,
      minWidth: 0,
      maxWidth: 85,
      render: useCallback(
        (rowitem: IOrdersListItem) => {
          return (
            <EditableText
              value={rowitem.PPAPPartWeightCode}
              onChange={(newValue: string): void =>
                handlePartWeightCodeChange({
                  ...rowitem,
                  PPAPPartWeightCode: newValue,
                })
              }
              width={80}
              editable={true}
              placeholder="Type Weight Code"
            />
          );
        },
        [selectedItemIds]
      ),
    },
    {
      name: "PPAPPartWeight",
      displayName: "Part Weight",
      isResizable: true,
      sorting: true,
      minWidth: 0,
      maxWidth: 65,
      render: useCallback(
        (rowitem: IOrdersListItem) => {
          return (
            <EditableText
              value={rowitem.PPAPPartWeight}
              onChange={(newValue: string): void =>
                handlePartWeightChange({
                  ...rowitem,
                  PPAPPartWeight: newValue,
                })
              }
              width={60}
              editable={true}
              placeholder="Type Weight"
            />
          );
        },
        [selectedItemIds]
      ),
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
      height: 480,
      width: 1000,
    };
  }, []);
  //#endregion
  return (
    <div>
      <Separator alignContent="start">
        <h2>
          {isStep1
            ? "Select parts from below to add to the PPAP request:"
            : "Click weight columns to edit weight information"}
        </h2>
      </Separator>
      {isFetching || isFetchingRequest ? <Spinner /> : null}
      {isStep1 && (
        <>
          <Stack verticalFill grow style={rootContainerStyle}>
            <Stack.Item
              grow
              style={{ position: "relative", backgroundColor: "white" }}
            >
              <ScrollablePane scrollbarVisibility={ScrollbarVisibility.auto}>
                <ListView
                  items={orders}
                  viewFields={viewFields}
                  groupByFields={groupByFields}
                  compact={true}
                  selectionMode={SelectionMode.multiple}
                  selection={_getSelection}
                  filterPlaceHolder="Search..."
                  showFilter={true}
                  //stickyHeader={flag} //Not real use this prop, just use flag to force update
                />
              </ScrollablePane>
              {(isFetching || isFetchingRequest) && <Overlay />}
            </Stack.Item>
          </Stack>
          <Separator alignContent="start">
            <h3>
              Selected items: {selectedItems.length > 0 && selectedItems.length}
            </h3>
          </Separator>
        </>
      )}
      {!isStep1 && (
        <>
          {selectedItems.length > 0 && (
            <Stack style={{ width: 1000 }}>
              <ListView
                items={selectedItems}
                viewFields={selViewFields}
                compact={false}
                selectionMode={SelectionMode.none}
              />
            </Stack>
          )}
          {selectedItems.length === 0 && (
            <div
              style={{
                fontSize: "16px",
                textAlign: "center",
                fontWeight: "450",
              }}
            >
              No items selected
            </div>
          )}
        </>
      )}

      <Stack
        horizontal
        verticalAlign="center"
        wrap
        styles={{ root: { width: 800 } }}
        tokens={{
          childrenGap: "8px",
          padding: "m 4px",
        }}
      >
        {!isStep1 && (
          <DefaultButton disabled={isStep1} onClick={() => setIsStep1(true)}>
            Previous Step
          </DefaultButton>
        )}
        {isStep1 && (
          <DefaultButton disabled={!isStep1} onClick={() => setIsStep1(false)}>
            Next Step
          </DefaultButton>
        )}
        {!isStep1 && selectedItems.length > 0 &&
          <PrimaryButton
            disabled={isStep1 || selectedItems.length === 0}
            onClick={handleSubmit}
          >
            Submit
          </PrimaryButton>
        }
        <DefaultButton onClick={() => returnToSource(sourcePage.Source)}>
          Cancel
        </DefaultButton>
      </Stack>
    </div>
  );
});
