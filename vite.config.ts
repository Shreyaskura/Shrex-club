import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import nodemailer from 'nodemailer'
import fs from 'node:fs'
import path from 'node:path'

// In-memory online heartbeat map: email -> last active timestamp (ms)
const activeHeartbeats = new Map<string, number>()

function getMembersFilePath(): string {
  const dir = path.resolve(process.cwd(), 'data')
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  const file = path.join(dir, 'members_db.json')
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, '[]', 'utf-8')
  }
  return file
}

function getActivityFilePath(): string {
  const dir = path.resolve(process.cwd(), 'data')
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  const file = path.join(dir, 'activity_log.json')
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, '[]', 'utf-8')
  }
  return file
}

function readMembers(): any[] {
  try {
    const filePath = getMembersFilePath()
    const content = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(content || '[]')
  } catch (err) {
    console.error('Error reading members_db.json:', err)
    return []
  }
}

const CLOUD_MEMBERS_URL = 'https://api.restful-api.dev/objects/ff808181a067127101a08f60221b72d1'
const CLOUD_ACTIVITY_URL = 'https://api.restful-api.dev/objects/ff808181a067127101a08f60ec3a72d3'

function writeMembers(members: any[]): void {
  try {
    const filePath = getMembersFilePath()
    fs.writeFileSync(filePath, JSON.stringify(members, null, 2), 'utf-8')
    fetch(CLOUD_MEMBERS_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Shrex Club Members DB', data: { members } }),
    }).catch(() => {})
  } catch (err) {
    console.error('Error writing members_db.json:', err)
  }
}

function readActivities(): any[] {
  try {
    const filePath = getActivityFilePath()
    const content = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(content || '[]')
  } catch (err) {
    console.error('Error reading activity_log.json:', err)
    return []
  }
}

function recordActivity(type: 'USER_REGISTERED' | 'USER_ENTERED' | 'MEMBERSHIP_RENEWED', member: any): any {
  try {
    const activities = readActivities()
    const now = Date.now()
    const event = {
      id: `ACT-${now}-${Math.floor(100 + Math.random() * 900)}`,
      type,
      member: {
        id: member.id,
        name: member.name,
        email: member.email,
        tier: member.tier || 'Essential',
      },
      timestamp: now,
      formattedTime: new Date(now).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      date: new Date(now).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    }

    // Keep the most recent 100 activities
    const updated = [event, ...activities].slice(0, 100)
    const filePath = getActivityFilePath()
    fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), 'utf-8')

    // Also update heartbeat
    if (member.email) {
      activeHeartbeats.set(member.email.toLowerCase(), now)
    }

    // Mirror to cloud activity datastore
    fetch(CLOUD_ACTIVITY_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Shrex Club Activity DB',
        data: {
          activities: updated,
          heartbeats: Object.fromEntries(activeHeartbeats),
        },
      }),
    }).catch(() => {})

    console.log(`\n🔔 [SHREX LIVE TELEMETRY] ${type}: ${member.name} (${member.email}) at ${event.formattedTime}`)
    return event
  } catch (err) {
    console.error('Failed to log activity:', err)
    return null
  }
}

