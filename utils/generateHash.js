const bcrypt = require("bcryptjs");

const generateHash = async () => {
  const password = "Nanduboda@9"; // Change this to your desired password
  const hash = await bcrypt.hash(password, 10);

};

generateHash();
