import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const str = (v: unknown) => (typeof v === 'string' ? v : '');
const num = (v: unknown) => {
  const n = typeof v === 'number' ? v : parseFloat(String(v));
  return Number.isFinite(n) ? n : 0;
};

export async function GET() {
  try {
    const quotations = await prisma.quotation.findMany({
      orderBy: { updatedAt: 'desc' },
      include: { items: { orderBy: { position: 'asc' } } },
    });
    return NextResponse.json(quotations);
  } catch (error) {
    console.error('GET /api/quotations failed:', error);
    return NextResponse.json({ error: 'Failed to load quotations' }, { status: 500 });
  }
}

// Create when `id` is absent, update when `id` is present.
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const quoteNo = str(body?.quoteNo).trim();
    if (!quoteNo) {
      return NextResponse.json({ error: 'Quotation No. is required' }, { status: 400 });
    }
    if (!Array.isArray(body.items)) {
      return NextResponse.json({ error: 'items must be an array' }, { status: 400 });
    }

    const items = body.items.map((it: Record<string, unknown>, index: number) => ({
      position: index,
      catNo: str(it.catNo),
      desc: str(it.desc),
      qty: num(it.qty),
      price: num(it.price),
    }));

    // Totals are always recomputed on the server; the client value is never trusted.
    const subtotal = items.reduce((acc: number, it: { qty: number; price: number }) => acc + it.qty * it.price, 0);

    const data = {
      quoteNo,
      style: body.style === 'MGEN' ? 'MGEN' : 'MG',
      date: str(body.date),
      billTo: str(body.billTo),
      shipTo: str(body.shipTo),
      phone: str(body.phone),
      fax: str(body.fax),
      email: str(body.email),
      validity: str(body.validity),
      payment: str(body.payment),
      delivery: str(body.delivery),
      salesperson: str(body.salesperson),
      mobile: str(body.mobile),
      subtotal,
      total: subtotal,
      customerId: typeof body.customerId === 'string' && body.customerId ? body.customerId : null,
    };

    const include = { items: { orderBy: { position: 'asc' as const } } };

    const saved = body.id
      ? await prisma.quotation.update({
          where: { id: String(body.id) },
          // deleteMany + create run inside the same nested write, so it is atomic.
          data: { ...data, items: { deleteMany: {}, create: items } },
          include,
        })
      : await prisma.quotation.create({
          data: { ...data, items: { create: items } },
          include,
        });

    return NextResponse.json(saved, { status: body.id ? 200 : 201 });
  } catch (error) {
    const code = (error as { code?: string })?.code;
    if (code === 'P2002') {
      return NextResponse.json(
        { error: 'A quotation with this Quotation No. already exists.' },
        { status: 409 },
      );
    }
    if (code === 'P2025') {
      return NextResponse.json({ error: 'Quotation not found (it may have been deleted).' }, { status: 404 });
    }
    console.error('POST /api/quotations failed:', error);
    return NextResponse.json({ error: 'Failed to save quotation' }, { status: 500 });
  }
}
