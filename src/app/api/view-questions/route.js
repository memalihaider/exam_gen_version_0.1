import { NextResponse } from 'next/server';
import pool from '@/utils/db';

// Replace the dynamic line with this
export const dynamic = "force-static";
// Add this line to prevent revalidation
export const revalidate = false;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const classParam = searchParams.get('class');
    const subject = searchParams.get('subject');
    const unit = searchParams.get('unit');
    const exercise = searchParams.get('exercise');
    const type = searchParams.get('type');
    const search = searchParams.get('search');

    let connection;
    try {
      connection = await pool.getConnection();
      
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

      if (unit) {
        // Exact match for chapter
        query += ` AND chapter LIKE BINARY ?`;
        values.push(unit);
      }

      if (exercise) {
        // Exact match for topic
        query += ` AND topic LIKE BINARY ?`;
        values.push(exercise);
      }

      if (type && type !== 'all') {
        query += ` AND type = ?`;
        values.push(type);
      }

      if (search) {
        query += ` AND text LIKE ?`;
        values.push(`%${search}%`);
      }

      console.log('Executing query:', query, 'with values:', values);
      
      const [rows] = await connection.execute(query, values);
      
      return NextResponse.json(rows);
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

export async function PUT(request) {
  try {
    const { question } = await request.json();
    const connection = await pool.getConnection();

    try {
      const query = `
        UPDATE questions 
        SET text = ?, 
            options = ?, 
            answer = ?
        WHERE id = ?
      `;

      const values = [
        question.text,
        question.type === 'mcqs' ? JSON.stringify(question.options) : null,
        question.answer,
        question.id
      ];

      await connection.execute(query, values);
      return NextResponse.json({ success: true });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to update question' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { questionId } = await request.json();
    const connection = await pool.getConnection();

    try {
      const query = 'DELETE FROM questions WHERE id = ?';
      await connection.execute(query, [questionId]);
      return NextResponse.json({ success: true });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to delete question' },
      { status: 500 }
    );
  }

}