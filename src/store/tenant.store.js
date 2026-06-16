/**
 * State store: Tenant
 */
export const TenantStore = {
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
