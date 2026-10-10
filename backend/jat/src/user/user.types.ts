// User as it is safe to send to the client.
export interface PublicUser {
  id: string;
  email: string;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Full user row, including the password hash. Only used internally for login.
export interface UserWithPassword extends PublicUser {
  passwordHash: string;
}
