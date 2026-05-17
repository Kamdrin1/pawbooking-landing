export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body;
    const email = body?.record?.email;
    const signedUpAt = new Date().toLocaleString('en-US', {
      timeZone: 'America/Los_Angeles',
      dateStyle: 'medium',
      timeStyle: 'short'
    });

    if (!email) {
      return res.status(400).json({ error: 'No email found in payload' });
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'PawBooking <onboarding@resend.dev>',
        to: 'KamdrinOverholt@gmail.com',
        subject: '🐾 New PawBooking Waitlist Signup!',
        html: `
          <div style="font-family: -apple-system, sans-serif; max-width: 520px; margin: 0 auto; padding: 40px 32px; background: #FDFCF8;">
            <div style="background: #2D6A4F; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 32px;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px;">🐾 New Waitlist Signup!</h1>
            </div>
            <p style="color: #44403C; font-size: 16px; line-height: 1.6;">
              Someone just joined the PawBooking waitlist. Here are their details:
            </p>
            <div style="background: #D8F3DC; border: 1px solid #52B788; border-radius: 10px; padding: 20px 24px; margin: 24px 0;">
              <p style="margin: 0 0 8px; font-size: 13px; color: #2D6A4F; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Email Address</p>
              <p style="margin: 0; font-size: 20px; font-weight: 700; color: #1B4332;">${email}</p>
            </div>
            <p style="color: #78716C; font-size: 13px;">Signed up: ${signedUpAt} (Pacific Time)</p>
            <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #E7E2D8;">
              <p style="color: #78716C; font-size: 13px; margin: 0;">
                View all signups in your 
                <a href="https://supabase.com/dashboard/project/lszifwrtshljohauwnfq/editor" style="color: #2D6A4F; font-weight: 600;">Supabase dashboard</a>
                · Reach out to this groomer personally for maximum conversion.
              </p>
            </div>
          </div>
        `
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Resend error: ${errorText}`);
    }

    return res.status(200).json({ ok: true });

  } catch (error) {
    console.error('Notification error:', error);
    return res.status(500).json({ error: error.message });
  }
}
