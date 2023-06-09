import * as React from "react";
import { memo, useEffect, useCallback, useState, useContext } from "react";
import {
  Spinner,
  Stack,
  Overlay,
  DefaultButton,
  DialogFooter,
  PrimaryButton,
  DialogType
} from "office-ui-fabric-react";
import {
  ListView,
  IViewField,
  SelectionMode,
  GroupOrder,
  IGrouping
  
} from "@pnp/spfx-controls-react/lib/ListView";

import { useOrders, useUrlQueryParam } from "../../common/hooks";
import { IOrdersListItem } from "../../common/model";
import EditableText from "../editabletext";
import { returnToSource } from "../../common/utils";
import { AnimatedDialog } from "@pnp/spfx-controls-react";
import { Dialog } from "@microsoft/sp-dialog";
import AppContext from "../../common/AppContext";

export default memo(function index() {
  const [isFetching, orders, , fetchAllOrders, editOrderPartInfo, , , ,] =
    useOrders();
  const [sourcePage] = useUrlQueryParam(["Source"]);
  const currentYear = new Date().getFullYear();
  const [showAnimatedDialog, setshowAnimatedDialog] = useState(false); 
  useEffect(() => {
    fetchAllOrders();
  }, []);
  const animatedDialogContentProps = {
    type: DialogType.normal,
    title: "Planned week format is not valid",
    subText:
      "Please enter correct format current year followed by week number, eg. " + currentYear +"15" ,
  };
  const animatedModalProps = {
   // isBlocking: true,
    isDarkOverlay: true,
  };
  const ctx = useContext(AppContext);
  const userEmail = (ctx.context._pageContext._user.email);
  const handlePartPlannedWeekChange = (item: IOrdersListItem): void => {
    //let isValid = false;
   
    const weekRegex = new RegExp(currentYear +'[0-5][0-9]');
    let valid = weekRegex.test(item.PPAPplannedweek);
     
    console.log("regex result" + valid);
    if(valid === true){
      editOrderPartInfo({ order: item });
    }
    else{
      Dialog.alert("Please enter correct format current year followed by week number, eg. " + currentYear +"15" )
    }
     
  };

  //#region =========styles and templates===========
  const viewFields: IViewField[] = [
    {
      name: "PPAPOrderNumber",
      displayName: "OrderID",
      isResizable: true,
      sorting: true,
      minWidth: 65,
      maxWidth: 200,
      render: (rowitem: IOrdersListItem) => {
        return <EditableText value={rowitem.PPAPOrderNumber} />;
      },
    },
    {
      name: "ItemNbr",
      displayName: "PartID",
      isResizable: true,
      sorting: true,
      minWidth: 65,
      maxWidth: 200,
      render: (rowitem: IOrdersListItem) => {
        return <EditableText value={rowitem.ItemNbr} />;
      },
    },
    {
      name: "ItemNm",
      displayName: "Item Name",
      isResizable: true,
      sorting: true,
      minWidth: 200,
      maxWidth: 500,
      render: (rowitem: IOrdersListItem) => {
        return <EditableText value={rowitem.ItemNm} />;
      },
    },
    {
      name: "PPAPplannedweek",
      displayName: "Planned Week",
      isResizable: true,
      sorting: true,
      minWidth: 135,
      maxWidth: 200,
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
              width={130}
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
      minWidth: 135,
      maxWidth: 200,
      render: (rowitem: IOrdersListItem) => {
        return <EditableText value={rowitem.PPAPPartWeightCode} />;
      },
    },
    {
      name: "PPAPPartWeight",
      displayName: "Part Weight",
      isResizable: true,
      sorting: true,
      minWidth: 135,
      maxWidth: 200,
      render: (rowitem: IOrdersListItem) => {
        return <EditableText value={rowitem.PPAPPartWeight} />;
      },
    },
    {
      name: "SQANm",
      displayName: "SQE Name",
      isResizable: true,
      sorting: true,
      minWidth: 150,
      maxWidth: 350,
      render: (rowitem: IOrdersListItem) => {
        return <EditableText value={rowitem.SQANm} />;
      },
    },
    {
      name: "PARMANm",
      displayName: "PARMA Name",
      isResizable: true,
      sorting: true,
      minWidth: 150,
      maxWidth: 350,
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

  //#endregion
  return (
    <div style={{ height: "640px" }}>
      <div style={{ height: "5%", lineHeight: "1em" }}>
        <h2>Click PPAP planned week column from below to update:</h2>
      </div>
      <div style={{ height: "85%", overflow: "scroll" }}>
        {isFetching ? <Spinner /> : ""}

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
        <Stack style={{ width: 1000 }}><ListView
          items={orders}
          viewFields={viewFields}
          groupByFields={groupByFields}
          compact={false}
          selectionMode={SelectionMode.none}
          filterPlaceHolder="Search..."
          showFilter={true}
          //listClassName="plannedWeekLv"
          />
        {isFetching !== 0 && <Overlay />}</Stack>
        
      </div>
           
      <div style={{ height: "10%", lineHeight: "4em" }}>
        <DefaultButton onClick={() => returnToSource(sourcePage.Source)}>
          Close
        </DefaultButton>
      </div>
           
      <AnimatedDialog
     hidden={!showAnimatedDialog}
      onDismiss={() => {
        returnToSource(sourcePage.Source);
      }}
      dialogContentProps={animatedDialogContentProps}
      modalProps={animatedModalProps}
    >
      <DialogFooter>
        <PrimaryButton
          onClick={() => {
            returnToSource(sourcePage.Source);
            setshowAnimatedDialog(false);
          }}
          text="Close"
        />
      </DialogFooter>
    </AnimatedDialog>
     
    </div>
 
  );
});
