// src/api/business/login.ts

import { authenticateUser } from "../strapi/authApi";

export const loginWithLineId = async (lineId: string) => {
  const identifier = `cook${lineId}@cook.com`;
  const password = "cookcook";

  console.log(
    "loginWithLineId identifier :",
    identifier,
    "loginWithLineId password :",
    password
  );

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
    return false;
  }
};
