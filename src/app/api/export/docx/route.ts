import { NextRequest, NextResponse } from 'next/server';
import htmlToDocx from 'html-to-docx';
import 'encoding';

export async function POST(req: NextRequest) {
  try {
    const { htmlContent } = await req.json();

    if (!htmlContent) {
      return new NextResponse('Missing htmlContent', { status: 400 });
    }

    const fileBuffer = await htmlToDocx(
      `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>${htmlContent}</body></html>`,
      undefined,
      {
        table: { row: { cantSplit: true } },
        footer: true,
        pageNumber: true,
      }
    );

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': 'attachment; filename=financial-report.docx',
      },
    });
  } catch (error) {
    console.error('Error generating DOCX:', error);
    return new NextResponse('Error generating DOCX', { status: 500 });
  }
}