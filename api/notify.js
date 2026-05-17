export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const payload = req.body;
    const email = payload?.record?.email;

    if (!email) {
      return res.status(400).json({ error: 'No email in payload' });
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'PawBooking <notifications@pawbooking.net>',
        to: 'KamdrinOverholt@gmail.com',
        subject: '🐾 New PawBooking Waitlist Signup!',
        html: `
          <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:32px;background:#f9f9f9;border-radius:12px;">
            <h2 style="color:#2D6A4F;margin-bottom:8px;">New Waitlist Signup 🐾</h2>
            <p style="color:#444;font-size:16px;">Someone just joined the PawBooking waitlist.</p>
            <div style="background:white;border:1px solid #e0e0e0;border-radius:8px;padding:20px;margin:24px 0;">
              <p style="margin:0;font-size:14px;color:#888;text-transform:uppercase;letter-spacing:1px;">Email</p>
              <p style="margin:8px 0 0;font-size:18px;font-weight:700;color:#1a1a1a;">${email}</p>
            </div>
            <p style="color:#888;font-size:13px;">Signed up: ${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })} PT</p>
            <a href="https://supabase.com/dashboard/project/lszifwrtshljohauwnfq/editor" style="display:inline-block;margin-top:16px;background:#2D6A4F;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">View in Supabase →</a>
          </div>
        `
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Resend error:', error);
      return res.status(500).json({ error: 'Failed to send email' });
    }

    return res.status(200).json({ ok: true });

  } catch (err) {
    console.error('Handler error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
