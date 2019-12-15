import React from "react";
import "./App.css";

import { ToastContainer, toast, ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

const toast_template: ToastOptions = {
  autoClose: false,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true
};

interface AppProps {}

interface AppState {
  host: string;
  port: number;
}

export default class App extends React.Component<AppProps, AppState> {
  constructor(props: any) {
    super(props);
    this.state = {
      host: "",
      port: 80
    };
  }

  async executeAPI() {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        reject(new Error("timeout"));
      }, 1000);
      fetch(
        `http://localhost:3001/check?host=${this.state.host}&port=${this.state.port}`
      ).then(resolve, reject);
    });
    // return await fetch(
    //   `http://localhost:3001/check?host=${this.state.host}&port=${this.state.port}`
    // );
  }

  onPortChanged(e: any) {
    this.setState({ port: e.target.value });
  }

  onHostChanged(e: any) {
    this.setState({ host: e.target.value });
  }

  async onSubmit(e: any) {
    e.preventDefault();

    try {
      let response: any = await this.executeAPI();

      if (response.status === 200) {
        let js = await response.json();

        if (js.reached) {
          toast.success(js.message, toast_template);
        } else {
          toast.error(js.message, toast_template);
        }
      } else {
        toast.error("Frontend error", toast_template);
      }
    } catch {
      toast.error("Request to API timed out", toast_template);
      return;
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <label>Check if a port on host is open</label>
          <form
            onSubmit={e => {
              this.onSubmit(e);
            }}
            className="simple-form"
          >
            <input
              type="text"
              value={this.state.host}
              onChange={e => {
                this.onHostChanged(e);
              }}
              placeholder="Domain name or IP address"
              required
            />
            <input
              className="port-input"
              value={this.state.port}
              onChange={e => {
                this.onPortChanged(e);
              }}
              type="number"
              placeholder="Port"
              required
            />
            <input type="submit" value="Go" />
          </form>
          <ToastContainer
            position="top-right"
            autoClose={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            draggable
          />
        </header>
      </div>
    );
  }
}
