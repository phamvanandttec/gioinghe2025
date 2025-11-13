import { NextRequest, NextResponse } from 'next/server';
import { validateGTIN } from '@/types/company';
import pool from '@/lib/db';

// GET /api/products/[gtin] - Get single product by GTIN
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ gtin: string }> }
) {
  try {
    const { gtin } = await params;

    // Validate GTIN format
    if (!validateGTIN(gtin)) {
      return NextResponse.json(
        { error: 'Invalid GTIN format - must be 13 or 14 digits' },
        { status: 400 }
      );
    }

    const [rows] = await pool.execute(
      `SELECT p.*, c.\`Company Name\`
       FROM product p 
       LEFT JOIN company c ON p.\`Company Id\` = c.Id 
       WHERE p.gtin = ?`,
      [gtin]
    );

    if (Array.isArray(rows) && rows.length === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(Array.isArray(rows) ? rows[0] : null);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// PATCH /api/products/[gtin] - Update product (including hide/show)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ gtin: string }> }
) {
  try {
    const { gtin } = await params;
    const body = await request.json();

    // Validate GTIN format
    if (!validateGTIN(gtin)) {
      return NextResponse.json(
        { error: 'Invalid GTIN format - must be 13 or 14 digits' },
        { status: 400 }
      );
    }

    // Check if product exists
    const [existingRows] = await pool.execute(
      'SELECT gtin FROM product WHERE gtin = ?',
      [gtin]
    );
    
    if (Array.isArray(existingRows) && existingRows.length === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const {
      name,
      name_french,
      description,
      description_french,
      brand_name,
      country_of_origin,
      gross_weight_kg,
      net_weight_kg,
      weight_unit,
      image,
      status
    } = body;

    // Build dynamic update query
    const updateFields: string[] = [];
    const updateParams: (string | number)[] = [];

    if (name !== undefined) {
      updateFields.push('`Name` = ?');
      updateParams.push(name || null);
    }
    if (name_french !== undefined) {
      updateFields.push('`Name in French` = ?');
      updateParams.push(name_french || null);
    }
    if (description !== undefined) {
      updateFields.push('`Description` = ?');
      updateParams.push(description || null);
    }
    if (description_french !== undefined) {
      updateFields.push('`Description in French` = ?');
      updateParams.push(description_french || null);
    }
    if (brand_name !== undefined) {
      updateFields.push('`Brand Name` = ?');
      updateParams.push(brand_name || null);
    }
    if (country_of_origin !== undefined) {
      updateFields.push('`Country of Origin` = ?');
      updateParams.push(country_of_origin || null);
    }
    if (gross_weight_kg !== undefined) {
      updateFields.push('`Gross Weight (with packaging)` = ?');
      updateParams.push(gross_weight_kg || null);
    }
    if (net_weight_kg !== undefined) {
      updateFields.push('`Net Content Weight` = ?');
      updateParams.push(net_weight_kg || null);
    }
    if (weight_unit !== undefined) {
      updateFields.push('`Weight Unit` = ?');
      updateParams.push(weight_unit || null);
    }
    if (image !== undefined) {
      updateFields.push('`Image` = ?');
      updateParams.push(image || null);
    }
    if (status !== undefined && (status === 'SHOW' || status === 'HIDDEN')) {
      updateFields.push('`Status` = ?');
      updateParams.push(status);
    }

    if (updateFields.length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    updateParams.push(gtin); // for WHERE clause

    // Execute update
    await pool.execute(
      `UPDATE product SET ${updateFields.join(', ')} WHERE GTIN = ?`,
      updateParams
    );

    // Fetch and return updated product
    const [updatedRows] = await pool.execute(
      `SELECT p.*, c.\`Company Name\`
       FROM product p 
       LEFT JOIN company c ON p.\`Company Id\` = c.Id 
       WHERE p.gtin = ?`,
      [gtin]
    );

    return NextResponse.json(Array.isArray(updatedRows) ? updatedRows[0] : null);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[gtin] - Delete product (permanent deletion)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ gtin: string }> }
) {
  try {
    const { gtin } = await params;

    // Validate GTIN format
    if (!validateGTIN(gtin)) {
      return NextResponse.json(
        { error: 'Invalid GTIN format - must be 13 or 14 digits' },
        { status: 400 }
      );
    }

    // Check if product exists
    const [existingRows] = await pool.execute(
      'SELECT gtin FROM product WHERE gtin = ?',
      [gtin]
    );
    
    if (Array.isArray(existingRows) && existingRows.length === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Delete product
    await pool.execute(
      'DELETE FROM product WHERE gtin = ?',
      [gtin]
    );

    return NextResponse.json(
      { message: 'Product deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}