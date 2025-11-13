import { NextRequest, NextResponse } from 'next/server';
import { validateGTIN } from '@/types/company';
import pool from '@/lib/db';

// GET /api/products - List all products with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const company_id = searchParams.get('company_id');
    const search = searchParams.get('search');

    let query = `
      SELECT p.*, c.\`Company Name\`
      FROM product p 
      LEFT JOIN company c ON p.\`Company Id\` = c.Id 
      WHERE 1=1
    `;
    const params: (string | number)[] = [];

    // Filter by status
    if (status && (status === 'SHOW' || status === 'HIDDEN')) {
      query += ' AND p.Status = ?';
      params.push(status);
    } else {
      // Default to SHOW only
      query += ' AND p.Status = ?';
      params.push('SHOW');
    }

    // Filter by company
    if (company_id) {
      query += ' AND p.`Company Id` = ?';
      params.push(Number.parseInt(company_id));
    }

    // Search in product names and descriptions
    if (search) {
      query += ` AND (
        p.Name LIKE ? OR 
        p.\`Name in French\` LIKE ? OR 
        p.Description LIKE ? OR 
        p.\`Description in French\` LIKE ? OR
        p.\`Brand Name\` LIKE ?
      )`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
    }

    query += ' ORDER BY p.Name';

    const [rows] = await pool.execute(query, params);
    
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/products - Create new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      gtin,
      company_id,
      name,
      name_french,
      description,
      description_french,
      brand_name,
      country_of_origin,
      gross_weight_kg,
      net_weight_kg,
      weight_unit = 'kg',
      image
    } = body;

    // Validation
    if (!gtin || !company_id || !name || !name_french) {
      return NextResponse.json(
        { error: 'GTIN, company_id, name, and name_french are required' },
        { status: 400 }
      );
    }

    // Validate GTIN format
    if (!validateGTIN(gtin)) {
      return NextResponse.json(
        { error: 'GTIN must be 13 or 14 digits' },
        { status: 400 }
      );
    }

    // Check if company exists and is active
    const [companyRows] = await pool.execute(
      'SELECT id FROM company WHERE Id = ? AND Status = "ACTIVE"',
      [company_id]
    );
    
    if (Array.isArray(companyRows) && companyRows.length === 0) {
      return NextResponse.json(
        { error: 'Company not found or inactive' },
        { status: 400 }
      );
    }

    // Check if GTIN already exists
    const [existingRows] = await pool.execute(
      'SELECT gtin FROM product WHERE gtin = ?',
      [gtin]
    );
    
    if (Array.isArray(existingRows) && existingRows.length > 0) {
      return NextResponse.json(
        { error: 'Product with this GTIN already exists' },
        { status: 400 }
      );
    }

    // Insert new product - convert undefined to null for SQL
    await pool.execute(`
      INSERT INTO product (
        gtin, \`Company Id\`, name, \`Name in French\`, \`Description\`, \`Description in French\`,
        \`Brand Name\`, \`Country of Origin\`, \`Gross Weight (with packaging)\`, \`Net Content Weight\`,
        \`Weight Unit\`, \`Image\`, \`Status\`
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'SHOW')
    `, [
      gtin, 
      company_id, 
      name, 
      name_french, 
      description || null, 
      description_french || null,
      brand_name || null, 
      country_of_origin || null, 
      gross_weight_kg || null, 
      net_weight_kg || null,
      weight_unit || 'kg', 
      image || null
    ]);

    // Fetch and return the created product
    const [createdRows] = await pool.execute(
      'SELECT * FROM product WHERE gtin = ?',
      [gtin]
    );

    return NextResponse.json(Array.isArray(createdRows) ? createdRows[0] : null, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    
    // Handle MySQL duplicate entry error
    if (error instanceof Error && 'code' in error && error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        { error: 'Product with this GTIN already exists' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}