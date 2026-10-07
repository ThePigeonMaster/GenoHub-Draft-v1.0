import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

function fail(label: string, error: unknown, status = 500) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`${label} failed:`, error);
  // `error` and `message` both carry the exact text so any frontend can show it.
  return NextResponse.json({ error: message, message }, { status });
}

export async function GET() {
  try {
    const customers = await prisma.customer.findMany({ orderBy: { name: 'asc' } });
    return NextResponse.json(customers);
  } catch (error) {
    return fail('GET /api/customers', error);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = str(body?.name);
    if (!name) {
      return fail('POST /api/customers', new Error('Customer name is required'), 400);
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
    return fail('POST /api/customers', error);
  }
}

// DELETE /api/customers?id=<customerId>   (or JSON body: { "id": "<customerId>" })
export async function DELETE(request: Request) {
  try {
    let id = new URL(request.url).searchParams.get('id');

    if (!id) {
      const body = await request.json().catch(() => null);
      id = typeof body?.id === 'string' ? body.id : null;
    }
    if (!id) {
      return fail('DELETE /api/customers', new Error('Customer id is required'), 400);
    }

    // Quotation.customerId is onDelete: SetNull, so saved quotations are kept.
    await prisma.customer.delete({ where: { id } });
    return NextResponse.json({ success: true, id });
  } catch (error) {
    if ((error as { code?: string })?.code === 'P2025') {
      return fail('DELETE /api/customers', new Error('Customer not found (already deleted?)'), 404);
    }
    return fail('DELETE /api/customers', error);
  }
}
