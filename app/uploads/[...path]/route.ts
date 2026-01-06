import path from 'path'
import { promises as fs } from 'fs'
import { NextResponse } from 'next/server'
import { resolveUploadPath } from '@/lib/storage'

export const runtime = 'nodejs'

const contentTypes: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
}

export async function GET(
  request: Request,
  { params }: { params: { path: string[] } }
) {
  try {
    const requestedPath = params.path.join('/')
    const filePath = resolveUploadPath(requestedPath)
    const buffer = await fs.readFile(filePath)
    const ext = path.extname(filePath).toLowerCase()
    const contentType = contentTypes[ext] || 'application/octet-stream'

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'File not found' },
      { status: 404 }
    )
  }
}
