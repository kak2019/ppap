import * as React from "react";
import styles from "../ShPpapRequestForm.module.scss";


import FileUploadMultiple from ".//Uploadfilenew";
import MultiFileUploadComponent from ".//MultiFileUploadComponent/MultiFileUploadComponent";
import { useRequest, useUrlQueryParam } from "../../common/hooks";
import { memo, useContext, useEffect, useCallback, useState } from "react";
import { MessageBar, MessageBarType, Toggle, Text, mergeStyles ,DefaultButton,} from '@fluentui/react';
import {  returnToSource } from "../../common/utils";
interface IDispFormProps {
  itemId: string;
  listId: string;
}
function Renderdemo(props: IDispFormProps)  {
  const [isFetching, request, fetchRequestById, , , , changeRequestListId] =
    useRequest();
    const [sourcePage] = useUrlQueryParam(["Source"]);
    useEffect(() => {
      if (props.itemId !== "" && props.listId !== "") {
        fetchRequestById(+props.itemId);
        changeRequestListId(props.listId);
      }
    }, [props]);
    const [isNotReady, setIsNotReady] = useState(true);
  
    useEffect(() => {
      if (request?.RequestID?.length > 0 &&request?.Status!="Creating") {
        setIsNotReady(false);
      }
    }, [request]);






  return (
    
    <section id="root">
      {isNotReady&&(<>
<MessageBar

messageBarType={MessageBarType.error}
> Please Wait item state is New</MessageBar>


<DefaultButton onClick={() => returnToSource(sourcePage.Source)}>
          Close
        </DefaultButton>
        </>
      )}
      {!isNotReady&&<div className={styles.welcome}>
        <h1 style={{ textAlign: "left" }}>Uploading Documments</h1>
        <FileUploadMultiple
          mainTitle="1.Design Records  "
          titleDiscription="  (UD Released drawing,PVP)"
          checkboxTitle="Mandatory"
          mandatoryBool={true}
          uploadFilePath={"Upload file/"+request.RequestID+"/1. Design Records"} fileUploadControlBool={true}

        ></FileUploadMultiple>


        <FileUploadMultiple
          mainTitle="2.Engineering Change Documents  "
          titleDiscription=""
          checkboxTitle="Not Applicable"
          mandatoryBool={false}
          uploadFilePath={"Upload file/"+request.RequestID+"/2. Engineering Change Documents"} fileUploadControlBool={false}></FileUploadMultiple>

        <FileUploadMultiple
          mainTitle="3. Customer Engineering Approval  "
          titleDiscription="DVP with PD signature"
          checkboxTitle="Mandatory"
          mandatoryBool={true}
          uploadFilePath={"Upload file/"+request.RequestID+"/3. Customer Engineering Approval"} fileUploadControlBool={true}></FileUploadMultiple>

        <FileUploadMultiple
          mainTitle="4. Design FMEA  "
          titleDiscription=""
          checkboxTitle="Not Applicable"
          mandatoryBool={false}
          uploadFilePath={"Upload file/"+request.RequestID+"/4. Design FMEA"} fileUploadControlBool={true}></FileUploadMultiple>

        <FileUploadMultiple
          mainTitle="5. Process Flow Diagrams  "
          titleDiscription=""
          checkboxTitle="Mandatory"
          mandatoryBool={true}
          uploadFilePath={"Upload file/"+request.RequestID+"/5. Process Flow Diagrams"} fileUploadControlBool={true}></FileUploadMultiple>

        <FileUploadMultiple
          mainTitle="6. Process FMEA  "
          titleDiscription=""
          checkboxTitle="Mandatory"
          mandatoryBool={true}
          uploadFilePath={"Upload file/"+request.RequestID+"/6. Process FMEA"} fileUploadControlBool={true}></FileUploadMultiple>

        <FileUploadMultiple
          mainTitle="7. Control Plan  "
          titleDiscription=""
          checkboxTitle="Mandatory"
          mandatoryBool={true}
          uploadFilePath={"Upload file/"+request.RequestID+"/7. Control Plan"} fileUploadControlBool={true}></FileUploadMultiple>

        <FileUploadMultiple
          mainTitle="8. Measurement System Analysis  "
          titleDiscription=""
          checkboxTitle="Not Applicable"
          mandatoryBool={false}
          uploadFilePath={"Upload file/"+request.RequestID+"/8. Measurement System Analysis"} fileUploadControlBool={true}></FileUploadMultiple>

        <div>
          <div style={{ textAlign: "left", float: "left" }}>

            <span><span className={styles.title}>9. Dimensional Results  </span> </span>
          </div>
          <div style={{ textAlign: "right", float: "right", justifyContent: "flex-end" }}><span>Mandatory</span> </div>
          <br></br>
          <MultiFileUploadComponent
            mainTitle="9. Dimensional Results  "
            childTtitle="<1.Dimension>"
            titleDiscription=""
            checkboxTitle="Mandatory"
            mandatoryBool={true}
            uploadFilePath={"Upload file/"+request.RequestID+"/9. Dimensional Results/1.Dimension"} fileUploadControlBool={true}></MultiFileUploadComponent>

          <MultiFileUploadComponent
            mainTitle="9. Dimensional Results  "
            childTtitle="<2.Bubble drawing>"
            titleDiscription=""
            checkboxTitle="Mandatory"
            mandatoryBool={true}
            uploadFilePath={"Upload file/"+request.RequestID+"/9. Dimensional Results/2.Bubble drawing"} fileUploadControlBool={true}></MultiFileUploadComponent>
        </div>



        <FileUploadMultiple
          mainTitle="10. Material, Performance Test Results  "
          titleDiscription=""
          checkboxTitle="Mandatory"
          mandatoryBool={true}
          uploadFilePath={"Upload file/"+request.RequestID+"/10. Material, Performance Test Results"} fileUploadControlBool={true}></FileUploadMultiple>

        <FileUploadMultiple
          mainTitle="11. Initial Process Studies  "
          titleDiscription=""
          checkboxTitle="Not Applicable"
          mandatoryBool={false}
          uploadFilePath={"Upload file/"+request.RequestID+"/11. Initial Process Studies"} fileUploadControlBool={true}></FileUploadMultiple>
        <FileUploadMultiple
          mainTitle="12. Qualified Laboratory Documentation  "
          titleDiscription=""
          checkboxTitle="Not Applicable"
          mandatoryBool={false}
          uploadFilePath={"Upload file/"+request.RequestID+"/12. Qualified Laboratory"} fileUploadControlBool={true}></FileUploadMultiple>
        <FileUploadMultiple
          mainTitle="13. Appearance Approval Report, if applicable  "
          titleDiscription=""
          checkboxTitle="Not Applicable"
          mandatoryBool={false}
          uploadFilePath={"Upload file/"+request.RequestID+"/13. Appearance Approval"} fileUploadControlBool={true}></FileUploadMultiple>


        <FileUploadMultiple
          mainTitle="14. Sample Product  "
          titleDiscription=""
          checkboxTitle="Not Applicable"
          mandatoryBool={false}
          uploadFilePath={"Upload file/"+request.RequestID+"/14. Sample Product"} fileUploadControlBool={true}></FileUploadMultiple>

        <FileUploadMultiple
          mainTitle="15. Master Sample  "
          titleDiscription=""
          checkboxTitle="Not Applicable"
          mandatoryBool={false}
          uploadFilePath={"Upload file/"+request.RequestID+"/15. Master Sample"} fileUploadControlBool={true}></FileUploadMultiple>
        <FileUploadMultiple
          mainTitle="16. Checking Aids"
          titleDiscription=""
          checkboxTitle="Not Applicable"
          mandatoryBool={false}
          uploadFilePath={"Upload file/"+request.RequestID+"/16. Checking Aids"} fileUploadControlBool={true}></FileUploadMultiple>

        <div>
          <div style={{ textAlign: "left", float: "left" }}>

            <span><span className={styles.title}>17. Records of compliance with UD Specific Requirements  </span> </span>
          </div>
          <div style={{ textAlign: "right", float: "right", justifyContent: "flex-end" }}><span>Mandatory</span> </div>
          <br></br>
          <MultiFileUploadComponent
            mainTitle="17. Records of compliance with UD Specific Requirements  "
            childTtitle="<1. RTS with signature>"
            titleDiscription=""
            checkboxTitle="Mandatory"
            mandatoryBool={true}
            uploadFilePath={"Upload file/"+request.RequestID+"/17. Records of compliance with UD Specific Requirements/1. RTS with signature"} fileUploadControlBool={true}></MultiFileUploadComponent>

          <MultiFileUploadComponent
            mainTitle="17. Records of compliance with UD Specific Requirements  "
            childTtitle="<2. PAA>"
            titleDiscription=""
            checkboxTitle="Mandatory"
            mandatoryBool={true}
            uploadFilePath={"Upload file/"+request.RequestID+"/17. Records of compliance with UD Specific Requirements/2. PAA"} fileUploadControlBool={true}></MultiFileUploadComponent>
          <MultiFileUploadComponent
            mainTitle="17. Records of compliance with UD Specific Requirements  "
            childTtitle="<3. CAS>"
            titleDiscription=""
            checkboxTitle="Mandatory"
            mandatoryBool={true}
            uploadFilePath={"Upload file/"+request.RequestID+"/17. Records of compliance with UD Specific Requirements/3. CAS"} fileUploadControlBool={true}></MultiFileUploadComponent>
          <MultiFileUploadComponent
            mainTitle="17. Records of compliance with UD Specific Requirements  "
            childTtitle="<4. IMDS>"
            titleDiscription=""
            checkboxTitle="Mandatory"
            mandatoryBool={true}
            uploadFilePath={"Upload file/"+request.RequestID+"/17. Records of compliance with UD Specific Requirements/4. IMDS"} fileUploadControlBool={true}></MultiFileUploadComponent>
        </div>


        <div>
          <div style={{ textAlign: "left", float: "left" }}>

            <span><span className={styles.title}>18. Part Submission Warrant (PSW)  </span> </span>
          </div>
          <div style={{ textAlign: "right", float: "right", justifyContent: "flex-end" }}><span>Mandatory</span> </div>
          <br></br>
          <MultiFileUploadComponent
            mainTitle="18. Part Submission Warrant (PSW)  "
            childTtitle="<1. PSW with signature>"
            titleDiscription=""
            checkboxTitle="Mandatory"
            mandatoryBool={true}
            uploadFilePath={"Upload file/"+request.RequestID+"/18. Part Submission Warrant (PSW)/1. PSW with signature"} fileUploadControlBool={true}></MultiFileUploadComponent>

          <MultiFileUploadComponent
            mainTitle="18. Part Submission Warrant (PSW)  "
            childTtitle="<2. BOM>"
            titleDiscription=""
            checkboxTitle="Mandatory"
            mandatoryBool={true}
            uploadFilePath={"Upload file/"+request.RequestID+"/18. Part Submission Warrant (PSW)/2. BOM"} fileUploadControlBool={true}></MultiFileUploadComponent>
          <MultiFileUploadComponent
            mainTitle="18. Part Submission Warrant (PSW)  "
            childTtitle="<3. PSW for subcomponent>"
            titleDiscription=""
            checkboxTitle="Mandatory"
            mandatoryBool={true}
            uploadFilePath={"Upload file/"+request.RequestID+"/18. Part Submission Warrant (PSW)/3. PSW for subcomponent"} fileUploadControlBool={true}></MultiFileUploadComponent>

        </div>





      </div>}




    </section>
  )


}

export default Renderdemo