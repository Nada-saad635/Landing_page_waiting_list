interface EssayTestEmailTemplateProps {
  email: string
  university: string
  isUAEEmail: boolean
}

const EssayTestEmailTemplate = ({ email, university, isUAEEmail }: EssayTestEmailTemplateProps) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Welcome to EssayTest Waitlist!</title>
      </head>
      <body style="font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; padding: 20px; background-color: #f8fafc;">
        <div style="max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="background: rgba(255,255,255,0.1); padding: 30px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.2);">
            <div style="width: 60px; height: 60px; background: rgba(255,255,255,0.2); border-radius: 12px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
              <span style="color: white; font-size: 24px; font-weight: bold;">E</span>
            </div>
            <h1 style="color: white; font-size: 28px; margin: 0; font-weight: 700;">Welcome to EssayTest!</h1>
            <p style="color: rgba(255,255,255,0.9); font-size: 16px; margin: 10px 0 0;">Smart Learning for UAE Students</p>
          </div>

          <!-- Main Content -->
          <div style="padding: 40px 30px; background: white;">
            <h2 style="color: #1e293b; font-size: 24px; margin-bottom: 20px; font-weight: 600;">
              ${isUAEEmail ? "🎉 Priority Access Confirmed!" : "✅ You're on the Waitlist!"}
            </h2>
            
            <p style="color: #475569; font-size: 16px; margin-bottom: 20px;">
              Thank you for joining EssayTest! We've received your registration details:
            </p>

            <div style="background: #f1f5f9; border-radius: 12px; padding: 20px; margin: 20px 0;">
              <p style="margin: 0; color: #334155;"><strong>Email:</strong> ${email}</p>
              <p style="margin: 10px 0 0; color: #334155;"><strong>University:</strong> ${university}</p>
              ${isUAEEmail ? '<p style="margin: 10px 0 0; color: #059669; font-weight: 600;">✨ UAE University Email Detected - Priority Access!</p>' : ""}
            </div>

            <h3 style="color: #1e293b; font-size: 20px; margin: 30px 0 15px; font-weight: 600;">What's Coming Next?</h3>
            
            <ul style="color: #475569; font-size: 16px; line-height: 1.8; padding-left: 20px;">
              <li><strong>Smart Question Bank:</strong> Access thousands of past exam questions organized by subject and difficulty</li>
              <li><strong>AI-Powered Practice:</strong> Get personalized questions tailored to your learning style</li>
              <li><strong>Interactive Learning:</strong> Step-by-step hints and video explanations</li>
              <li><strong>Peer Collaboration:</strong> Connect with fellow UAE university students</li>
              <li><strong>Cultural Integration:</strong> Built specifically for the UAE education system</li>
            </ul>

            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 25px; margin: 30px 0; text-align: center;">
              <h3 style="color: white; margin: 0 0 15px; font-size: 18px; font-weight: 600;">Early Access Benefits</h3>
              <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 14px;">
                As a waitlist member, you'll get exclusive early access, special pricing, and the chance to shape our platform with your feedback.
              </p>
            </div>

            <p style="color: #475569; font-size: 16px; margin: 30px 0 20px;">
              We're working hard to create the ultimate study companion for UAE university students. Stay tuned for updates!
            </p>

            <p style="color: #475569; font-size: 16px; margin: 30px 0 20px;">Best regards,</p>
            <p style="color: #1e293b; font-size: 16px; font-weight: 600; margin: 0;">The EssayTest Team</p>
          </div>

          <!-- Footer -->
          <div style="background: #1e293b; padding: 25px 30px; text-align: center;">
            <p style="color: #94a3b8; font-size: 14px; margin: 0;">
              Follow us for updates and study tips
            </p>
            <div style="margin-top: 15px;">
              <a href="#" style="color: #60a5fa; text-decoration: none; margin: 0 10px; font-size: 14px;">Instagram</a>
              <a href="#" style="color: #60a5fa; text-decoration: none; margin: 0 10px; font-size: 14px;">LinkedIn</a>
              <a href="#" style="color: #60a5fa; text-decoration: none; margin: 0 10px; font-size: 14px;">Twitter</a>
            </div>
          </div>
        </div>
      </body>
    </html>
  `
}

export default EssayTestEmailTemplate
