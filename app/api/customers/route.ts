import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

export async function GET() {
  try {
    const customers = await prisma.customer.findMany({ orderBy: { name: 'asc' } });
    return NextResponse.json(customers);
  } catch (error) {
    console.error('GET /api/customers failed:', error);
    return NextResponse.json({ error: 'Failed to load customers' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = str(body?.name);
    if (!name) {
      return NextResponse.json({ error: 'Customer name is required' }, { status: 400 });
    }

    const customer = await prisma.customer.create({
      data: {
        name,
        institute: str(body.institute),
        department: str(body.department),
        address: str(body.address),
        phone: str(body.phone),
        email: str(body.email),
      },
    });
    return NextResponse.json(customer, { status: 201 });
  } catch (error) {
    console.error('POST /api/customers failed:', error);
    return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 });
  }
}
