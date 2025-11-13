import pool from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const sql = `
      SELECT 
        c.Id AS id,
        c.\`Company Name\` as company_name,
        c.\`Company Address\` as company_address,
        c.\`Company Telephone Number\` as company_telephone,
        c.\`Company Email Address\` as company_email,
        c.\`Owner Name\` as owner_name,
        c.\`Owner Mobile Number\` as owner_mobile,
        c.\`Owner Email Address\` as owner_email,
        c.\`Contact Name\` as contact_name,
        c.\`Contact Mobile Number\` as contact_mobile,
        c.\`Contact Email Address\` as contact_email,
        c.Status as status
      FROM company c
      WHERE c.Id = ? AND c.Status = 'ACTIVE'
    `;

    const [rows]: any = await (await pool).execute(sql, [id]);

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    const company = rows[0];

    // Format the response according to the specification
    const formattedCompany = {
      companyName: company.company_name || '',
      companyAddress: company.company_address || '',
      companyTelephone: company.company_telephone || '',
      companyEmail: company.company_email || '',
      owner: {
        name: company.owner_name || '',
        mobileNumber: company.owner_mobile || '',
        email: company.owner_email || ''
      },
      contact: {
        name: company.contact_name || '',
        mobileNumber: company.contact_mobile || '',
        email: company.contact_email || ''
      }
    };

    return NextResponse.json(formattedCompany);

  } catch (error) {
    console.error('Error fetching company:', error);
    return NextResponse.json(
      { error: 'Failed to fetch company' },
      { status: 500 }
    );
  }
}