/**
 * State store: Auth
 */
export const AuthStore = {
  state: {
    initialized: true,
  },
  getState() {
    return this.state;
  },
  setState(newState) {
    this.state = { ...this.state, ...newState };
  }
};
