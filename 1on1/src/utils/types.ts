export interface IFormData {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password1: string;
  password2: string;
}

export type userMessage = {
  status: "error" | "success" | null;
  message: string;
};
