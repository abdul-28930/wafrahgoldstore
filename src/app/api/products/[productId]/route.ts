import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/Product';

// ✅ GET a product by productId
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
): Promise<NextResponse> {
  const { productId } = await params;

  try {
    await connectToDatabase();

    const product = await Product.findOne({ productId }).lean();

    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    await Product.findOneAndUpdate(
      { productId },
      {
        $inc: { visitCount: 1 },
        $set: { lastVisited: new Date() },
      }
    );

    return NextResponse.json({ success: true, data: product });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ✅ PUT to update a product by productId
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
): Promise<NextResponse> {
  const { productId } = await params;

  try {
    const data = await request.json();
    await connectToDatabase();

    const updated = await Product.findOneAndUpdate(
      { productId },
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ✅ DELETE a product by productId
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
): Promise<NextResponse> {
  const { productId } = await params;

  try {
    await connectToDatabase();

    const deleted = await Product.findOneAndDelete({ productId });

    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}