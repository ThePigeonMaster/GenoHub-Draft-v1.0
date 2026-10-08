import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const str = (v: unknown) => (typeof v === 'string' ? v : '');
const num = (v: unknown) => {
  const n = typeof v === 'number' ? v : parseFloat(String(v));
  return Number.isFinite(n) ? n : 0;
};

function fail(label: string, error: unknown, status = 500) {
  const code = (error as { code?: string })?.code;
  const raw = error instanceof Error ? error.message : String(error);
  // Prisma messages are multi-line; the useful part is at the end, so keep it all.
  const message = code ? `[${code}] ${raw}` : raw;
  console.error(`${label} failed:`, error);
  return NextResponse.json({ error: message, message, code }, { status });
}

export async function GET() {
  try {
    const quotations = await prisma.quotation.findMany({
      orderBy: { updatedAt: 'desc' },
      include: { items: { orderBy: { position: 'asc' } } },
    });
    return NextResponse.json(quotations);
  } catch (error) {
    return fail('GET /api/v1/quotations', error);
  }
}

// Create when `id` is absent, update when `id` is present.
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const quoteNo = str(body?.quoteNo).trim();
    if (!quoteNo) {
      return fail('POST /api/v1/quotations', new Error('Quotation No. is required'), 400);
    }
    if (!Array.isArray(body.items)) {
      return fail('POST /api/v1/quotations', new Error('items must be an array'), 400);
    }

    // Plain scalar rows only: no ids, no quotationId. Prisma fills those in.
    const items = body.items.map((it: Record<string, unknown>, index: number) => ({
      position: index,
      catNo: str(it?.catNo),
      desc: str(it?.desc),
      qty: num(it?.qty),
      price: num(it?.price),
    }));

    // Totals are always recomputed on the server; the client value is never trusted.
    const subtotal = items.reduce((acc: number, it: { qty: number; price: number }) => acc + it.qty * it.price, 0);

    const fields = {
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
    };

    const customerId = typeof body.customerId === 'string' && body.customerId ? body.customerId : null;
    const include = { items: { orderBy: { position: 'asc' as const } } };

    let saved;
    if (body.id) {
      // UPDATE: deleteMany + create inside one nested write, so it is atomic.
      saved = await prisma.quotation.update({
        where: { id: String(body.id) },
        data: {
          ...fields,
          customer: customerId ? { connect: { id: customerId } } : { disconnect: true },
          items: { deleteMany: {}, create: items },
        },
        include,
      });
    } else {
      // CREATE
      saved = await prisma.quotation.create({
        data: {
          ...fields,
          ...(customerId ? { customer: { connect: { id: customerId } } } : {}),
          items: { create: items },
        },
        include,
      });
    }

    return NextResponse.json(saved, { status: body.id ? 200 : 201 });
  } catch (error) {
    const code = (error as { code?: string })?.code;
    if (code === 'P2002') {
      return fail('POST /api/v1/quotations', new Error('A quotation with this Quotation No. already exists.'), 409);
    }
    if (code === 'P2025') {
      return fail(
        'POST /api/v1/quotations',
        new Error('Record not found: the quotation or the selected customer no longer exists.'),
        404,
      );
    }
    return fail('POST /api/v1/quotations', error);
  }
}

// DELETE /api/v1/quotations?id=<quotationId>   (or JSON body: { "id": "<quotationId>" })
export async function DELETE(request: Request) {
  try {
    let id = new URL(request.url).searchParams.get('id');

    if (!id) {
      const body = await request.json().catch(() => null);
      id = typeof body?.id === 'string' ? body.id : null;
    }
    if (!id) {
      return fail('DELETE /api/v1/quotations', new Error('Quotation id is required'), 400);
    }

    // QuotationItem.quotationId is onDelete: Cascade, so the items are removed with it.
    await prisma.quotation.delete({ where: { id } });
    return NextResponse.json({ success: true, id });
  } catch (error) {
    if ((error as { code?: string })?.code === 'P2025') {
      return fail('DELETE /api/v1/quotations', new Error('Quotation not found (already deleted?)'), 404);
    }
    return fail('DELETE /api/v1/quotations', error);
  }
}
