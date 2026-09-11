import nodemailer from 'nodemailer';

export default async function handler(req: any, res: any) {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { email, otp } = body || {};

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    const emailHtml = `
      <div style="background-color: #0A0A0F; color: #ffffff; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 540px; margin: 0 auto; border-radius: 16px; border: 1px solid #222;">
        <div style="text-align: center; margin-bottom: 24px;">
          <span style="font-size: 24px; font-weight: 900; color: #ef4444; letter-spacing: 2px;">SHREX CLUB</span>
          <p style="color: #71717a; font-size: 11px; margin-top: 4px; text-transform: uppercase; letter-spacing: 1px;">Luxury Fitness & Athletic Performance</p>
        </div>
        <div style="background: #14141d; padding: 24px; border-radius: 12px; border: 1px solid #2a2a35; text-align: center;">
          <h2 style="font-size: 18px; color: #ffffff; margin-bottom: 12px;">Password Reset Verification</h2>
          <p style="color: #a1a1aa; font-size: 13px; line-height: 1.5; margin-bottom: 20px;">
            We received a request to reset your password for your SHREX CLUB account. Use the one-time verification code below:
          </p>
          <div style="background: #000000; border: 1px solid #10b981; border-radius: 8px; padding: 14px 20px; display: inline-block; margin-bottom: 20px;">
            <span style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #34d399; font-family: monospace;">${otp}</span>
          </div>
          <p style="color: #71717a; font-size: 11px;">This verification code is valid for 10 minutes. If you did not request this, please ignore this email.</p>
        </div>
        <div style="text-align: center; margin-top: 24px; color: #52525b; font-size: 11px;">
          © 2026 SHREX CLUB. All rights reserved.
        </div>
      </div>
    `;

    // 1. Resend API
    if (resendApiKey) {
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
          to: email,
          subject: `${otp} is your SHREX CLUB Security Code`,
          html: emailHtml,
        }),
      });

      if (resendRes.ok) {
        return res.status(200).json({ success: true, delivered: true, provider: 'resend', message: `OTP delivered to ${email}` });
      } else {
        const errText = await resendRes.text();
        console.error('Resend API error:', errText);
      }
    }

    // 2. Nodemailer fallback
    if (smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: `"SHREX CLUB Security" <${smtpUser}>`,
        to: email,
        subject: `${otp} is your SHREX CLUB Verification Code`,
        html: emailHtml,
      });

      return res.status(200).json({ success: true, delivered: true, provider: 'smtp', message: `OTP delivered to ${email}` });
    }

    return res.status(200).json({
      success: true,
      delivered: false,
      message: 'OTP generated. Please configure RESEND_API_KEY in environment variables for live delivery.',
    });
  } catch (error: any) {
    console.error('Failed to send email:', error);
    return res.status(500).json({ error: 'Failed to dispatch email', details: error?.message });
  }
}
