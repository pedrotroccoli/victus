export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone: string;
}

export interface SignUpResponse {
  token: string;
}