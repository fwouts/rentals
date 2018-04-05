export class Unauthenticated {
  public readonly kind = "unauthenticated";

  public readonly authenticate: () => void;
  public readonly register: () => void;

  constructor(callbacks: Callbacks) {
    this.authenticate = callbacks.authenticate;
    this.register = callbacks.register;
  }
}

export interface Callbacks {
  authenticate(): void;
  register(): void;
}
