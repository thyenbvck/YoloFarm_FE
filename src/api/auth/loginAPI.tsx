import { IUserLogin, IUser } from "../../types/auth";

const API_URL = "https://temporary-antonie-tochucdaumat-0005f387.koyeb.app/api/auth/login";

export const login = async (credentials: IUserLogin): Promise<IUser> => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error("Đăng nhập thất bại!");
  }

  return response.json();
};
