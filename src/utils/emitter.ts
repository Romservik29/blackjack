export interface Emitter<T> {
  subscribe(callback: (value: T) => void): void;
  unsubscribe(callback: (value: T) => void): void;
  notify(value: T): void;
  dispose(): void;
}

export function createEmmitor<T>(): Emitter<T> {
  return new EmitterImpl<T>();
}

class EmitterImpl<T> implements Emitter<T> {
    private readonly listeners: Array<(value: T) => void> = [];
    public subscribe(callback: (value: T) => void) {
      this.listeners.push(callback);
    }

    public unsubscribe(callback: (value: T) => void) {
      this.listeners.filter((cb) => cb !== callback);
    }

    public notify(value: T) {
      this.listeners.forEach((listener) => listener(value));
    }

    public dispose() {
      this.listeners.length = 0;
    }
}
