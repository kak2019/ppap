import * as React from "react";
import styles from "./ShPpapRequestForm.module.scss";
import { IShPpapRequestFormProps } from "./IShPpapRequestFormProps";
import { escape } from "@microsoft/sp-lodash-subset";
import { PrimaryButton } from "office-ui-fabric-react";
import { getSP } from "../common/pnpjsConfig";
import { SPFI, spfi } from "@pnp/sp";
import { ListView, IViewField, SelectionMode, GroupOrder, IGrouping } from "@pnp/spfx-controls-react/lib/ListView";
import { Pagination } from "@pnp/spfx-controls-react/lib/pagination";


import FileUploadMultiple from "./UploadFile/Uploadfilenew";
import MultiFileUploadComponent from "./UploadFile/MultiFileUploadComponent/MultiFileUploadComponent";

interface IDocItem { Id: number, Title: string, ItemName: string }
interface IShPpapRequestFormWebPartState { items: IListItem[], paginatedItems: IListItem[], selectedItems: IListItem[] }
interface IListItem { ItemNbr: string, PPAPOrderNumber: string, ItemNm: string, SQANm: string, PARMANm: string }

export interface IListItemColl {
  value: IListItem[];
}

var arr: IListItem[] = [];

const viewFields: IViewField[] = [{
  name: "PPAPOrderNumber",
  displayName: "OrderID",
  isResizable: true,
  sorting: true,
  minWidth: 0,
  maxWidth: 150
},
{
  name: "ItemNbr",
  displayName: "PartID",
  isResizable: true,
  sorting: true,
  minWidth: 0,
  maxWidth: 200
},
{
  name: "ItemNm",
  displayName: "Item Name",
  isResizable: true,
  sorting: true,
  minWidth: 0,
  maxWidth: 200
},
{
  name: "SQANm",
  displayName: "SQE Name",
  isResizable: true,
  sorting: true,
  minWidth: 0,
  maxWidth: 150
},
{
  name: "PARMANm",
  displayName: "PARMA Name",
  isResizable: true,
  sorting: true,
  minWidth: 0,
  maxWidth: 150
},
];


const groupByFields: IGrouping[] = [
  {
    name: "PPAPOrderNumber",
    order: GroupOrder.ascending
  },];


export default class ShPpapRequestFormWebPart extends React.Component<IShPpapRequestFormProps, IShPpapRequestFormWebPartState> {
  private _sp: SPFI;

  constructor(props: IShPpapRequestFormProps) {
    super(props);
    this.state = {
      items: [],
      paginatedItems: [],
      selectedItems: []
    };

    this._sp = getSP();
  }

