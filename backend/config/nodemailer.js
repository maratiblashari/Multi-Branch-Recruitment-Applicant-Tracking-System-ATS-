const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// Verify connection
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Nodemailer Error:', error);
  } else {
    console.log('✅ Nodemailer ready to send emails');
  }
});

// ──────────────── Email Templates ────────────────

const sendShortlistEmail = async (to, candidateName, jobTitle, branch) => {
  await transporter.sendMail({
    from: `"Maratib HR" <${process.env.GMAIL_USER}>`,
    to,
    subject: `🎉 Congratulations! You've been Shortlisted — ${jobTitle}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#1a237e,#4a148c);padding:30px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:24px;">Maratib Recruitment</h1>
        </div>
        <div style="padding:30px;">
          <h2 style="color:#1a237e;">Dear ${candidateName},</h2>
          <p style="color:#555;line-height:1.7;">We are pleased to inform you that your application for the position of <strong>${jobTitle}</strong> at our <strong>${branch}</strong> branch has been <span style="color:#2e7d32;font-weight:bold;">shortlisted</span>.</p>
          <p style="color:#555;line-height:1.7;">Our HR team will reach out to you shortly with further details regarding the next steps in the selection process.</p>
          <div style="background:#f3f4f6;border-radius:6px;padding:16px;margin:20px 0;">
            <p style="margin:0;color:#444;"><strong>Position:</strong> ${jobTitle}</p>
            <p style="margin:8px 0 0;color:#444;"><strong>Branch:</strong> ${branch}</p>
          </div>
          <p style="color:#555;">Best regards,<br/><strong>HR Team — Maratib</strong></p>
        </div>
        <div style="background:#f9f9f9;padding:16px;text-align:center;color:#999;font-size:12px;">
          This is an automated email. Please do not reply directly to this message.
        </div>
      </div>
    `,
  });
};

const sendInterviewEmail = async (to, candidateName, jobTitle, date, time, message) => {
  await transporter.sendMail({
    from: `"Maratib HR" <${process.env.GMAIL_USER}>`,
    to,
    subject: `📅 Interview Invitation — ${jobTitle}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#1a237e,#4a148c);padding:30px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:24px;">Maratib Recruitment</h1>
        </div>
        <div style="padding:30px;">
          <h2 style="color:#1a237e;">Dear ${candidateName},</h2>
          <p style="color:#555;line-height:1.7;">We are delighted to invite you for an <strong>interview</strong> for the position of <strong>${jobTitle}</strong>.</p>
          <div style="background:#e8f5e9;border-left:4px solid #2e7d32;border-radius:4px;padding:16px;margin:20px 0;">
            <p style="margin:0;color:#1b5e20;"><strong>📅 Date:</strong> ${date}</p>
            <p style="margin:8px 0 0;color:#1b5e20;"><strong>⏰ Time:</strong> ${time}</p>
          </div>
          ${message ? `<div style="background:#f3f4f6;border-radius:6px;padding:16px;margin:20px 0;"><p style="margin:0;color:#444;"><strong>Message from HR:</strong></p><p style="margin:8px 0 0;color:#555;">${message}</p></div>` : ''}
          <p style="color:#555;">Please confirm your attendance by replying to this email.</p>
          <p style="color:#555;">Best regards,<br/><strong>HR Team — Maratib</strong></p>
        </div>
        <div style="background:#f9f9f9;padding:16px;text-align:center;color:#999;font-size:12px;">
          This is an automated email. Please do not reply directly to this message.
        </div>
      </div>
    `,
  });
};

const sendRejectionEmail = async (to, candidateName, jobTitle) => {
  await transporter.sendMail({
    from: `"Maratib HR" <${process.env.GMAIL_USER}>`,
    to,
    subject: `Update on Your Application — ${jobTitle}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#1a237e,#4a148c);padding:30px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:24px;">Maratib Recruitment</h1>
        </div>
        <div style="padding:30px;">
          <h2 style="color:#1a237e;">Dear ${candidateName},</h2>
          <p style="color:#555;line-height:1.7;">Thank you for your interest in the <strong>${jobTitle}</strong> position at Maratib and for the time you invested in the application process.</p>
          <p style="color:#555;line-height:1.7;">After careful consideration, we regret to inform you that we will not be moving forward with your application at this time. We had many highly qualified candidates and this was a difficult decision.</p>
          <p style="color:#555;line-height:1.7;">We encourage you to apply for future openings that match your skills and experience. We will keep your profile on file for future consideration.</p>
          <p style="color:#555;">Best regards,<br/><strong>HR Team — Maratib</strong></p>
        </div>
        <div style="background:#f9f9f9;padding:16px;text-align:center;color:#999;font-size:12px;">
          This is an automated email. Please do not reply directly to this message.
        </div>
      </div>
    `,
  });
};

const sendSelectionEmail = async (to, candidateName, jobTitle, branch) => {
  await transporter.sendMail({
    from: `"Maratib HR" <${process.env.GMAIL_USER}>`,
    to,
    subject: `🎊 Offer of Employment — ${jobTitle}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#1a237e,#4a148c);padding:30px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:24px;">Maratib Recruitment</h1>
        </div>
        <div style="padding:30px;">
          <h2 style="color:#1a237e;">Dear ${candidateName},</h2>
          <p style="color:#555;line-height:1.7;">We are thrilled to inform you that you have been <span style="color:#2e7d32;font-weight:bold;">SELECTED</span> for the position of <strong>${jobTitle}</strong> at our <strong>${branch}</strong> branch!</p>
          <p style="color:#555;line-height:1.7;">Our HR team will contact you shortly with the formal offer letter and onboarding details. Please keep an eye on your inbox.</p>
          <p style="color:#555;">Congratulations and welcome to the Maratib family! 🎉</p>
          <p style="color:#555;">Best regards,<br/><strong>HR Team — Maratib</strong></p>
        </div>
        <div style="background:#f9f9f9;padding:16px;text-align:center;color:#999;font-size:12px;">
          This is an automated email. Please do not reply directly to this message.
        </div>
      </div>
    `,
  });
};

const sendCustomEmail = async (to, candidateName, subject, message) => {
  await transporter.sendMail({
    from: `"Maratib HR" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#1a237e,#4a148c);padding:30px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:24px;">Maratib Recruitment</h1>
        </div>
        <div style="padding:30px;">
          <h2 style="color:#1a237e;">Dear ${candidateName},</h2>
          <div style="color:#555;line-height:1.7;">${message}</div>
          <p style="color:#555;margin-top:20px;">Best regards,<br/><strong>HR Team — Maratib</strong></p>
        </div>
        <div style="background:#f9f9f9;padding:16px;text-align:center;color:#999;font-size:12px;">
          This is an automated email. Please do not reply directly to this message.
        </div>
      </div>
    `,
  });
};

module.exports = {
  transporter,
  sendShortlistEmail,
  sendInterviewEmail,
  sendRejectionEmail,
  sendSelectionEmail,
  sendCustomEmail,
};
