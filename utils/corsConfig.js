const { getFoodflieoptions } = require("./foodlieutils");


const corsOptions = {
  origin: (origin, callback) => {
    const flies = getFoodflieoptions();
    const allowedOrigins = flies?.allowedOrigins || [];

    // Additional dynamic origin patterns
    const allowedPatterns = [
      ...allowedOrigins,
      "http://localhost:5173",
      /^https:\/\/([a-zA-Z0-9-]+\.)*trycloudflare\.com$/,
      /^http:\/\/localhost(:\d+)?$/,
    ];

    // Allow requests with no origin (e.g. curl, internal calls)
    if (!origin) {
      return callback(null, true);
    }

    // Check if origin is allowed by string match or pattern
    const isAllowed = allowedPatterns.some((allowed) =>
      typeof allowed === "string" ? allowed === origin : allowed.test(origin)
    );

    if (isAllowed) {

      callback(null, true);
    } else {
      console.warn(` Blocked CORS origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

module.exports = { corsOptions };