  public render(): React.ReactElement<IShPpapRequestFormProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName,
    } = this.props;

    return (
      <section id="root"
        className={`${styles.shPpapRequestForm} ${hasTeamsContext ? styles.teams : ""
          }`}
      >
        <div className={styles.welcome}>
          <h1 style={{ textAlign: "left" }}>Uploading Documments</h1>
          {/* <img
            alt=""
            src={
              isDarkTheme
                ? require("../assets/welcome-dark.png")
                : require("../assets/welcome-light.png")
            }
            className={styles.welcomeImage}
          />
          <h2>Well done, {escape(userDisplayName)}!</h2>
          <div>{environmentMessage}</div>
          <div>
            Web part property value: <strong>{escape(description)}</strong>
          </div>
        </div>
        <div>
          <PrimaryButton onClick={() => this.sampleBtnClick()}>
            PnP JS Sample
          </PrimaryButton>

          <div >
            <ListView
              items={this.state.paginatedItems}
              viewFields={viewFields}
              groupByFields={groupByFields}
              compact={true}
              selectionMode={SelectionMode.multiple}
              selection={this._getSelection}
              showFilter={true}
              filterPlaceHolder="Search..."
            />
          </div>
          <div>
            <Pagination
              currentPage={1}
              totalPages={(this.state.items.length / 5)}
              onChange={(page) => { this._getPage(page) }}
              limiter={3} // Optional - default value 3
              hideFirstPageJump // Optional
              hideLastPageJump // Optional
              limiterIcon={"Emoji12"} // Optional 
            /> */}
          {/* <UploadFlile context={this.props.context} columnValue={""}  ></UploadFlile> */}

          <FileUploadMultiple
            mainTitle="1.Design Records  "
            titleDiscription="  (UD Released drawing,PVP)"
            checkboxTitle="Mandatory"
            mandatoryBool={true}
            uploadFilePath="Upload file/202302/1. Design Records" fileUploadControlBool={true}></FileUploadMultiple>

         <FileUploadMultiple
            mainTitle="2.Engineering Change Documents, if any  "
            titleDiscription=""
            checkboxTitle="No Information"
            mandatoryBool={false}
            uploadFilePath="Upload file/202302/2. Engineering Change Documents, if any" fileUploadControlBool={false}></FileUploadMultiple>

           <FileUploadMultiple
            mainTitle="3. Customer Engineering Approval, if required  "
            titleDiscription="DVP with PD signature"
            checkboxTitle="Mandatory"
            mandatoryBool={true}
            uploadFilePath="Upload file/202302/3. Customer Engineering Approval, if required" fileUploadControlBool={true}></FileUploadMultiple>

          <FileUploadMultiple
            mainTitle="4. Design FMEA  "
            titleDiscription=""
            checkboxTitle="No Information"
            mandatoryBool={false}
            uploadFilePath="Upload file/202302/4. Design FMEA" fileUploadControlBool={true}></FileUploadMultiple>

          <FileUploadMultiple
            mainTitle="5. Process Flow Diagrams  "
            titleDiscription=""
            checkboxTitle="Mandatory"
            mandatoryBool={true}
            uploadFilePath="Upload file/202302/5. Process Flow Diagrams" fileUploadControlBool={true}></FileUploadMultiple>

          <FileUploadMultiple
            mainTitle="6. Process FMEA  "
            titleDiscription=""
            checkboxTitle="Mandatory"
            mandatoryBool={true}
            uploadFilePath="Upload file/202302/6. Process FMEA" fileUploadControlBool={true}></FileUploadMultiple>

          <FileUploadMultiple
            mainTitle="7. Control Plan  "
            titleDiscription=""
            checkboxTitle="Mandatory"
            mandatoryBool={true}
            uploadFilePath="Upload file/202302/7. Control Plan" fileUploadControlBool={true}></FileUploadMultiple>

          <FileUploadMultiple
            mainTitle="8. Measurement System Analysis  "
            titleDiscription=""
            checkboxTitle="No Information"
            mandatoryBool={false}
            uploadFilePath="Upload file/202302/8. Measurement System Analysis" fileUploadControlBool={true}></FileUploadMultiple>

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
            uploadFilePath="Upload file/202302/9. Dimensional Results/1.Dimension" fileUploadControlBool={true}></MultiFileUploadComponent>
          
          <MultiFileUploadComponent
            mainTitle="9. Dimensional Results  "
            childTtitle="<2.Bubble drawing>"
            titleDiscription=""
            checkboxTitle="Mandatory"
            mandatoryBool={true}
            uploadFilePath="Upload file/202302/9. Dimensional Results/2.Bubble drawing" fileUploadControlBool={true}></MultiFileUploadComponent>   
          </div>    
         
       
          
<FileUploadMultiple
            mainTitle="10. Material, Performance Test Results  "
            titleDiscription=""
            checkboxTitle="Mandatory"
            mandatoryBool={true}
            uploadFilePath="Upload file/202302/10. Material, Performance Test Results" fileUploadControlBool={true}></FileUploadMultiple> 

          <FileUploadMultiple 
            mainTitle="11. Initial Process Studies  "
            titleDiscription=""
            checkboxTitle="No Information"
            mandatoryBool={false}
            uploadFilePath="Upload file/202302/11. Initial Process Studies" fileUploadControlBool={true}></FileUploadMultiple>
          <FileUploadMultiple
            mainTitle="12. Qualified Laboratory Documentation  "
            titleDiscription=""
            checkboxTitle="No Information"
            mandatoryBool={false}
            uploadFilePath="Upload file/202302/12. Qualified Laboratory" fileUploadControlBool={true}></FileUploadMultiple>
          <FileUploadMultiple
            mainTitle="13. Appearance Approval Report, if applicable  "
            titleDiscription=""
            checkboxTitle="No Information"
            mandatoryBool={false}
            uploadFilePath="Upload file/202302/13. Appearance Approval" fileUploadControlBool={true}></FileUploadMultiple>


          <FileUploadMultiple
            mainTitle="14. Sample Product  "
            titleDiscription=""
            checkboxTitle="No Information"
            mandatoryBool={false}
            uploadFilePath="Upload file/202302/14. Sample Product" fileUploadControlBool={true}></FileUploadMultiple>

<FileUploadMultiple
            mainTitle="15. Master Sample  "
            titleDiscription=""
            checkboxTitle="No Information"
            mandatoryBool={false}
            uploadFilePath="Upload file/202302/15. Master Sample" fileUploadControlBool={true}></FileUploadMultiple>
<FileUploadMultiple
            mainTitle="16. Checking Aids"
            titleDiscription=""
            checkboxTitle="No Information"
            mandatoryBool={false}
            uploadFilePath="Upload file/202302/16. Checking Aids" fileUploadControlBool={true}></FileUploadMultiple>

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
            uploadFilePath="Upload file/202302/17. Records of compliance with UD Specific Requirements/1. RTS with signature" fileUploadControlBool={true}></MultiFileUploadComponent>
          
          <MultiFileUploadComponent
            mainTitle="17. Records of compliance with UD Specific Requirements  "
            childTtitle="<2. PAA>"
            titleDiscription=""
            checkboxTitle="Mandatory"
            mandatoryBool={true}
            uploadFilePath="Upload file/202302/17. Records of compliance with UD Specific Requirements/2. PAA" fileUploadControlBool={true}></MultiFileUploadComponent> 
            <MultiFileUploadComponent
            mainTitle="17. Records of compliance with UD Specific Requirements  "
            childTtitle="<3. CAS>"
            titleDiscription=""
            checkboxTitle="Mandatory"
            mandatoryBool={true}
            uploadFilePath="Upload file/202302/17. Records of compliance with UD Specific Requirements/3. CAS" fileUploadControlBool={true}></MultiFileUploadComponent>  
             <MultiFileUploadComponent
            mainTitle="17. Records of compliance with UD Specific Requirements  "
            childTtitle="<4. IMDS>"
            titleDiscription=""
            checkboxTitle="Mandatory"
            mandatoryBool={true}
            uploadFilePath="Upload file/202302/17. Records of compliance with UD Specific Requirements/4. IMDS" fileUploadControlBool={true}></MultiFileUploadComponent>  
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
            uploadFilePath="Upload file/202302/18. Part Submission Warrant (PSW)/1. PSW with signature" fileUploadControlBool={true}></MultiFileUploadComponent>
          
          <MultiFileUploadComponent
            mainTitle="18. Part Submission Warrant (PSW)  "
            childTtitle="<2. BOM>"
            titleDiscription=""
            checkboxTitle="Mandatory"
            mandatoryBool={true}
            uploadFilePath="Upload file/202302/18. Part Submission Warrant (PSW)/2. BOM" fileUploadControlBool={true}></MultiFileUploadComponent> 
            <MultiFileUploadComponent
            mainTitle="18. Part Submission Warrant (PSW)  "
            childTtitle="<3. PSW for subcomponent>"
            titleDiscription=""
            checkboxTitle="Mandatory"
            mandatoryBool={true}
            uploadFilePath="Upload file/202302/18. Part Submission Warrant (PSW)/3. PSW for subcomponent" fileUploadControlBool={true}></MultiFileUploadComponent>  
               
          </div>    





        </div>

        <table>
          {/* <thead>
            <tr> <th> Order ID</th> 
                <th>Part ID</th>
                <th>Item Name</th>
                <th>SQE Name</th>
                <th>PARMA Name</th>
            </tr>
          </thead> */}

          {this.state.selectedItems.map((item, index) => (
            <tr data-index={index}>
              <td>{item.PPAPOrderNumber}</td>
              <td>{item.ItemNbr}</td>
              <td>{item.ItemNm}</td>
              <td>{item.SQANm}</td>
              <td>{item.PARMANm}</td>
            </tr>
          ))}
        </table>


      </section>
    );
  }

  public _getSelection(items: IListItem[]) {
    //console.log('Selected items:', items);


    console.log(items);
    //console.log(this.state.selectedItems)
    //arr = items.map(item =>{
    //   return{
    //     PPAPOrderNumber:item.PPAPOrderNumber,
    //     ItemNbr:item.ItemNbr,
    //     SQANm:item.SQANm,
    //     PARMANm:item.PARMANm,
    //      ItemNm: item.ItemNm
    //   }
    //  });
    items.forEach(item => arr.push(item));
    //arr.push("1");
    //items.forEach(item =>{



    //});
    //});
    //arr.push(...items);
    //console.log("new array" + JSON.stringify(arr));
    console.log("new array" + arr);

  }


  private _getPage(page: number) {
    console.log('Page:', page);
    const roundupPage = Math.ceil(page);

    this.setState({
      paginatedItems: this.state.items.slice(roundupPage * 5, (roundupPage * 5) + 5)
    });
  }

  async sampleBtnClick(): Promise<any> {
    const sp = spfi(this._sp);
    try {
      const response = await sp.web.lists.getByTitle("GPS Orders").items.select("ItemNm", "ItemNbr", "PARMANm", "SQANm", "PPAPOrderNumber").top(20)();
      const items = response.map((item: IListItem) => {
        return {
          PPAPOrderNumber: item.PPAPOrderNumber,
          ItemNbr: item.ItemNbr,
          SQANm: item.SQANm,
          PARMANm: item.PARMANm,
          ItemNm: item.ItemNm
        };
      });
      console.log(items);
      console.log(response);
      this.setState({ items: items, paginatedItems: items.slice(0, 5) });
    } catch (err) {
      console.error(err);
    }

  }
}
