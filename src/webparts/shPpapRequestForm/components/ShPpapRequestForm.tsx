import * as React from 'react';
import styles from './ShPpapRequestForm.module.scss';
import { IShPpapRequestFormProps } from './IShPpapRequestFormProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { INavLinkGroup, Nav, PrimaryButton, Stack, StackItem } from "office-ui-fabric-react";
import { getSP } from "../common/pnpjsConfig";
import { SPFI, spfi } from "@pnp/sp";
import SubmissionListView from './SubmitRequest/ListViewSubmit/SubmissionListView';
import PlannedWeek from './UpdatePlannedWeek/PlannedWeek'
import { HashRouter, Routes, Route} from 'react-router-dom';


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

    const group: INavLinkGroup[] = [{
      links:[{name: "Update PPAP week", url: "#/PlannedWeek" },
    {name: "Submit a request", url: "#/SubmissionListView"}]
    }]
    
    return (
    
      <section className={`${styles.shPpapRequestForm} ${hasTeamsContext ? styles.teams : ''}`}>
        <HashRouter> 
        <Stack horizontal>
          <Nav groups={group} ></Nav>
          <StackItem>
            <Routes>
              <Route path="/PlannedWeek" 
               element={<PlannedWeek description={""} isDarkTheme={false} environmentMessage={""} hasTeamsContext={false} userDisplayName={""} />}>
             </Route>
             <Route path="/SubmissionListView" 
              element={<SubmissionListView hasfilled={false} />}>

             </Route>
            </Routes>
        </StackItem>
        </Stack>
        
      </HashRouter>
      </section>
           
    );
  }
  
}
