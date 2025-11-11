import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { Company } from '@/types/company';

interface CompanyRow extends Company, RowDataPacket {}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const connection = await pool.getConnection();
    
    try {
      const [rows] = await connection.query<CompanyRow[]>(
        'SELECT * FROM company WHERE Id = ?',
        [id]
      );
      
      if (rows.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Company not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        success: true,
        data: rows[0]
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch company',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const {
      name,
      address,
      telephone,
      email,
      owner_name,
      owner_mobile,
      owner_email,
      contact_name,
      contact_mobile,
      contact_email
    } = body;

    // Validate required fields
    if (!name || !address || !telephone || !email || !owner_name || !owner_mobile || !owner_email) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Missing required fields'
        },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();
    
    try {
      const [result] = await connection.query<ResultSetHeader>(
        `UPDATE company 
        SET \`Company Name\` = ?, \`Company Address\` = ?, \`Company Telephone Number\` = ?, \`Company Email Address\` = ?, 
            \`Owner Name\` = ?, \`Owner Mobile Number\` = ?, \`Owner Email Address\` = ?,
            \`Contact Name\` = ?, \`Contact Mobile Number\` = ?, \`Contact Email Address\` = ?
        WHERE Id = ?`,
        [name, address, telephone, email, owner_name, owner_mobile, owner_email,
         contact_name , contact_mobile , contact_email, Number.parseInt(id)]
      );
      
      if (result.affectedRows === 0) {
        return NextResponse.json(
          { success: false, error: 'Company not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        success: true,
        message: 'Company updated successfully'
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to update company',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const connection = await pool.getConnection();
    
    try {
      const [result] = await connection.query<ResultSetHeader>(
        'DELETE FROM company WHERE Id = ?',
        [id]
      );
      
      if (result.affectedRows === 0) {
        return NextResponse.json(
          { success: false, error: 'Company not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        success: true,
        message: 'Company deleted successfully'
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to delete company',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
