const { getFoodflieoptions } = require("./foodlieutils");

const flies = getFoodflieoptions();

const client = require('twilio')(
  flies.twilio_account_sid,
  flies.twilio_auth_token
);

const sendOrderConfirmation = async (phoneNumber, orderId) => {
  try {
    const cleanPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
    const message = await client.messages.create({
      from: `whatsapp:${flies.twilio_whatsapp_number || '+14155238886'}`,
      contentSid: flies.twilio_content_sid || 'HX229f5a04fd0510ce1b071852155d3e75',
      contentVariables: JSON.stringify({ "1": orderId.toString() }),
      to: `whatsapp:${cleanPhone}`,
    });
    console.log('WhatsApp message sent:', message.sid);
    return message.sid;
  } catch (error) {
    console.error('WhatsApp notification failed:', error.message);
    throw error;
  }
};

const sendOTP = async (phoneNumber, otp) => {
  try {
    const cleanPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
    const message = await client.messages.create({
      from: `whatsapp:${flies.twilio_whatsapp_number || '+14155238886'}`,
      body: `Your OTP is: ${otp}. Valid for 5 minutes.`,
      to: `whatsapp:${cleanPhone}`,
    });
    console.log('OTP sent via WhatsApp:', message.sid);
    return message.sid;
  } catch (error) {
    console.error('OTP send failed:', error.message);
    throw error;
  }
};

module.exports = { sendOrderConfirmation, sendOTP };
