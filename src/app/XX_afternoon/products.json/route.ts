import pool from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const page = Number.parseInt(searchParams.get('page') || '1');
    const perPage = 10;
    const offset = (page - 1) * perPage;

    let whereClause = "p.Status = 'SHOW'";
    const queryParams: (string | number)[] = [];

    // Add search functionality if query parameter exists
    if (query.trim()) {
      whereClause += ` AND (
        p.Name LIKE ? OR 
        p.\`Name in French\` LIKE ? OR 
        p.Description LIKE ? OR 
        p.\`Description in French\` LIKE ?
      )`;
      const searchTerm = `%${query.trim()}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    // Get total count for pagination
    const countSql = `
      SELECT COUNT(*) as total
      FROM product p
      INNER JOIN company c ON p.\`Company Id\` = c.Id
      WHERE ${whereClause}
    `;

    const [countRows]: any = await (await pool).execute(countSql, queryParams);
    const totalItems = countRows[0].total;
    const totalPages = Math.ceil(totalItems / perPage);

    // Get products with pagination
    const sql = `
      SELECT 
        p.gtin,
        p.Name,
        p.\`Name in French\` as name_french,
        p.Description,
        p.\`Description in French\` as description_french,
        p.\`Brand Name\` as brand_name,
        p.\`Country of Origin\` as country_of_origin,
        p.\`Gross Weight (with packaging)\` as gross_weight_kg,
        p.\`Net Content Weight\` as net_weight_kg,
        p.\`Weight Unit\` as weight_unit,
        p.Image,
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
      WHERE ${whereClause}
      ORDER BY p.Name ASC
      LIMIT ? OFFSET ?
    `;

    queryParams.push(perPage, offset);
    const [rows]: any = await (await pool).execute(sql, queryParams);

    // Format the response according to the specification
    const products = rows.map((row: any) => ({
      name: {
        en: row.Name || '',
        fr: row.name_french || ''
      },
      description: {
        en: row.Description || '',
        fr: row.description_french || ''
      },
      gtin: row.gtin,
      brand: row.brand_name || '',
      countryOfOrigin: row.country_of_origin || '',
      weight: {
        gross: row.gross_weight_kg || 0,
        net: row.net_weight_kg || 0,
        unit: row.weight_unit || 'kg'
      },
      company: {
        companyName: row.company_name || '',
        companyAddress: row.company_address || '',
        companyTelephone: row.company_telephone || '',
        companyEmail: row.company_email || '',
        owner: {
          name: row.owner_name || '',
          mobileNumber: row.owner_mobile || '',
          email: row.owner_email || ''
        },
        contact: {
          name: row.contact_name || '',
          mobileNumber: row.contact_mobile || '',
          email: row.contact_email || ''
        }
      }
    }));

    // Build pagination URLs
    const baseUrl = request.url.split('?')[0];
    const queryString = query ? `&query=${encodeURIComponent(query)}` : '';
    
    const pagination = {
      current_page: page,
      total_pages: totalPages,
      per_page: perPage,
      total_items: totalItems,
      next_page_url: page < totalPages ? `${baseUrl}?page=${page + 1}${queryString}` : null,
      prev_page_url: page > 1 ? `${baseUrl}?page=${page - 1}${queryString}` : null
    };

    return NextResponse.json({
      data: products,
      pagination
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}