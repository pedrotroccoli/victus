declare global {
  namespace Plan {
    export interface Item {
      key: string;
      plan_key: string;
      price: string;
      features: {
        key: string;
      }[];
    }
  }
}


export { };
