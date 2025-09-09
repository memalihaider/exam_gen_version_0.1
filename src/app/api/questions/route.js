import { NextResponse } from 'next/server';
import pool from '@/utils/db';

// Add this line to make it compatible with static exports
export const dynamic = "force-static";

export async function POST(request) {
  try {
    const { question } = await request.json();

    const connection = await pool.getConnection();

    try {
      const query = `
        INSERT INTO questions (
          id, type, chapter, topic, marks, text, options, answer,
          source, medium, class, subject
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        question.id,
        question.type,
        question.chapter,
        question.topic,
        question.marks,
        question.text,
        question.type === 'mcqs' ? JSON.stringify(question.options) : null,
        question.answer,
        question.source,
        question.medium,
        question.class,
        question.subject
      ];

      await connection.execute(query, values);

      return NextResponse.json({ success: true });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to add question' },
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