import { authenticateUser } from "../strapi/authApi";

export interface User {
  id: number;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  lineId: string;
  backgroundImage?: string;
  fullName: string;
  gender?: string;
  address?: string;
  cardID?: string;
  telNumber?: string;
  userType?: string;
  point: number;
}

export interface AuthResponse {
  jwt: string;
  user: User;
}

export const loginWithLineId = async (lineId: string): Promise<AuthResponse | null> => {
  const identifier = `cook${lineId}@cook.com`;
  const password = "cookcook";

  try {
    const result = await authenticateUser(identifier, password);
    return {
      jwt: result.jwt,
      user: {
        id: result.user.id,
        username: result.user.username,
        email: result.user.email,
        provider: result.user.provider,
        confirmed: result.user.confirmed,
        blocked: result.user.blocked,
        createdAt: result.user.createdAt,
        updatedAt: result.user.updatedAt,
        lineId: result.user.lineId,
        backgroundImage: result.user.backgroundImage,
        fullName: result.user.fullName,
        gender: result.user.gender,
        address: result.user.address,
        cardID: result.user.cardID,
        telNumber: result.user.telNumber,
        userType: result.user.userType,
        point: result.user.point,
      },
    };
  } catch (error) {
    console.error("Authentication failed:", error.message);
    return null; // คืนค่า null แทนการคืนค่า false เพื่อบ่งชี้ว่าล้มเหลว
  }
};
