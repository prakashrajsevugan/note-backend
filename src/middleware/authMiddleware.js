const prisma = require("../config/prisma");

let clerkMiddleware;
let getAuth;
let clerkClient;

const initClerk = async () => {
  if (!clerkMiddleware) {
    const clerkExpress = await import("@clerk/express");
    clerkMiddleware = clerkExpress.clerkMiddleware;
    getAuth = clerkExpress.getAuth;
    clerkClient = clerkExpress.clerkClient;
  }
};

const protect = async (req, res, next) => {
  try {
    await initClerk();

    // Run clerkMiddleware for the current request
    clerkMiddleware()(req, res, async (err) => {
      if (err) {
        return next(err);
      }

      const { userId } = getAuth(req);

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthenticated"
        });
      }

      // Check if user exists locally
      let user = await prisma.user.findUnique({
        where: { clerkId: userId }
      });

      if (!user) {
        try {
          // Fetch user details from Clerk API
          const clerkUser = await clerkClient.users.getUser(userId);
          const email = clerkUser.emailAddresses[0]?.emailAddress;
          const username = clerkUser.username || clerkUser.firstName || "User";

          user = await prisma.user.create({
            data: {
              clerkId: userId,
              email,
              username,
              password: "" // password not used
            }
          });
        } catch (clerkErr) {
          console.error("Clerk user sync error:", clerkErr);
          return res.status(401).json({
            success: false,
            message: "Failed to sync authenticated user details"
          });
        }
      }

      req.user = user;
      next();
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  protect
};