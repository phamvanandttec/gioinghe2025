import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { Company } from '@/types/company';

interface CompanyRow extends Company, RowDataPacket {}

export async function GET() {
  try {
    const connection = await pool.getConnection();
    
    try {
      const [rows] = await connection.query<CompanyRow[]>(
        "SELECT * FROM company WHERE status = 'DEACTIVE' ORDER BY Id"
      );
      
      return NextResponse.json({
        success: true,
        data: rows,
        count: rows.length
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch deactivated companies',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}