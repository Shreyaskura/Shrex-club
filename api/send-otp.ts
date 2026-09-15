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

    const brevoApiKey = process.env.BREVO_API_KEY;
    const brevoSender = process.env.BREVO_SENDER || 'shreyaskura@gmail.com';
    const resendApiKey = process.env.RESEND_API_KEY;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;

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

    // 1. Brevo API (Free 300 emails/day to any recipient, no Google 2-Step verification needed)
    if (brevoApiKey) {
      try {
        const brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'api-key': brevoApiKey,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            sender: {
              name: 'SHREX CLUB Security',
              email: brevoSender,
            },
            to: [{ email }],
            subject: `${otp} is your SHREX CLUB Security Code`,
            htmlContent: emailHtml,
          }),
        });

        if (brevoRes.ok) {
          return res.status(200).json({
            success: true,
            delivered: true,
            provider: 'brevo',
            serviceUsed: 'Brevo',
            message: `OTP delivered to ${email}`,
          });
        } else {
          const errText = await brevoRes.text();
          console.error('Brevo API error:', errText);
        }
      } catch (bErr: any) {
        console.error('Brevo API exception:', bErr?.message);
      }
    }

    let resendErrorText = '';
    let isSandboxRestricted = false;

    // 1. Resend API
    if (resendApiKey) {
      try {
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
          return res.status(200).json({
            success: true,
            delivered: true,
            provider: 'resend',
            serviceUsed: 'Resend',
            message: `OTP delivered to ${email}`,
          });
        } else {
          resendErrorText = await resendRes.text();
          console.error('Resend API error:', resendErrorText);
          if (resendErrorText.includes('only send testing emails to your own email address') || resendRes.status === 403) {
            isSandboxRestricted = true;
          }
        }
      } catch (err: any) {
        console.error('Resend fetch exception:', err?.message);
        resendErrorText = err?.message || 'Connection error';
      }
    }

    // 2. Nodemailer fallback (Gmail / Brevo SMTP)
    if (smtpUser && smtpPass) {
      try {
        const transportConfig: any = smtpHost
          ? {
              host: smtpHost,
              port: smtpPort,
              auth: {
                user: smtpUser,
                pass: smtpPass,
              },
            }
          : {
              service: 'gmail',
              auth: {
                user: smtpUser,
                pass: smtpPass,
              },
            };

        const transporter = nodemailer.createTransport(transportConfig);

        await transporter.sendMail({
          from: `"SHREX CLUB Security" <${smtpUser}>`,
          to: email,
          subject: `${otp} is your SHREX CLUB Verification Code`,
          html: emailHtml,
        });

        return res.status(200).json({
          success: true,
          delivered: true,
          provider: 'smtp',
          serviceUsed: smtpHost ? 'Brevo/SMTP' : 'Gmail/SMTP',
          message: `OTP delivered to ${email}`,
        });
      } catch (smtpErr: any) {
        console.error('SMTP send error:', smtpErr?.message);
      }
    }

    // 3. Fallback response when live delivery cannot complete
    return res.status(200).json({
      success: true,
      delivered: false,
      sandboxRestricted: isSandboxRestricted,
      fallbackOtp: otp,
      message: isSandboxRestricted
        ? 'Resend sandbox restriction: emails can only be delivered to account owner until a custom domain or Gmail SMTP is configured.'
        : 'Live email delivery not configured. Set SMTP_USER & SMTP_PASS in .env to deliver real emails to all users.',
      errorDetails: resendErrorText || undefined,
    });
  } catch (error: any) {
    console.error('Failed to send email:', error);
    return res.status(500).json({ error: 'Failed to dispatch email', details: error?.message });
  }
}
