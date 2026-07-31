import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// Public POST – submit solar application (no auth required)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      fullName, surname, fatherHusband, relation, cnic, dateOfBirth,
      gender, mobile, email, address, district, tehsil, unionCouncil,
      village, consumerNo, discoCompany, connectionType, capacity, photoUrl
    } = body;

    // Required field validation
    if (!fullName || !surname || !fatherHusband || !cnic || !dateOfBirth || !mobile || !address || !district || !tehsil) {
      return NextResponse.json({ message: 'Required fields missing.' }, { status: 400 });
    }

    // CNIC exactly 13 digits
    if (!/^\d{13}$/.test(cnic)) {
      return NextResponse.json({ message: 'CNIC must be exactly 13 digits.' }, { status: 400 });
    }

    // Mobile 11 digits starting with 03
    if (!/^03\d{9}$/.test(mobile)) {
      return NextResponse.json({ message: 'Mobile must be 11 digits starting with 03.' }, { status: 400 });
    }

    // Generate unique application number
    const applicationNo = `SSEP-${Date.now().toString().slice(-8)}`;

    const application = await prisma.solarApplication.create({
      data: {
        applicationNo,
        fullName: fullName.trim(),
        surname: surname.trim(),
        fatherHusband: fatherHusband.trim(),
        relation: relation || 'Father',
        cnic: cnic.trim(),
        dateOfBirth: dateOfBirth.trim(),
        gender: gender || 'Male',
        mobile: mobile.trim(),
        email: email?.trim() || null,
        address: address.trim(),
        district: district.trim(),
        tehsil: tehsil.trim(),
        unionCouncil: unionCouncil?.trim() || null,
        village: village?.trim() || null,
        consumerNo: consumerNo?.trim() || null,
        discoCompany: discoCompany || 'HESCO',
        connectionType: connectionType || 'Domestic',
        capacity: capacity || '3 KW',
        photoUrl: photoUrl || null,
        status: 'Pending',
      }
    });

    return NextResponse.json({
      success: true,
      applicationNo: application.applicationNo,
      id: application.id,
      message: 'Application submitted successfully!'
    }, { status: 201 });

  } catch (error: any) {
    console.error('Solar application error:', error);
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}

// Admin GET – list all applications (no auth required per user request)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const district = searchParams.get('district');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    const where: any = {};
    if (district) where.district = { contains: district, mode: 'insensitive' };
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { cnic: { contains: search } },
        { applicationNo: { contains: search, mode: 'insensitive' } },
        { mobile: { contains: search } },
        { district: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [applications, total] = await Promise.all([
      prisma.solarApplication.findMany({
        where,
        orderBy: { submittedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.solarApplication.count({ where })
    ]);

    return NextResponse.json({ applications, total, page, limit });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}
