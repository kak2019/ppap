import * as React from "react";
import styles from "./ListView.module.scss";
import { IShPpapRequestFormWebPartProps } from "./IListViewProps";
import { escape } from "@microsoft/sp-lodash-subset";
import { IconButton, PrimaryButton, TextField } from "office-ui-fabric-react";
import { getSP } from "../../../common/pnpjsConfig";
import { SPFI, spfi } from "@pnp/sp";
import { ListView, IViewField, SelectionMode, GroupOrder, IGrouping } from "@pnp/spfx-controls-react/lib/ListView";
import { Pagination } from "@pnp/spfx-controls-react/lib/pagination";
//import { Icon } from '@fluentui/react/lib/Icon';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
interface IDocItem {Id:number,Title:string,ItemName:string}
interface IShPpapRequestFormWebPartState { items: IListItem[], paginatedItems: IListItem[] , selectedItems: any[]}
interface IListItem { ID:string, ItemNbr: string, PPAPOrderNumber: string, ItemNm: string,SQANm:string, PARMANm:string, PPAPPartWeightCode:string, PPAPPartWeight:string }

export interface IListItemColl {  
  value: IListItem[];  
}  

let arr: any[] =[];
let unique: any[] =[];
let currentPage = 1;

//const DeleteIcon = () => <Icon iconName="Delete" />;
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


export default class ShPpapRequestFormWebPart extends React.Component<IShPpapRequestFormWebPartProps,IShPpapRequestFormWebPartState> {
  private _sp: SPFI;

  constructor(props: IShPpapRequestFormWebPartProps) {
    super(props);
    this.state = {
      items: [],
      paginatedItems: [],
      selectedItems: []
    };

    this._sp = getSP();
  }

  public render(): React.ReactElement<IShPpapRequestFormWebPartProps> {
    const {
     // description,
      isDarkTheme,
      //environmentMessage,
      hasTeamsContext,
     // userDisplayName,
    } = this.props;

    return (
      <section id="root"
        className={`${styles.shPpapRequestFormWebPart} ${
          hasTeamsContext ? styles.teams : ""
        }`}
      >
       <div>
          <PrimaryButton onClick={() => this.sampleBtnClick()}>
            PnP JS Sample
          </PrimaryButton>
</div>
<br></br>
<div className={styles.header}>
      Select items from below to add to the PPAP request:
      <hr></hr>
    </div>
  <div className={styles.listView}>  
     <ListView  
       items={this.state.paginatedItems}  
       viewFields={viewFields}  
       groupByFields={groupByFields}  
       compact={true}  
       selectionMode={SelectionMode.multiple}  
       selection={this._getSelection.bind(this)}
       showFilter={true}  
       filterPlaceHolder="Search..."  
     />  
   </div>
   <br/>
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
   <br/>
   
    <div className={styles.header}>
      Selected items:
      <hr/>
    </div>
   {this.state.selectedItems.length > 0 && <div className= {styles.selectedItems}>
        <table >
          <thead >
            <tr> <th> Order ID</th> 
              <th>Part ID</th>
                <th>Item Name</th>
                <th>SQE Name</th>
                <th>PARMA Name</th>
                <th>Part Weight</th>
                <th>Part Weight Code</th>
            </tr>
          </thead>
        
         {this.state.selectedItems.map((item, index) => (  
              <tr data-index={index}>  
                <td>{item.PPAPOrderNumber}</td>  
                <td>{item.ItemNbr}</td>  
                <td>{item.ItemNm}</td>
                <td>{item.SQANm}</td>
                <td>{item.PARMANm}</td>  
                <td>  <input className={styles.inputFields}
                  name="weight"
                  type="text"
                  onChange={(e) => this.onChangeWeight(e, item.ID, index)}
                  placeholder="Type Weight"
                /> </td>
                <td>  <input className={styles.inputFields}
                  name="weightCode"
                  type="text"
                  onChange={(e) => this.onChangeWeightCode(e, item.ID, index)}
                  placeholder="Type Weight"
                /> </td>
                <td>
                 <IconButton onClick={() => this.deleteItem( index)} iconProps={ {iconName: "Delete"}}/>
                </td>
              </tr>  
            ))}
        </table>
        </div>
        }
     {this.state.selectedItems.length === 0 && <div className={styles.emptyMessage}>
        No items selected
      </div>}
        <br/>
        <div>
          <PrimaryButton className={styles.button} onClick={() => this.updateItems()}>Save and Upload Documents</PrimaryButton>
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
        list.items.getById(item.ID).update({PPAPPartWeight: item.PPAPPartWeight, PPAPPartWeightCode: item.PPAPPartWeightCode}).then(b => {
          console.log(b);
        });
    })
  }

  public onChangeWeight= (e: any, ID: string, index: number) => {
    unique[index].PPAPPartWeight = e.target.value;
    this.setState({selectedItems: unique});
    console.log(this.state.selectedItems);
  }

  public onChangeWeightCode= (e: any, ID: string, index: number) => {
    
    unique[index].PPAPPartWeightCode = e.target.value;
    this.setState({selectedItems: unique})
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
    var currentPge = (page) ? page : currentPage;
        var startItem = ((currentPge - 1) * 10);
        var endItem = currentPge * 10;
        //let filItems = this.state.items.slice(startItem, endItem);
        currentPage = currentPge;
    this.setState({
      paginatedItems: this.state.items.slice( startItem, endItem)
     
    });
  }
  
  async sampleBtnClick(): Promise<any> {
    const sp = spfi(this._sp);
    try {
      const response =  await sp.web.lists.getByTitle("GPS Orders").items.select("ID", "ItemNm", "ItemNbr", "PARMANm","SQANm","PPAPOrderNumber","PPAPPartWeight","PPAPPartWeightCode").top(30)();
      const items = response.map((item:IListItem) => {
        return {
          ID:item.ID,
          PPAPOrderNumber:item.PPAPOrderNumber,
          ItemNbr:item.ItemNbr,
          SQANm:item.SQANm,
          PARMANm:item.PARMANm,
          ItemNm: item.ItemNm,
          PPAPPartWeightCode:item.PPAPPartWeightCode,
          PPAPPartWeight:item.PPAPPartWeight
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
