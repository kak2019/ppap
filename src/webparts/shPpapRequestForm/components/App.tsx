import * as React from "react";
import { memo, useEffect } from 'react';
import { useUrlQueryParam } from "../common/hooks";
// import SubmissionListView from "./SubmitRequest/ListViewSubmit/SubmissionListView";
// import PlannedWeek from "./UpdatePlannedWeek/PlannedWeek";

import SelectParts from "./selectparts";
import EditPlannedWeek from "./editplannedweek";
import Dispform from "./dispform";
import Editform from "./editform";
import { useRequest } from "../common/hooks/useRequest";

export default memo(function App() {
  const [param] = useUrlQueryParam(["PlanEdit", "EditMode", "ID", "List"]);
  const [
    ,
    ,
    requestId,
    ,
    ,
    ,
    ,
    chnageRequestId,
    changeRequestListId,
  ] = useRequest();

  useEffect(()=>{
    chnageRequestId(param.ID);
    changeRequestListId(param.List);
  },[param])
  /**
        EditFormUrl = "PathOfPage?EditMode=yes"
        NewFormUrl = "PathOfPage?ID=-1"
        DisplayFormUrl = PathOfPage
*/
  return (
   <>
      {param.PlanEdit === "1" && <EditPlannedWeek />}
      {requestId === "-1" && <SelectParts />}
      {param.EditMode === "yes" && requestId !== "" && +requestId >= 0 && (
        <Editform />
      )}
      {param.EditMode === "" && requestId !== "" && +requestId >= 0 && (
        <Dispform/>
      )}
    </>
  );
});
