import * as React from "react";
import { memo, useEffect, useState } from "react";
import { useRequest, useUrlQueryParam } from "../../common/hooks";
import {
  DefaultButton,
  DialogFooter,
  DialogType,
  PrimaryButton,
  Spinner,
} from "office-ui-fabric-react";
import { AnimatedDialog } from "@pnp/spfx-controls-react/lib/AnimatedDialog";
import { returnToSource } from "../../common/utils";
import Renderdemo from "../UploadFile/Renderdemo";

export default memo(function EditForm() {
  const [isFetching, request, itemId, fetchRequestById, , , , , ,] =
    useRequest();
  const [sourcePage] = useUrlQueryParam(["Source"]);

  useEffect(() => {
    if (itemId !== "") {
      fetchRequestById(+itemId);
    }
  }, []);
  const [isNotReady, setIsNotReady] = useState(true);
  const [showAnimatedDialog, setShowAnimatedDialog] = useState(false);

  useEffect(() => {
    if (request && request.RequestID && request.RequestID.length > 0) {
      setIsNotReady(false);
    }
    if (request && (request.RequestID === null || request.RequestID === "")) {
      setIsNotReady(true);
      setShowAnimatedDialog(true);
    }
  }, [request, isFetching]);
  //#region =========styles and templates===========
  // Properties of the dialog
  const animatedDialogContentProps = {
    type: DialogType.normal,
    title: "Missing Request ID",
    subText:
      "The request is creating. Please try again after the status is changed from Creating to New.",
  };

  const animatedModalProps = {
    isBlocking: true,
    isDarkOverlay: true,
  };

  //#endregion

  return (
    <div>
      {isFetching ? <Spinner /> : null}
      {!isFetching && (
        <>
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
                }}
                text="Close"
              />
            </DialogFooter>
          </AnimatedDialog>
          {!isNotReady && <Renderdemo />}
        </>
      )}
      <div style={{ height: "80px", lineHeight: "4em" }}>
        <DefaultButton onClick={() => returnToSource(sourcePage.Source)}>
          Close
        </DefaultButton>
      </div>
    </div>
  );
});
