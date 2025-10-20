// React fallback types for development without node_modules
declare module 'react' {
  export function useState<T>(initialState: T | (() => T)): [T, (value: T | ((prev: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  export function createElement(type: any, props?: any, ...children: any[]): any;
  
  interface Component<P = {}> {
    props: P;
  }
  
  type ReactNode = any;
  type ReactElement = any;
  
  export default React;
}

declare namespace React {
  type ReactNode = any;
  type ReactElement = any;
  function useState<T>(initialState: T | (() => T)): [T, (value: T | ((prev: T) => T)) => void];
  function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  function createElement(type: any, props?: any, ...children: any[]): any;
}

// JSX namespace
declare global {
  namespace JSX {
    interface Element {
      type: any;
      props: any;
    }
    
    interface IntrinsicElements {
      [elemName: string]: any;
    }
    
    interface ElementClass {
      render(): any;
    }
  }
}