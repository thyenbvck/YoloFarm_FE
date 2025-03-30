export type IUser = {
    id: number;
    username: string;
    email: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    avatarUrl: string | null;
    address: string;
    password: string | null;
    
  };
  
  export type IUserLogin = {
    username: string;
    password: string;
  }