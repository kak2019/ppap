import * as React from "react";
import styles from "./ShPpapRequestForm.module.scss";
import "./App.css";
import { IShPpapRequestFormProps } from "./IShPpapRequestFormProps";
import { Provider } from "react-redux";
import store from "../common/store";
import App from "./App";
import AppContext from "../common/AppContext";

export default class ShPpapRequestForm extends React.Component<IShPpapRequestFormProps> {
  constructor(props: IShPpapRequestFormProps) {
    super(props);
  }

  public render(): React.ReactElement<IShPpapRequestFormProps> {
    return (
      <AppContext.Provider value={{ context: this.props.context }}>
        <Provider store={store}>
          <div className={`${styles.shPpapRequestForm}`}>
            <div className={styles.container}>
              <App />
            </div>
          </div>
        </Provider>
      </AppContext.Provider>
    );
  }
}
