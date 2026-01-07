declare global {
  namespace Account {
    interface Subscription {
      status: "active" | "cancelled" | "trial";
      sub_status: "trial" | "success" | "payment_failed";
      service_details: {
        customer_id: string;
        trial_ends_at?: string;
      };
    }

    interface Account {
      id: string;
      name: string;
      email: string;
      phone: string;
      createdAt: string;
      updatedAt: string;
      connected_providers: ["worldapp" | "web"];
      subscription: Subscription;
    }
  }
}

export {};
