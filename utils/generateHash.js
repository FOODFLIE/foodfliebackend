const bcrypt = require("bcryptjs");

const generateHash = async () => {
  const password = "Nanduboda@9"; // Change this to your desired password
  const hash = await bcrypt.hash(password, 10);
  console.log("Password Hash:", hash);
  console.log("\nAdd this to your .env file:");
  console.log(`ADMIN_PASSWORD_HASH=${hash}`);
};

generateHash();
