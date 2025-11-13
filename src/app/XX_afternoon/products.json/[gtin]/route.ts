import { NextRequest, NextResponse } from 'next/server';
import { validateGTIN } from '@/types/company';
import pool from '@/lib/db';

export async function GET(request: NextRequest, context: { params: Promise<{ gtin: string }> }) {
  try {
    const { gtin } = await context.params;

    // Validate GTIN format
    if (!validateGTIN(gtin)) {
      return NextResponse.json(
        { error: 'Invalid GTIN format' },
        { status: 400 }
      );
    }

    const sql = `
      SELECT 
        p.gtin,
        p.Name as name,
        p.\`Name in French\` as name_french,
        p.Description as description,
        p.\`Description in French\` as description_french,
        p.\`Brand Name\` as brand_name,
        p.\`Country of Origin\` as country_of_origin,
        p.\`Gross Weight (with packaging)\` as gross_weight_kg,
        p.\`Net Content Weight\` as net_weight_kg,
        p.\`Weight Unit\` as weight_unit,
        p.Image as image,
        c.\`Company Name\` as company_name,
        c.\`Company Address\` as company_address,
        c.\`Company Telephone Number\` as company_telephone,
        c.\`Company Email Address\` as company_email,
        c.\`Owner Name\` as owner_name,
        c.\`Owner Mobile Number\` as owner_mobile,
        c.\`Owner Email Address\` as owner_email,
        c.\`Contact Name\` as contact_name,
        c.\`Contact Mobile Number\` as contact_mobile,
        c.\`Contact Email Address\` as contact_email
      FROM product p
      INNER JOIN company c ON p.\`Company Id\` = c.Id
      WHERE p.gtin = ?
    `;

    const [rows]: any = await (await pool).execute(sql, [gtin]);
    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const product = rows[0];

    // Return 404 for hidden products as specified
    if (product.status === 'HIDDEN') {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Format the response according to the specification
    const formattedProduct = {
      name: {
        en: product.name || '',
        fr: product.name_french || ''
      },
      description: {
        en: product.description || '',
        fr: product.description_french || ''
      },
      gtin: product.gtin,
      image: product.image || '',
      brand: product.brand_name || '',
      countryOfOrigin: product.country_of_origin || '',
      weight: {
        gross: product.gross_weight_kg || 0,
        net: product.net_weight_kg || 0,
        unit: product.weight_unit || 'kg'
      },
      company: {
        companyName: product.company_name || '',
        companyAddress: product.company_address || '',
        companyTelephone: product.company_telephone || '',
        companyEmail: product.company_email || '',
        owner: {
          name: product.owner_name || '',
          mobileNumber: product.owner_mobile || '',
          email: product.owner_email || ''
        },
        contact: {
          name: product.contact_name || '',
          mobileNumber: product.contact_mobile || '',
          email: product.contact_email || ''
        }
      }
    };

    return NextResponse.json(formattedProduct);

  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}