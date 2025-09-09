import { NextResponse } from 'next/server';
import pool from '@/utils/db';

export const dynamic = "force-static";
export const revalidate = 0; // Add revalidation time (0 for no cache)

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const classParam = searchParams.get('class');
    const subject = searchParams.get('subject');
    const chapter = searchParams.get('chapter');
    const topic = searchParams.get('topic');
    const type = searchParams.get('type');
    const medium = searchParams.get('medium');
    const source = searchParams.get('source');

    let connection;
    try {
      connection = await pool.getConnection();
    } catch (err) {
      console.error('Database connection error:', err);
      return NextResponse.json(
        { error: 'Failed to connect to database' },
        { status: 500 }
      );
    }

    try {
      let query = `SELECT * FROM questions WHERE 1=1`;
      const values = [];

      if (classParam) {
        query += ` AND class = ?`;
        values.push(classParam);
      }

      if (subject) {
        query += ` AND subject = ?`;
        values.push(subject);
      }

      if (chapter) {
        query += ` AND chapter = ?`;
        values.push(chapter);
      }

      if (topic) {
        query += ` AND topic = ?`;
        values.push(topic);
      }

      if (type && type !== 'all') {
        query += ` AND type = ?`;
        values.push(type);
      }

      if (medium) {
        query += ` AND medium = ?`;
        values.push(medium);
      }

      if (source) {
        query += ` AND source = ?`;
        values.push(source);
      }

      console.log('Executing query:', query, 'with values:', values);
      
      const [rows] = await connection.execute(query, values);
      
      console.log('Query results count:', rows.length);
      
      if (!Array.isArray(rows)) {
        throw new Error('Invalid response format from database');
      }

      // Process MCQS options from JSON string to array
      const processedRows = rows.map(row => {
        if (row.type === 'mcqs' && row.options && typeof row.options === 'string') {
          try {
            row.options = JSON.parse(row.options);
          } catch (e) {
            console.error('Error parsing options JSON:', e);
            row.options = [];
          }
        }
        return row;
      });

      return NextResponse.json(processedRows);
    } catch (error) {
      console.error('Query execution error:', error);
      return NextResponse.json(
        { error: `Database query failed: ${error.message}` },
        { status: 500 }
      );
    } finally {
      if (connection) {
        try {
          await connection.release();
        } catch (err) {
          console.error('Error releasing connection:', err);
        }
      }
    }
  } catch (error) {
    console.error('Request processing error:', error);
    return NextResponse.json(
      { error: `Failed to process request: ${error.message}` },
      { status: 500 }
    );
  }
}