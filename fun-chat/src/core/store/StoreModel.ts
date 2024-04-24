import { Action, initialState, Reducer, State } from './types';
import rootReducer from './rootReducer';

class StoreModel {
  private state: State = initialState;

  private reducer: Reducer<State, Action> = rootReducer;

  dispatch(action: Action) {
    this.state = this.reducer(this.state, action);
  }

  getState() {
    return this.state;
  }
}

const storeModel = new StoreModel();

export default storeModel;
