import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Slider from '@/models/SliderImage'; // Mongoose model

// Get all sliders
export async function GET() {
  await connectToDatabase();

  const sliders = await Slider.find().sort({ createdAt: -1 });
  return NextResponse.json(sliders);
}

// Create a new slider
export async function POST(req: NextRequest) {
    try {
      const body = await req.json();
  
      // Support both single object and array
      const sliders = Array.isArray(body) ? body : [body];
  
      if (sliders.some(slider => !slider.url)) {
        return NextResponse.json({ error: 'Each slider must have a URL' }, { status: 400 });
      }
  
      await connectToDatabase();
      const created = await Slider.insertMany(sliders);
  
      return NextResponse.json(created, { status: 201 });
    } catch (error) {
      console.error('Slider POST error:', error);
      return NextResponse.json({ error: 'Failed to create slider(s)' }, { status: 500 });
    }
  }
// Update a slider
export async function PUT(req: NextRequest) {
  try {
    const { id, url, title, subtitle } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Slider ID is required' }, { status: 400 });
    }

    await connectToDatabase();
    const updated = await Slider.findByIdAndUpdate(id, { url, title, subtitle }, { new: true });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Slider PUT error:', error);
    return NextResponse.json({ error: 'Failed to update slider' }, { status: 500 });
  }
}

// Delete a slider
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Slider ID is required' }, { status: 400 });
    }

    await connectToDatabase();
    await Slider.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Slider DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete slider' }, { status: 500 });
  }
}