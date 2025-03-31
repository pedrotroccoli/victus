declare global {
  namespace Plan {
    export interface Item {
      key: string;
      name: string;
      price: string;
      features: {
        name: string;
      }[];
    }
  }
}


export { };
