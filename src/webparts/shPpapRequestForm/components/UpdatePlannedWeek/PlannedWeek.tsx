import * as React from "react";
import styles from "./PlannedWeek.module.scss";
import { IShPpapRequestFormWebPartProps } from "./IPPAPWeekProps";
import { escape } from "@microsoft/sp-lodash-subset";
import { constructKeytip, IconButton, PrimaryButton, TextField } from "office-ui-fabric-react";
import { getSP } from "../../common/pnpjsConfig";
import { SPFI, spfi } from "@pnp/sp";
import { ListView, IViewField, SelectionMode, GroupOrder, IGrouping } from "@pnp/spfx-controls-react/lib/ListView";
import { Pagination } from "@pnp/spfx-controls-react/lib/pagination";
//import { Icon } from '@fluentui/react/lib/Icon';
import { Icon } from 'office-ui-fabric-react/lib/Icon';


interface IShPpapRequestFormWebPartState { items: IListItem[], paginatedItems: IListItem[] , selectedItems: any[]}
interface IListItem { ID:string, ItemNbr: string, PPAPOrderNumber: string, ItemNm: string,SQANm:string, PARMANm:string, SQACd:string, PPAPplannedweek:string, PARMANbr:string, Flag: boolean }

export interface IListItemColl {  
  value: IListItem[];  
}  

let arr: any[] =[];
let unique: any[] =[];
let currentPage = 1;
let currentYear = new Date().getFullYear();
const weekRegex = new RegExp(currentYear +'[0-5][0-9]');
let saveFlag : boolean = false;
let items: any[] = [];
//const DeleteIcon = () => <Icon iconName="Delete" />;



export default class ShPpapRequestFormWebPart extends React.Component<IShPpapRequestFormWebPartProps,IShPpapRequestFormWebPartState> {
  private _sp: SPFI;
   viewFields: IViewField[] = [{  
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
    name: "PARMANbr",  
    displayName: "PARMA Number",  
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
  {  
    name: "SQACd",  
    displayName: "SQA Code",  
    isResizable: true,  
    sorting: true,  
    minWidth: 0,  
    maxWidth: 150  
  },
  {  
    name: "SQANm",  
    displayName: "SQA Name",  
    isResizable: true,  
    sorting: true,  
    minWidth: 0,  
    maxWidth: 150  
  },
  {  
    name: "PPAPplannedweek",  
    displayName: "PPAP Planned Week",  
    isResizable: true,  
    sorting: true,  
    minWidth: 0,  
    maxWidth: 150,
    render: ((item: any, index: number) => {
      return(
        <div> <input type="text" value={item.PPAPplannedweek} onChange={(e) => this.updatePlannedWeek(e, item.ID)} ></input></div>
      )
    })
  }
  ]; 
  
  
   groupByFields: IGrouping[] = [  
    {  
      name: "PPAPOrderNumber",  
      order: GroupOrder.ascending  
    }];

  constructor(props: IShPpapRequestFormWebPartProps) {
    super(props);
    this.state = {
      items: [],
      paginatedItems: [],
      selectedItems: []
    };

    this._sp = getSP();
  }
  public updatePlannedWeek(e : any, ID: number){
    let modifiedindex:number; 
  items.forEach ((item, index) =>{
    if(item.ID === ID){
      modifiedindex = index;
    }
  });
  items[modifiedindex].PPAPplannedweek = e.target.value;
    console.log(items);
    this.setState({items: items})
  }

  public render(): React.ReactElement<IShPpapRequestFormWebPartProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName,
    } = this.props;

