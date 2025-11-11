import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { Product } from '@/types/company';

interface ProductRow extends Product, RowDataPacket {}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const connection = await pool.getConnection();
    
    try {
      const [rows] = await connection.query<ProductRow[]>(
        'SELECT * FROM product WHERE `Company Id` = ? ORDER BY GTIN',
        [id]
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
        error: 'Failed to fetch products',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
