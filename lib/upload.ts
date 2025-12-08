import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { randomUUID } from "crypto"

export async function uploadFile(file: File, folder: string): Promise<string> {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Ensure directory exists
    const uploadDir = join(process.cwd(), "public", "uploads", folder)
    try {
        await mkdir(uploadDir, { recursive: true })
    } catch (error) {
        // Ignore error if directory already exists
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop()
    const filename = `${randomUUID()}.${fileExtension}`
    const filepath = join(uploadDir, filename)

    // Write file
    await writeFile(filepath, buffer)

    return `/uploads/${folder}/${filename}`
}
