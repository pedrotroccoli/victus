declare global {
  interface Account {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    connected_providers: ['worldapp' | 'web']
    subscription: {
      sub_status: 'trial' | 'active' | 'inactive'
      service_details: {
        trial_ends_at: string;
      }
    }
  }
}

export { };
