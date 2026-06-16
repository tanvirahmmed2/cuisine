import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { hashPassword } from '@/lib/middleware';
import crypto from 'crypto';
import { sendEmail } from '@/lib/brevo';

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();
    if (!name || !email || !password) {
       return NextResponse.json({ success: false, message: 'All fields required' }, { status: 400 });
    }

    if (password.length < 8) {
       return NextResponse.json({ success: false, message: 'Password must be at least 8 characters' }, { status: 400 });
    }

    const check = await query("SELECT user_id FROM ress_users WHERE email = $1", [email.toLowerCase().trim()]);
    if (check.rows.length > 0) {
       return NextResponse.json({ success: false, message: 'Email already exists' }, { status: 409 });
    }

    const hashed = await hashPassword(password);
    const verificationToken = crypto.randomBytes(32).toString('hex');
    
    const res = await query(
      "INSERT INTO ress_users (name, email, password, role, is_verified, verification_token) VALUES ($1, $2, $3, 'customer', false, $4) RETURNING *",
      [name, email.toLowerCase().trim(), hashed, verificationToken]
    );

    const user = res.rows[0];
    
    const verifyLink = `${process.env.BASE_URL || 'http://localhost:3000'}/verify?token=${verificationToken}`;
    
    await sendEmail({
      to: user.email,
      subject: 'Verify your Cuisine account',
      htmlContent: `
        <h2>Welcome to Cuisine!</h2>
        <p>Please click the link below to verify your email address:</p>
        <a href="${verifyLink}" style="display:inline-block;padding:10px 20px;background-color:#ec4899;color:white;text-decoration:none;border-radius:5px;">Verify Email</a>
        <p>Or copy and paste this link in your browser: <br/> ${verifyLink}</p>
      `
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Registration successful. Please check your email to verify your account.' 
    }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
