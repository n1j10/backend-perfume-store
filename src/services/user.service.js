const { clerkClient } = require("@clerk/express");

// Users live in Clerk (the schema only stores clerkId), so there is no user model.
const getProfile = async (userId) => {
  const user = await clerkClient.users.getUser(userId);

  const firstName = user.firstName || "عميل";
  const lastName = user.lastName || "";

  return {
    id: user.id,
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`.trim(),
    email: user.emailAddresses[0]?.emailAddress,
    imageUrl: user.imageUrl,
  };
};

module.exports = { getProfile };
