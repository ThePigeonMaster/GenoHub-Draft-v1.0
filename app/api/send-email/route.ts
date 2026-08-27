import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { to, cc, subject, text } = await request.json();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'genomaxstaff@gmail.com',
        pass: 'qkxi kksa efxr nuhb',
      },
    });

    await transporter.sendMail({
      from: '"GenoHub System" <genomaxstaff@gmail.com>',
      to,
      cc,
      subject,
      text,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}