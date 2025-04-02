export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  account: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    phone: string;
  }
  lookup_key: string;
}

export interface SignUpResponse {
  token: string;
  checkout_url: string;
}