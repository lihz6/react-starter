import React, { createContext, PureComponent /**ReactNode */ } from 'react';
import { getContext } from './fetch';
export enum AppStatus {
  BOOTING,
  LOGGING,
  RUNNING,
}

export interface Fetch {
  appStatus: AppStatus;
  // userType: number;
  // userName: string;
  // username: string;
  // avatar: string;
}

interface Model extends Fetch {
  // popupView: ReactNode;
}
const defaultContextModel: Model = {
  appStatus: AppStatus.BOOTING,
  // popupView: null,
  // userType: 0,
  // userName: '',
  // username: '',
  // avatar: '',
};

interface Props {
  children(context: ContextState): React.ReactNode;
}

export interface ContextState extends Model {
  setContextState: PureComponent<Props, Model>['setState'];
}

export const context = createContext<ContextState>(
  defaultContextModel as ContextState
);

const { Provider } = context;

export default class Context extends PureComponent<Props, ContextState> {
  constructor(props) {
    super(props);
    this.state = {
      setContextState: this.setState.bind(this),
      ...defaultContextModel,
    };
  }
  componentDidMount() {
    getContext()
      .then(data => {
        this.setState(data);
      })
      .catch(() => {
        this.setState({ appStatus: AppStatus.LOGGING });
      });
  }
  render() {
    return (
      <Provider value={this.state}>{this.props.children(this.state)}</Provider>
    );
  }
}
