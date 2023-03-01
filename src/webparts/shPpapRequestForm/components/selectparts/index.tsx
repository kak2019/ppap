import * as React from "react";
import { memo, useEffect, useCallback, useMemo, useState } from "react";
import {
  Spinner,
  PrimaryButton,
  Stack,
  Overlay,
  DefaultButton,
  DialogType,
  DialogFooter,
} from "office-ui-fabric-react";
import {
  ListView,
  IViewField,
  SelectionMode,
  GroupOrder,
  IGrouping,
} from "@pnp/spfx-controls-react/lib/ListView";
import { AnimatedDialog } from "@pnp/spfx-controls-react/lib/AnimatedDialog";

import { useOrders, useRequest, useUrlQueryParam } from "../../common/hooks";
import { IOrdersListItem, IRequestListItem } from "../../common/model";
import EditableText from "../editabletext";
import { returnToSource } from "../../common/utils";
import { RequestStatus } from "../../common/features/requests";

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
  const [isFetchingRequest, , , , addRequest, , , , , ,] = useRequest();
  const [sourcePage] = useUrlQueryParam(["Source"]);

  const selectedItemIds = useMemo(
    () => selectedItems.map((item) => item.ID),
    [selectedItems]
  );
  const [isStep1, setIsStep1] = useState(true);
  const [showAnimatedDialog, setShowAnimatedDialog] = useState(false);

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
  const handlePrevStep = (): void => {
    if (selectedItems.length > 0) {
      setShowAnimatedDialog(true);
    } else {
      setIsStep1(true);
    }
  };

  const handleSubmit = async (): Promise<void> => {
    let itemNbr: string = "";
    let isHeader = true;
    let firstItemName = "";
    selectedItems.forEach((order) => {
      editOrderPartInfo({ order: order });
      if (!isHeader) {
        itemNbr += ";";
      } else {
        isHeader = !isHeader;
        firstItemName = order.ItemNm;
      }
      itemNbr += order.ItemNbr;
    });
    // Create request
    const requestNew: IRequestListItem = {
      PartName: firstItemName,
      itemNumber: itemNbr,
      Status: "Creating",
      requestPartJSON: JSON.stringify(selectedItems),
    };
    await addRequest({ request: requestNew }).then(() => {
      if (isFetchingRequest === RequestStatus.Idle) {
        returnToSource(sourcePage.Source);
      }
    });
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

  // Properties of the dialog
  const animatedDialogContentProps = {
    type: DialogType.normal,
    title: "Warning - Data Loss",
    subText:
      "Back to previous step will clear the selection of parts and any other values inputed in current view. Do you want to continue?",
  };

  const animatedModalProps = {
    isDarkOverlay: true,
  };
  //#endregion
  return (
    <>
      <AnimatedDialog
        hidden={!showAnimatedDialog}
        onDismiss={() => {
          setShowAnimatedDialog(false);
        }}
        dialogContentProps={animatedDialogContentProps}
        modalProps={animatedModalProps}
      >
        <DialogFooter>
          <PrimaryButton
            onClick={() => {
              setShowAnimatedDialog(false);
              // Clear selection
              selectedItemIds.forEach((element) => {
                removeSelectedItemById(element);
              });
              setIsStep1(true);
            }}
            text="Yes"
          />
          <DefaultButton
            onClick={() => {
              setShowAnimatedDialog(false);
            }}
            text="No"
          />
        </DialogFooter>
      </AnimatedDialog>

      {isStep1 && (
        <div style={{ height: "640px" }}>
          <div style={{ height: "5%", lineHeight: "1em" }}>
            <h2>Select parts from below to add to the PPAP request:</h2>
          </div>
          <div style={{ height: "90%", overflow: "scroll" }}>
            <Stack style={{ width: 1000 }}>
              {isFetching !== 0 || isFetchingRequest !== 0 ? <Spinner /> : null}
              <ListView
                items={orders}
                viewFields={viewFields}
                groupByFields={groupByFields}
                compact={true}
                selectionMode={SelectionMode.multiple}
                selection={_getSelection}
                filterPlaceHolder="Search..."
                showFilter={true}
                //listClassName="plannedWeekLv"
              />
            </Stack>
          </div>
          <div style={{ height: "5%", lineHeight: "1em" }}>
            <h3>
              Selected items: {selectedItems.length > 0 && selectedItems.length}
            </h3>
          </div>
          {isFetching !== 0 || isFetchingRequest !== 0 ? <Overlay /> : null}
        </div>
      )}

      {!isStep1 && (
        <div style={{ height: "320px" }}>
          <div style={{ height: "10%", lineHeight: "1em" }}>
            <h2>Click weight columns to edit weight information</h2>
          </div>
          <div style={{ height: "90%", overflow: "scroll" }}>
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
          </div>
        </div>
      )}

      <div style={{ height: "80px", lineHeight: "4em" }}>
        {!isStep1 && (
          <DefaultButton disabled={isStep1} onClick={handlePrevStep}>
            Previous Step
          </DefaultButton>
        )}{" "}
        {isStep1 && (
          <DefaultButton disabled={!isStep1} onClick={() => setIsStep1(false)}>
            Next Step
          </DefaultButton>
        )}{" "}
        {!isStep1 && selectedItems.length > 0 && (
          <PrimaryButton
            disabled={isStep1 || selectedItems.length === 0}
            onClick={handleSubmit}
          >
            Submit
          </PrimaryButton>
        )}{" "}
        <DefaultButton onClick={() => returnToSource(sourcePage.Source)}>
          Cancel
        </DefaultButton>
      </div>
    </>
  );
});
