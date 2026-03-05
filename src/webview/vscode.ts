import type { InboundMessage } from './types';

declare function acquireVsCodeApi(): {
  postMessage(msg: InboundMessage): void;
  getState(): unknown;
  setState(state: unknown): void;
};

// Singleton — acquireVsCodeApi() may only be called once per webview lifetime.
const api = acquireVsCodeApi();

export function postMessage(msg: InboundMessage): void {
  api.postMessage(msg);
}
