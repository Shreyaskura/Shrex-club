import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import nodemailer from 'nodemailer'

function emailOtpPlugin(env: Record<string, string>): Plugin {
  return {
    name: 'email-otp-server',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/send-otp' && req.method === 'POST') {
          let body = ''
          req.on('data', (chunk) => {
            body += chunk
          })
          req.on('end', async () => {
            try {
              const { email, otp } = JSON.parse(body || '{}')
              if (!email || !otp) {
                res.statusCode = 400
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ error: 'Email and OTP are required' }))
                return
              }

              console.log(`\n📧 [SHREX OTP DISPATCH] Sending OTP to: ${email}`)
              console.log(`🔑 [DEV CONSOLE OTP CODE]: ${otp}\n`)

              const smtpUser = env.SMTP_USER || process.env.SMTP_USER
              const smtpPass = env.SMTP_PASS || process.env.SMTP_PASS
              const resendApiKey = env.RESEND_API_KEY || process.env.RESEND_API_KEY

              let delivered = false
              let serviceUsed = 'none'

              // 1. Try Resend if configured
              if (resendApiKey) {
                try {
                  const resendRes = await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                      Authorization: `Bearer ${resendApiKey}`,
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      from: env.EMAIL_FROM || 'SHREX CLUB <onboarding@resend.dev>',
                      to: email,
                      subject: `${otp} is your SHREX CLUB Security Code`,
                      html: `
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
                      `,
                    }),
                  })
                  if (resendRes.ok) {
                    delivered = true
                    serviceUsed = 'Resend'
                    console.log(`✅ [RESEND] Real email successfully sent to ${email}`)
                  } else {
                    const errData = await resendRes.text()
                    console.error(`❌ [RESEND ERROR]:`, errData)
                  }
                } catch (err) {
                  console.error('❌ [RESEND EXCEPTION]:', err)
                }
              }

              // 2. Try Nodemailer (Gmail / SMTP) if configured
              if (!delivered && smtpUser && smtpPass) {
                try {
                  const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                      user: smtpUser,
                      pass: smtpPass,
                    },
                  })

                  await transporter.sendMail({
                    from: `"SHREX CLUB Security" <${smtpUser}>`,
                    to: email,
                    subject: `${otp} is your SHREX CLUB Verification Code`,
                    html: `
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
                    `,
                  })
                  delivered = true
                  serviceUsed = 'Gmail/SMTP'
                  console.log(`✅ [GMAIL SMTP] Real email successfully delivered to ${email}`)
                } catch (err) {
                  console.error('❌ [GMAIL SMTP ERROR]:', err)
                }
              }

              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.end(
                JSON.stringify({
                  success: true,
                  delivered,
                  serviceUsed,
                  message: delivered
                    ? `OTP email successfully dispatched to ${email}`
                    : `OTP generated securely. (To deliver live emails to ${email}, add your Gmail App Password or RESEND_API_KEY in .env)`,
                })
              )
            } catch (error) {
              console.error('Error handling /api/send-otp:', error)
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'Failed to process OTP request' }))
            }
          })
          return
        }
        next()
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), emailOtpPlugin(env)],
  }
})
