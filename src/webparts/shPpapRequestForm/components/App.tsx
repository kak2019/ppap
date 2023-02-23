import * as React from "react";
import { memo } from "react";
import { useUrlQueryParam } from "../common/hooks";
// import SubmissionListView from "./SubmitRequest/ListViewSubmit/SubmissionListView";
// import PlannedWeek from "./UpdatePlannedWeek/PlannedWeek";
import Renderdemo from "./UploadFile/Renderdemo";

import SelectParts from "./selectparts";
import EditPlannedWeek from "./editplannedweek";

export default memo(function App() {
  const [param] = useUrlQueryParam(["PlanEdit", "EditMode", "ID"]);
  /**
        EditFormUrl = "PathOfPage?EditMode=yes"
        NewFormUrl = "PathOfPage?ID=-1"
        DisplayFormUrl = PathOfPage
*/
  return (
    <>
      {param.PlanEdit === "1" && <EditPlannedWeek />}
      {param.ID === "-1" && <SelectParts />}
      {param.EditMode === "yes" && param.ID !== "" && +param.ID >= 0 && (
        <Renderdemo />
      )} 
    </>
  );
});
