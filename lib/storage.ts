import crypto from 'crypto'
import path from 'path'
import { promises as fs } from 'fs'

const defaultUploadDir = 'uploads'

function getUploadRoot() {
  return path.resolve(process.cwd(), process.env.UPLOAD_DIR || defaultUploadDir)
}

export function getFileBaseUrl() {
  if (process.env.FILE_BASE_URL) {
    return process.env.FILE_BASE_URL.replace(/\/$/, '')
  }
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5000').replace(/\/$/, '')
  return `${appUrl}/uploads`
}

export async function saveUploadedFile(file: File, subdir: string, prefix: string) {
  const ext = path.extname(file.name)
  const safeExt = ext ? ext.toLowerCase() : ''
  const random = crypto.randomBytes(6).toString('hex')
  const fileName = `${prefix}-${Date.now()}-${random}${safeExt}`
  const relativePath = path.posix.join(subdir, fileName)
  const absolutePath = path.join(getUploadRoot(), ...relativePath.split('/'))

  await fs.mkdir(path.dirname(absolutePath), { recursive: true })
  const buffer = Buffer.from(await file.arrayBuffer())
  await fs.writeFile(absolutePath, buffer)

  return {
    relativePath,
    publicUrl: `${getFileBaseUrl()}/${relativePath}`
  }
}

export async function fileExists(relativePath: string) {
  try {
    await fs.access(path.join(getUploadRoot(), ...relativePath.split('/')))
    return true
  } catch {
    return false
  }
}

export function resolveUploadPath(relativePath: string) {
  const root = getUploadRoot()
  const target = path.resolve(root, ...relativePath.split('/'))
  if (!target.startsWith(root)) {
    throw new Error('Invalid upload path')
  }
  return target
}
