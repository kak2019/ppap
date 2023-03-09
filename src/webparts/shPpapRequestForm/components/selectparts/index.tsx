import * as React from "react";
import { memo, useEffect, useCallback, useMemo, useState, useContext } from "react";
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
import { IOrdersListItem, IRequestListItem, ISelectedOrdersListItem } from "../../common/model";
import EditableText from "../editabletext";
import { returnToSource } from "../../common/utils";
import { RequestStatus } from "../../common/features/requests";
import { Dialog } from "@microsoft/sp-dialog";
import AppContext from "../../common/AppContext";

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
  const ctx = useContext(AppContext);
  const userEmail = ctx.context._pageContext._user.email;
  const selectedItemIds = useMemo(
    () => selectedItems.map((item) => item.ID),
    [selectedItems]
  );
  const [isStep1, setIsStep1] = useState(true);
  const [showAnimatedDialog, setShowAnimatedDialog] = useState(false);
  const [supplierOrders, setSupplierOrders] = useState <IOrdersListItem[]>([]);
  
  useEffect(() => {
    fetchAllOrders();
    //setSupplierOrders([...(orders.filter((item) => item.SupplierEmail === userEmail))])
  }, []);
  let filtered = [...(orders.filter((item) => item.SupplierEmail === userEmail))];
   // setSupplierOrders(filtered);
  console.log(filtered);
  
  console.log(supplierOrders);
  const _getSelection = useCallback(
    (items: ISelectedOrdersListItem[]): void => {
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

  const handlePartWeightCodeChange = (item: ISelectedOrdersListItem): void => {
    //editOrderPartInfo({order:item});
    item.wcFlag = true;
    updateSelectedItem({ order: item });
  };
  const handlePartWeightChange = (item: ISelectedOrdersListItem): void => {
    //editOrderPartInfo({order:item});
    item.weightFlag = true;
    updateSelectedItem({ order: item });

  };
  const handleRevisionCodeChange = (item: ISelectedOrdersListItem): void => {
    //editOrderPartInfo({order:item});
    //let isValid = false;
    const rcRegex = new RegExp('^[ABCP][0-9][0-9]');
    const rcValid = rcRegex.test(item.RevisionCode);
    console.log("regex result" + rcValid);
    if(rcValid && (item.ItemValidIssue == item.RevisionCode)){
      item.rcFlag = true;
      updateSelectedItem({ order: item });
    }
   else{
    Dialog.alert("Revision code does not match with Item valid issue, please enter correct code.")
   }

  };
  const handleDrawingVersionChange = (item: ISelectedOrdersListItem): void => {
    //editOrderPartInfo({order:item});
    /*const dvRegex = new RegExp('[0-9][0-9]');
    const dvValid = dvRegex.test(item.DrawingVersion);
    if(dvValid){
      updateSelectedItem({ order: item });
    }
    else{
      Dialog.alert("Warning!! \nDrawing version is not same as GPS drawing number")
    }*/
    item.dvFlag = true;
      updateSelectedItem({ order: item });
      if(item.DrawingVersion !== item.GPSDrawingNumber){
        Dialog.alert("Warning!! \nDrawing version is not same as GPS drawing number")
      }
      
  };

  const handlePrevStep = (): void => {
    if (selectedItems.length > 0) {
      setShowAnimatedDialog(true);
    } else {
      setIsStep1(true);
    }
  };

  const handleNextStep =(): void => {
    const SQE = selectedItems[0].SQANm;
    const sameSQE =  selectedItems.every(x => x.SQANm === SQE);
    
    if(sameSQE){
      setIsStep1(false);}
    else{
      Dialog.alert("Only orders with same SQA could be grouped together. Please check if all selected orders have same SQA");
      }
  }

  const handleSubmit = async (): Promise<void> => {
    let itemNbr: string = "";
    let isHeader = true;
    let firstItemName = "";
    let flag = true;
    selectedItems.forEach((order) => {
      editOrderPartInfo({ order: order });
      if (!isHeader) {
        itemNbr += ";";
      } else {
        isHeader = !isHeader;
        firstItemName = order.ItemNm;
      }
      itemNbr += order.ItemNbr;
      flag = flag && order.rcFlag && order.dvFlag && order.wcFlag && order.weightFlag;
    });
    // Create request
    if(flag){
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
    }
    else{
      Dialog.alert("Please check if all the inputs are filled correctly");
    }

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
    {  
      name: "SQASection",  
      displayName: "SQA Section",  
      isResizable: true,  
      sorting: true,  
      minWidth: 0,  
      maxWidth: 150  
    },
    {  
      name: "SQACd",  
      displayName: "SQA Code",  
      isResizable: true,  
      sorting: true,  
      minWidth: 0,  
      maxWidth: 150  
    },
    {  
      name: "PPAPorderdate",  
      displayName: "PPAP Order Date",  
      isResizable: true,  
      sorting: true,  
      minWidth: 0,  
      maxWidth: 150  
    },
    {  
      name: "PPAPOrderarrweek",  
      displayName: "PPAP Order Arrival week",  
      isResizable: true,  
      sorting: true,  
      minWidth: 0,  
      maxWidth: 150  
    },
    {  
      name: "PPAP_x002d_Plan_x002d_Y",  
      displayName: "PPAP-Paln-Y",  
      isResizable: true,  
      sorting: true,  
      minWidth: 0,  
      maxWidth: 150  
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
    
  ];

  const selViewFields: IViewField[] = [
    {
      name: "PPAPOrderNumber",
      displayName: "OrderID",
      isResizable: true,
      sorting: true,
      minWidth: 0,
      maxWidth: 65,
      render: (rowitem: ISelectedOrdersListItem) => {
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
      render: (rowitem: ISelectedOrdersListItem) => {
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
      render: (rowitem: ISelectedOrdersListItem) => {
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
      render: (rowitem: ISelectedOrdersListItem) => {
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
        (rowitem: ISelectedOrdersListItem) => {
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
        (rowitem: ISelectedOrdersListItem) => {
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
      name: "RevisionCode",
      displayName: "Revision Code",
      isResizable: true,
      sorting: true,
      minWidth: 0,
      maxWidth: 65,
      render: useCallback(
        (rowitem: ISelectedOrdersListItem) => {
          return (
            <EditableText
              value={rowitem.RevisionCode}
              onChange={(newValue: string): void =>
                handleRevisionCodeChange({
                  ...rowitem,
                  RevisionCode: newValue,
                })
              }
              width={60}
              editable={true}
              placeholder="Type revision code"
            />
          );
        },
        [selectedItemIds]
      ),
    },
    {
      name: "DrawingVersion",
      displayName: "Drawing Version",
      isResizable: true,
      sorting: true,
      minWidth: 0,
      maxWidth: 65,
      render: useCallback(
        (rowitem: ISelectedOrdersListItem) => {
          return (
            <EditableText
              value={rowitem.DrawingVersion}
              onChange={(newValue: string): void =>
                handleDrawingVersionChange({
                  ...rowitem,
                  DrawingVersion: newValue,
                })
              }
              width={60}
              editable={true}
              placeholder="Type drawing version"
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
      render: (rowitem: ISelectedOrdersListItem) => {
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
      render: (rowitem: ISelectedOrdersListItem) => {
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
                items={filtered}
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
          <DefaultButton disabled={!isStep1} onClick={ handleNextStep}>
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
