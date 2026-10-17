import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

export interface CloudinaryUploadResult {
  url: string;
  secure_url: string;
  public_id: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
}

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);

  constructor(private readonly configService: ConfigService) {
    this.ensureConfigured();
  }

  /**
   * Mengonfigurasi Cloudinary SDK dengan nilai terbaru dari environment.
   */
  private ensureConfigured(): boolean {
    const cloudName =
      this.configService.get<string>('CLOUDINARY_CLOUD_NAME') ||
      process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey =
      this.configService.get<string>('CLOUDINARY_API_KEY') ||
      process.env.CLOUDINARY_API_KEY;
    const apiSecret =
      this.configService.get<string>('CLOUDINARY_API_SECRET') ||
      process.env.CLOUDINARY_API_SECRET;

    const isPlaceholder = (val?: string) =>
      !val ||
      val.trim().length === 0 ||
      val.includes('your-cloud-name') ||
      val.includes('your-api-key') ||
      val.includes('your-api-secret');

    if (isPlaceholder(cloudName) || isPlaceholder(apiKey) || isPlaceholder(apiSecret)) {
      return false;
    }

    cloudinary.config({
      cloud_name: cloudName!.trim(),
      api_key: apiKey!.trim(),
      api_secret: apiSecret!.trim(),
      secure: true,
    });
    return true;
  }

  /**
   * Memeriksa apakah kredensial Cloudinary telah terpasang dengan benar di environment server.
   */
  public isConfigured(): boolean {
    return this.ensureConfigured();
  }

  /**
   * Membersihkan dan memetakan nama folder Cloudinary yang terorganisasi.
   */
  public sanitizeFolder(folderName?: string): string {
    const BASE_FOLDER = 'momen-potrait';
    if (!folderName || folderName.trim().length === 0) {
      return `${BASE_FOLDER}/general`;
    }

    const clean = folderName.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');

    if (clean.startsWith('packages')) return `${BASE_FOLDER}/packages`;
    if (clean.startsWith('portfolio')) return `${BASE_FOLDER}/portfolio`;
    if (clean.startsWith('homepage') || clean.startsWith('hero')) return `${BASE_FOLDER}/homepage`;
    if (clean.startsWith('services')) return `${BASE_FOLDER}/services`;
    if (clean.startsWith('testimonials') || clean.startsWith('avatars')) return `${BASE_FOLDER}/testimonials`;

    return `${BASE_FOLDER}/${clean}`;
  }

  /**
   * Mengunggah berkas buffer gambar ke Cloudinary tanpa menulis ke disk lokal.
   */
  public async uploadImage(
    file: Express.Multer.File,
    folderName?: string,
  ): Promise<CloudinaryUploadResult> {
    if (!file || !file.buffer) {
      throw new BadRequestException('Berkas gambar tidak ditemukan atau buffer kosong.');
    }

    // Validasi MIME type di backend
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/jpg'];
    if (!allowedMimeTypes.includes(file.mimetype.toLowerCase())) {
      throw new BadRequestException(
        'Format gambar tidak didukung. Format yang diizinkan: JPG, JPEG, PNG, WEBP, AVIF.',
      );
    }

    // Validasi ukuran berkas (Maksimal 10MB)
    const maxSizeBytes = 10 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      throw new BadRequestException('Ukuran gambar melebihi batas maksimal 10MB.');
    }

    // Validasi konfigurasi Cloudinary di server
    if (!this.isConfigured()) {
      throw new BadRequestException(
        'Layanan penyimpanan Cloudinary belum dikonfigurasi di server. Harap lengkapi CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, dan CLOUDINARY_API_SECRET pada environment backend.',
      );
    }

    const targetFolder = this.sanitizeFolder(folderName);

    return new Promise<CloudinaryUploadResult>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: targetFolder,
          resource_type: 'image',
          allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'avif'],
        },
        (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (error) {
            this.logger.error(`Cloudinary upload stream gagal: ${error.message || 'Unknown error'}`);
            return reject(
              new BadRequestException(
                `Gagal mengunggah gambar ke cloud: ${error.message || 'Terjadi kendala pada penyedia penyimpanan'}`,
              ),
            );
          }

          if (!result || !result.secure_url) {
            return reject(
              new BadRequestException('Penyedia cloud tidak mengembalikan URL gambar yang valid.'),
            );
          }

          resolve({
            url: result.secure_url,
            secure_url: result.secure_url,
            public_id: result.public_id,
            format: result.format,
            width: result.width,
            height: result.height,
            bytes: result.bytes,
          });
        },
      );

      uploadStream.end(file.buffer);
    });
  }
}
