import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { Company } from '@/types/company';

interface CompanyRow extends Company, RowDataPacket {}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get('status') || 'active'; // 'active', 'inactive', or 'all'
    
    const connection = await pool.getConnection();
    
    try {
      let query = 'SELECT * FROM company';
      
      if (statusParam === 'active') {
        query += " WHERE status = 'ACTIVE'";
      } else if (statusParam === 'inactive') {
        query += " WHERE status = 'DEACTIVE'";
      }
      // For 'all', no WHERE clause needed
      
      query += ' ORDER BY Id';
      
      const [rows] = await connection.query<CompanyRow[]>(query);
      
      return NextResponse.json({
        success: true,
        data: rows,
        count: rows.length,
        status: statusParam
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch companies',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
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
        `INSERT INTO companies 
        (name, address, telephone, email, owner_name, owner_mobile, owner_email, 
         contact_name, contact_mobile, contact_email, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE')`,
        [name, address, telephone, email, owner_name, owner_mobile, owner_email,
         contact_name || null, contact_mobile || null, contact_email || null]
      );
      
      return NextResponse.json({
        success: true,
        message: 'Company created successfully',
        data: { id: result.insertId }
      }, { status: 201 });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to create company',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}