    return (
      <section id="root"
        className={`${styles.shPpapRequestFormWebPart} ${
          hasTeamsContext ? styles.teams : ""
        }`}
      >
      <div>
          <PrimaryButton onClick={() => this.sampleBtnClick()}>
            Get Orders Data
          </PrimaryButton>
</div>
 
<br/>
<div className={styles.header}>
      Select items from below to update PPAP planned week:
      <hr></hr>
    </div>
  <div className={styles.listView}>  
     <ListView  
       items={this.state.paginatedItems}  
       viewFields={this.viewFields}  
       groupByFields={this.groupByFields}  
       compact={true}  
       selectionMode={SelectionMode.multiple}  
       selection={this._getSelection.bind(this)}
       showFilter={true}  
       filterPlaceHolder="Search..."  
     />  
   </div>
   <br></br>
   <div>
   <Pagination
  currentPage={currentPage}
  totalPages={(this.state.items.length / 10) } 
  onChange={(page) => this._getPage(page)}
  limiter={3} // Optional - default value 3
 // hideFirstPageJump // Optional
  //hideLastPageJump // Optional
  limiterIcon={"Emoji12"} // Optional
/>
   </div>
   <br></br>
   
        <div>
          <PrimaryButton className={styles.button} disabled = {!saveFlag} onClick={() => this.updateItems()}>Save</PrimaryButton>
        </div>
      </section>
    );
  }
 
  public deleteItem(index:number){
     // delete unique[index];
     unique = [...(unique.filter((item, i) => i !== index))];
      //console.log("unique array after delete");console.log(unique);
      arr = [...unique]
      //console.log(arr)
      this.setState({selectedItems: unique});
  }

  public updateItems(){
    const list = this._sp.web.lists.getByTitle('GPS Orders');
    //console.log("Items to be updated here" )
    this.state.selectedItems.forEach((item) => {
        list.items.getById(item.ID).update({PPAPplannedweek: item.PPAPplannedweek}).then(b => {
          console.log(b);
        });
    });
    alert ('PPAP week updated for selected items')
  }

  public onChangeWeek= (e: any, ID: string, index: number) => {
    const valid =  weekRegex.test(e.target.value);
    console.log ('regex result ' + valid);
    if(valid){
      unique[index].PPAPplannedweek = e.target.value;
      unique[index].Flag = true;
      this.setState({selectedItems: unique});
      console.log(this.state.selectedItems);
    }
    else{
      unique[index].Flag = false;
      //alert('Enter valid format, year followed by week number eg. 202341');
    }
    this.checkSave();
  }

  public checkSave()
  {
    let flag = true;
    unique.forEach(item => {
      flag = flag && item.Flag;
    });
    if(flag){saveFlag = true;}
  }
  public _getSelection(items: any[]) {
    //console.log('Selected items:', items);
      arr.push(...items);
     // console.log("arr before"); console.log(arr);
      const dup = new Set();
       unique = arr.filter(el => {
        const duplicate = dup.has(el.ID);
        dup.add(el.ID);
        return !duplicate;
      });
     // console.log("unique array"); console.log(unique);
      arr = [...unique];
     this.setState({
      selectedItems: unique
    });
      
 
   }


   private _getPage(page: number){
    console.log('Page:', page);
    //const roundupPage = Math.ceil(page);
    let currentPge = (page) ? page : currentPage;
        let startItem = ((currentPge - 1) * 10);
        let endItem = currentPge * 10;
        //let filItems = this.state.items.slice(startItem, endItem);
        currentPage = currentPge;
    this.setState({
      paginatedItems: this.state.items.slice( startItem, endItem)
     
    });
  }
  
  async sampleBtnClick(): Promise<any> {
    const sp = spfi(this._sp);
    try {
      const response =  await sp.web.lists.getByTitle("GPS Orders").items.select("ID", "ItemNm", "ItemNbr","PARMANbr","PARMANm","SQANm","SQACd","PPAPOrderNumber","PPAPplannedweek").top(30)();
     items = response.map((item:IListItem) => {
        return {
          ID:item.ID,
          PPAPOrderNumber:item.PPAPOrderNumber,
          ItemNbr:item.ItemNbr,
          SQANm:item.SQANm,
          PARMANm:item.PARMANm,
          ItemNm: item.ItemNm,
          SQACd:item.SQACd,         
          PPAPplannedweek:item.PPAPplannedweek,
          PARMANbr:item.PARMANbr,
          Flag: false
        };
      });
      //console.log(items);
     
      this.setState({ items: items, paginatedItems: items.slice(0, 10) });
      console.log(this.state.paginatedItems)
    } catch (err) {
      console.error(err);
    }
         
  }
}