function memberPersistencePlugin(): Plugin {
  return {
    name: 'shrex-member-persistence-server',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const urlPath = (req.url || '').split('?')[0]

        // Set CORS headers for all /api requests
        if (urlPath.startsWith('/api/')) {
          res.setHeader('Access-Control-Allow-Origin', '*')
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')

          if (req.method === 'OPTIONS') {
            res.statusCode = 200
            res.end()
            return
          }
        }

        // 1. GET /api/members
        if (urlPath === '/api/members' && req.method === 'GET') {
          const members = readMembers()
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ success: true, members }))
          return
        }

        // 2. POST /api/members (Register, Login, Renew, Expire, Password Reset, Upsert)
        if (urlPath === '/api/members' && req.method === 'POST') {
          let body = ''
          req.on('data', (chunk) => {
            body += chunk
          })
          req.on('end', () => {
            try {
              const data = JSON.parse(body || '{}')
              const { action, member, email, password, id, days } = data
              let members = readMembers()
              let newEvent = null

              if (action === 'register' && member) {
                const cleanEmail = member.email.trim().toLowerCase()
                const existingIdx = members.findIndex((m: any) => m.email.toLowerCase() === cleanEmail)
                const newRecord = {
                  ...member,
                  email: cleanEmail,
                  isOnline: true,
                  lastLogin: 'Just Now',
                  lastLoginTimestamp: Date.now(),
                }
                if (existingIdx >= 0) {
                  members[existingIdx] = { ...members[existingIdx], ...newRecord }
                } else {
                  members = [newRecord, ...members]
                }
                writeMembers(members)
                newEvent = recordActivity('USER_REGISTERED', newRecord)
              } else if (action === 'login' && email) {
                const cleanEmail = email.trim().toLowerCase()
                activeHeartbeats.set(cleanEmail, Date.now())
                const existingIdx = members.findIndex((m: any) => m.email.toLowerCase() === cleanEmail)
                let userRec: any = null

                if (existingIdx >= 0) {
                  members[existingIdx].lastLogin = 'Just Now'
                  members[existingIdx].lastLoginTimestamp = Date.now()
                  members[existingIdx].isOnline = true
                  if (member && member.name) members[existingIdx].name = member.name
                  if (member && member.tier) members[existingIdx].tier = member.tier
                  userRec = members[existingIdx]
                } else {
                  userRec = {
                    ...(member || {}),
                    id: member?.id || `MEM-${Math.floor(1000 + Math.random() * 9000)}`,
                    name: member?.name || cleanEmail.split('@')[0],
                    email: cleanEmail,
                    role: 'user',
                    tier: member?.tier || 'Essential',
                    joinedDate:
                      member?.joinedDate ||
                      new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                    joinedTimestamp: member?.joinedTimestamp || Date.now(),
                    membershipExpiryDate: member?.membershipExpiryDate || 'In 30 Days',
                    membershipExpiryTimestamp: member?.membershipExpiryTimestamp || Date.now() + 30 * 24 * 60 * 60 * 1000,
                    isExpired: false,
                    isOnline: true,
                    lastLogin: 'Just Now',
                    lastLoginTimestamp: Date.now(),
                  }
                  members = [userRec, ...members]
                }
                writeMembers(members)
                newEvent = recordActivity('USER_ENTERED', userRec)
              } else if (action === 'renew' && id) {
                const renewDays = days || 30
                const now = Date.now()
                members = members.map((m: any) => {
                  if (m.id === id) {
                    const base = m.membershipExpiryTimestamp && m.membershipExpiryTimestamp > now ? m.membershipExpiryTimestamp : now
                    const newTs = base + renewDays * 24 * 60 * 60 * 1000
                    const newDate = new Date(newTs).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                    const updated = { ...m, isExpired: false, membershipExpiryTimestamp: newTs, membershipExpiryDate: newDate }
                    newEvent = recordActivity('MEMBERSHIP_RENEWED', updated)
                    return updated
                  }
                  return m
                })
                writeMembers(members)
              } else if (action === 'expire' && id) {
                members = members.map((m: any) => {
                  if (m.id === id) {
                    return {
                      ...m,
                      isExpired: true,
                      membershipExpiryDate: 'Expired (' + new Date().toLocaleDateString('en-GB') + ')',
                    }
                  }
                  return m
                })
                writeMembers(members)
              } else if (action === 'reset-password' && email && password) {
                const cleanEmail = email.trim().toLowerCase()
                members = members.map((m: any) => {
                  if (m.email.toLowerCase() === cleanEmail) {
                    return { ...m, password }
                  }
                  return m
                })
                writeMembers(members)
              } else if (member) {
                const cleanEmail = member.email.trim().toLowerCase()
                const existingIdx = members.findIndex((m: any) => m.email.toLowerCase() === cleanEmail)
                if (existingIdx >= 0) {
                  members[existingIdx] = { ...members[existingIdx], ...member }
                } else {
                  members = [member, ...members]
                }
                writeMembers(members)
              }

              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ success: true, members, newEvent }))
            } catch (err: any) {
              console.error('POST /api/members error:', err)
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'Failed to update members database', details: err?.message }))
            }
          })
          return
        }

        // 3. PUT /api/members (Bulk overwrite / clean sync)
        if (urlPath === '/api/members' && req.method === 'PUT') {
          let body = ''
          req.on('data', (chunk) => {
            body += chunk
          })
          req.on('end', () => {
            try {
              const { members } = JSON.parse(body || '{}')
              if (Array.isArray(members)) {
                writeMembers(members)
              }
              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ success: true, members: readMembers() }))
            } catch (err: any) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'Failed to bulk update members' }))
            }
          })
          return
        }

        // 4. DELETE /api/members
        if (urlPath === '/api/members' && req.method === 'DELETE') {
          const parsedUrl = new URL(req.url || '/', 'http://localhost')
          const queryId = parsedUrl.searchParams.get('id')

          let body = ''
          req.on('data', (chunk) => {
            body += chunk
          })
          req.on('end', () => {
            try {
              let idToDelete = queryId
              if (!idToDelete && body) {
                const parsed = JSON.parse(body)
                idToDelete = parsed.id
              }
              if (idToDelete) {
                let members = readMembers()
                members = members.filter((m: any) => m.id !== idToDelete)
                writeMembers(members)
              }
              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ success: true, members: readMembers() }))
            } catch (err: any) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'Failed to delete member' }))
            }
          })
          return
        }

        // 5. GET /api/activity (Real-Time Activity Stream + Online User List)
        if (urlPath === '/api/activity' && req.method === 'GET') {
          const parsedUrl = new URL(req.url || '/', 'http://localhost')
          const since = Number(parsedUrl.searchParams.get('since') || 0)

          const allActivities = readActivities()
          const filtered = since > 0 ? allActivities.filter((a) => a.timestamp > since) : allActivities

          // Check online users active in last 3 minutes (180,000ms)
          const now = Date.now()
          const onlineEmails: string[] = []
          for (const [email, lastActive] of activeHeartbeats.entries()) {
            if (now - lastActive <= 180000) {
              onlineEmails.push(email)
            }
          }

          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({
            success: true,
            activities: filtered,
            onlineEmails,
            serverTime: now,
          }))
          return
        }

        // 6. POST /api/activity/heartbeat
        if (urlPath === '/api/activity/heartbeat' && req.method === 'POST') {
          let body = ''
          req.on('data', (chunk) => {
            body += chunk
          })
          req.on('end', () => {
            try {
              const { email } = JSON.parse(body || '{}')
              if (email) {
                activeHeartbeats.set(email.trim().toLowerCase(), Date.now())
              }
              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ success: true }))
            } catch (err) {
              res.statusCode = 400
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'Invalid heartbeat payload' }))
            }
          })
          return
        }

        next()
      })
    },
  }
}

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

              const brevoApiKey = env.BREVO_API_KEY || process.env.BREVO_API_KEY
              const brevoSender = env.BREVO_SENDER || process.env.BREVO_SENDER || 'shreyaskura@gmail.com'
              const smtpUser = env.SMTP_USER || process.env.SMTP_USER
              const smtpPass = env.SMTP_PASS || process.env.SMTP_PASS
              const smtpHost = env.SMTP_HOST || process.env.SMTP_HOST
              const smtpPort = Number(env.SMTP_PORT || process.env.SMTP_PORT || 587)
              const resendApiKey = env.RESEND_API_KEY || process.env.RESEND_API_KEY

              let delivered = false
              let serviceUsed = 'none'
              let isSandboxRestricted = false
              let resendErrorText = ''

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
              `

              // 1. Try Brevo API if configured (Free 300 emails/day, no Google 2-Step needed)
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
                  })
                  if (brevoRes.ok) {
                    delivered = true
                    serviceUsed = 'Brevo'
                    console.log(`✅ [BREVO] Real email successfully sent to ${email}`)
                  } else {
                    const bErr = await brevoRes.text()
                    console.error(`❌ [BREVO ERROR]:`, bErr)
                  }
                } catch (err: any) {
                  console.error('❌ [BREVO EXCEPTION]:', err?.message)
                }
              }

              // 2. Try Resend if not delivered
              if (!delivered && resendApiKey) {
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
                      html: emailHtml,
                    }),
                  })
                  if (resendRes.ok) {
                    delivered = true
                    serviceUsed = 'Resend'
                    console.log(`✅ [RESEND] Real email successfully sent to ${email}`)
                  } else {
                    resendErrorText = await resendRes.text()
                    console.error(`❌ [RESEND ERROR]:`, resendErrorText)
                    if (resendErrorText.includes('only send testing emails to your own email address') || resendRes.status === 403) {
                      isSandboxRestricted = true
                      console.warn(`⚠️ [RESEND SANDBOX RESTRICTION] Recipient (${email}) blocked by Resend sandbox. Resend free tier only delivers to account owner until a custom domain or Gmail SMTP is configured.`)
                    }
                  }
                } catch (err: any) {
                  console.error('❌ [RESEND EXCEPTION]:', err?.message)
                  resendErrorText = err?.message || 'Connection failed'
                }
              }

              // 3. Try Nodemailer (Brevo SMTP or Gmail SMTP) if configured
              if (!delivered && smtpUser && smtpPass) {
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
                      }

                  const transporter = nodemailer.createTransport(transportConfig)

                  await transporter.sendMail({
                    from: `"SHREX CLUB Security" <${smtpUser}>`,
                    to: email,
                    subject: `${otp} is your SHREX CLUB Verification Code`,
                    html: emailHtml,
                  })
                  delivered = true
                  serviceUsed = smtpHost ? 'Brevo/SMTP' : 'Gmail/SMTP'
                  console.log(`✅ [SMTP] Real email successfully delivered to ${email} via ${serviceUsed}`)
                } catch (err: any) {
                  console.error('❌ [SMTP ERROR]:', err?.message)
                }
              }

              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.end(
                JSON.stringify({
                  success: true,
                  delivered,
                  serviceUsed,
                  sandboxRestricted: isSandboxRestricted,
                  fallbackOtp: otp,
                  message: delivered
                    ? `OTP email successfully dispatched to ${email} via ${serviceUsed}`
                    : isSandboxRestricted
                      ? `Resend Sandbox Mode: Direct email delivery to external addresses is restricted until a custom domain or Gmail SMTP is configured.`
                      : `OTP generated securely. (To deliver live emails to ${email}, add your Gmail App Password in .env)`,
                  errorDetails: resendErrorText || undefined,
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
    server: {
      host: true,
      port: 5173,
      allowedHosts: true,
    },
    plugins: [react(), memberPersistencePlugin(), emailOtpPlugin(env)],
  }
})

