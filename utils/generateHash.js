const bcrypt = require("bcryptjs");

const generateHash = async () => {
  const password = "Kgrand@1";
  const hash = await bcrypt.hash(password, 10);
  console.log('Bcrypt Hash:', hash);
};

generateHash();
