const twilio = require('twilio');
const { sendReminder: sendEmail } = require('./emailService');

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Send SMS
const sendSMS = async (to, body) => {
  try {
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
      console.log('Twilio not configured, skipping SMS');
      return false;
    }
    await client.messages.create({
      body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to
    });
    console.log(`SMS sent to ${to}`);
    return true;
  } catch (err) {
    console.error('SMS error:', err);
    return false;
  }
};

// Send WhatsApp
const sendWhatsApp = async (to, body) => {
  try {
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_WHATSAPP_NUMBER) {
      console.log('Twilio WhatsApp not configured, skipping WhatsApp');
      return false;
    }
    const whatsappTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;
    await client.messages.create({
      body,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: whatsappTo
    });
    console.log(`WhatsApp sent to ${to}`);
    return true;
  } catch (err) {
    console.error('WhatsApp error:', err);
    return false;
  }
};

// Unified sender (respects user preference)
const sendReminder = async (user, channel, subject, text) => {
  const preferred = channel || user.reminderChannel || 'email';
  
  if (preferred === 'email' && user.email) {
    return await sendEmail(user.email, subject, text);
  } else if (preferred === 'sms' && user.phone) {
    return await sendSMS(user.phone, text);
  } else if (preferred === 'whatsapp' && user.whatsapp) {
    return await sendWhatsApp(user.whatsapp, text);
  } else {
    // fallback to email
    return await sendEmail(user.email, subject, text);
  }
};

module.exports = { sendSMS, sendWhatsApp, sendReminder };
