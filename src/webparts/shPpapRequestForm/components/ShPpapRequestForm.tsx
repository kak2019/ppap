import * as React from 'react';
import styles from './ShPpapRequestForm.module.scss';
import { IShPpapRequestFormProps } from './IShPpapRequestFormProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { INavLinkGroup, Nav, PrimaryButton, Stack, StackItem, Pivot, PivotItem } from "office-ui-fabric-react";
import { getSP } from "../common/pnpjsConfig";
import { SPFI, spfi } from "@pnp/sp";
import SubmissionListView from './SubmitRequest/ListViewSubmit/SubmissionListView';
import PlannedWeek from './UpdatePlannedWeek/PlannedWeek'
import { HashRouter, Routes, Route} from 'react-router-dom';
import Renderdemo from './UploadFile/Renderdemo';

interface IDocItem {Id:number,FileLeafRef:string}
interface IShPpapRequestFormState { items: IDocItem[] }
export default class ShPpapRequestForm extends React.Component<IShPpapRequestFormProps, IShPpapRequestFormState> {
  private _sp: SPFI;

  constructor(props: IShPpapRequestFormProps) {
    super(props);
    this.state = {
      items: []
    };

    this._sp = getSP();
  }

  public render(): React.ReactElement<IShPpapRequestFormProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName
    } = this.props;

    // const group: INavLinkGroup[] = [{
    //   links:[{name: "Update PPAP week", url: "#/PlannedWeek" },
    // {name: "Submit a request", url: "#/SubmissionListView"},
    // {name: "Upload Files", url: "#/Uploadfile"}]
    // }]
    
    return (
    
      <section className={`${styles.shPpapRequestForm} ${hasTeamsContext ? styles.teams : ''}`}>
        <Pivot>
          <PivotItem headerText='PlannedWeek'>
              <PlannedWeek description={""} isDarkTheme={false} environmentMessage={""} hasTeamsContext={false} userDisplayName={""} />
          </PivotItem>
          <PivotItem headerText='SubmissionListView'>
              <SubmissionListView isDarkTheme={false} hasTeamsContext={false} />
          </PivotItem>
          <PivotItem headerText='Uploadfile'>
              <Renderdemo/>
          </PivotItem>
        </Pivot> 
        {/* <HashRouter> 
        <Stack horizontal>
          <Nav groups={group} ></Nav>
          <StackItem>
            <Routes>
              <Route path="/PlannedWeek" 
               element={<PlannedWeek description={""} isDarkTheme={false} environmentMessage={""} hasTeamsContext={false} userDisplayName={""} />}>
             </Route>
             <Route path="/SubmissionListView" 
              element={<SubmissionListView isDarkTheme={false} hasTeamsContext={false} />}>

             </Route>
             <Route path="/Uploadfile" 
              element={<Renderdemo/>}>

             </Route>
            </Routes>
        </StackItem>
        </Stack>
        
      </HashRouter> */}
      </section>
           
    );
  }
  
}
