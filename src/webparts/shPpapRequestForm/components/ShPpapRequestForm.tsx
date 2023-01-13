import * as React from 'react';
import styles from './ShPpapRequestForm.module.scss';
import { IShPpapRequestFormProps } from './IShPpapRequestFormProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { PrimaryButton } from "office-ui-fabric-react";
import { getSP } from "../common/pnpjsConfig";
import { SPFI, spfi } from "@pnp/sp";

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

    return (
      <section className={`${styles.shPpapRequestForm} ${hasTeamsContext ? styles.teams : ''}`}>
        <div className={styles.welcome}>
          <img alt="" src={isDarkTheme ? require('../assets/welcome-dark.png') : require('../assets/welcome-light.png')} className={styles.welcomeImage} />
          <h2>Well done, {escape(userDisplayName)}!</h2>
          <div>{environmentMessage}</div>
          <div>Web part property value: <strong>{escape(description)}</strong></div>
        </div>
        <div>
          <PrimaryButton onClick={() => this.sampleBtnClick()}>
            PnP JS Sample
          </PrimaryButton>

          <ul className={styles.links}>
          {this.state.items.map((docItem,idx) =>{
              return (
                <li key={docItem.Id}>{docItem.FileLeafRef}</li>
              )
            })}
          </ul>
        </div>
      </section>
    );
  }
  async sampleBtnClick(): Promise<void> {
    const sp = spfi(this._sp);
    try {
      const response = await sp.web.lists.getByTitle("Documents").items.select("Id", "FileLeafRef")();
      const items = response.map( (item:IDocItem) => {
        return {
          Id:item.Id,
          FileLeafRef:item.FileLeafRef
        };
      });
      this.setState({items});
    } catch (err) {
      console.error(err);
    }
  }
}
