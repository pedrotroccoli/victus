declare global {
  interface Account {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    connected_providers: ['worldapp' | 'web']
  }
}

export { };
