const foodflieOptions = {
  allowedOrigins: process.env.ALLOWED_ORIGINS,
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "foodapp",
  password: process.env.DB_PASSWORD || "your_password",
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || "admin@gmail.com",
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || "password",
  return_url:
    process.env.RETURN_URL || "http://localhost:5173/orderConfirmation",
  twilio_account_sid:
    process.env.TWILIO_ACCOUNT_SID || "your_twilio_account_sid",
  twilio_auth_token: process.env.TWILIO_AUTH_TOKEN || "your_twilio_auth_token",
  twilio_whatsapp_number:
    process.env.TWILIO_WHATSAPP_NUMBER || "whatsapp:+14155238886",
};

module.exports = foodflieOptions;
