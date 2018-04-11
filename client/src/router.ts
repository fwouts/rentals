import { createBrowserHistory, History, Location } from "history";

export class Router<State> {
  private readonly history: History;
  private readonly originalLocation: Location;
  private readonly stateGetter: () => State;
  private trackedPaths: Array<TrackedPath<State>> = [];

  constructor(stateGetter: () => State) {
    this.history = createBrowserHistory();
    this.originalLocation = this.history.location;
    this.stateGetter = stateGetter;
  }

  public route(
    path: string,
    updateState: (...params: string[]) => any,
    stateToPath: (state: State) => boolean | string,
  ) {
    this.trackedPaths.push({
      path,
      updateState,
      stateToPath,
    });
  }

  public push() {
    const state = this.stateGetter();
    let foundMatch = false;
    for (const trackedPath of this.trackedPaths) {
      let path = trackedPath.stateToPath(state);
      if (path === false) {
        // State does not match this route.
        continue;
      }
      if (path === true) {
        // Use the default path for this route.
        path = trackedPath.path;
      }
      if (foundMatch) {
        throw new Error(
          `Found multiple routes matching for ${location.pathname}.`,
        );
      }
      if (this.history.location.pathname !== path) {
        this.history.push(path);
      }
      foundMatch = true;
    }
  }

  public start() {
    this.onLocationChange(this.originalLocation);
    this.history.listen(this.onLocationChange);
  }

  private onLocationChange = (location: Location) => {
    let foundMatch = false;
    for (const trackedPath of this.trackedPaths) {
      const params = this.matchPath(trackedPath.path, location.pathname);
      if (params) {
        if (foundMatch) {
          throw new Error(
            `Found multiple routes matching for ${location.pathname}.`,
          );
        }
        trackedPath.updateState(...params);
        foundMatch = true;
      }
    }
  }

  private matchPath(path: string, actualPath: string): false | string[] {
    const parts = path.split("/").filter((p) => p.length > 0);
    const actualParts = actualPath.split("/").filter((p) => p.length > 0);
    if (parts.length !== actualParts.length) {
      return false;
    }
    const params: string[] = [];
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      if (p.startsWith(":")) {
        params.push(actualParts[i]);
      } else if (p !== actualParts[i]) {
        return false;
      }
    }
    return params;
  }
}

export interface TrackedPath<State> {
  path: string;
  updateState: (...params: string[]) => any;
  stateToPath: (state: State) => boolean | string;
}
