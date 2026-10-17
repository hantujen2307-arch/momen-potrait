import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateHomepageContentDto } from './dto/homepage-content.dto';

const DEFAULT_FAQS = [
  {
    question: 'Bagaimana cara melakukan booking?',
    answer:
      'Pilih paket yang Anda butuhkan melalui website, kemudian lengkapi formulir reservasi online dengan estimasi tanggal dan lokasi sesi. Data Anda tersimpan di sistem kami dan diteruskan ke WhatsApp resmi studio untuk konfirmasi ketersediaan slot.',
  },
  {
    question: 'Apakah diperlukan uang muka?',
    answer:
      'Ya, pembayaran uang muka (DP) diperlukan setelah ketersediaan tanggal dan jadwal fotografer diverifikasi oleh tim admin, guna mengunci slot pemotretan Anda secara resmi.',
  },
  {
    question: 'Bagaimana kebijakan perubahan jadwal?',
    answer:
      'Perubahan jadwal (reschedule) dapat diajukan dengan konfirmasi lebih awal sebelum hari pemotretan, mengikuti ketersediaan tanggal kosong fotografer berikutnya.',
  },
  {
    question: 'Apakah ada biaya transportasi?',
    answer:
      'Biaya transportasi hanya dikenakan apabila sesi dilakukan di luar area operasional standar atau memerlukan akomodasi khusus. Seluruh rincian biaya akan disampaikan secara transparan sebelum pembayaran DP.',
  },
  {
    question: 'Berapa lama proses editing foto?',
    answer:
      'Proses editing dan kurasi warna diselesaikan sesuai estimasi pada masing-masing paket (umumnya 5–7 hari kerja, atau prioritas kilat untuk paket tertentu).',
  },
  {
    question: 'Apakah semua file foto asli diberikan?',
    answer:
      'Pemberian seluruh file foto asli mengikuti ketentuan masing-masing paket. Paket tertentu menyertakan seluruh file asli via cloud storage, sementara paket lainnya fokus pada master foto pilihan hasil edit.',
  },
  {
    question: 'Bagaimana cara menerima hasil foto?',
    answer:
      'Hasil foto akhir diserahkan dalam format digital JPEG resolusi tinggi melalui tautan cloud storage privat yang aman dan dapat diunduh kapan saja.',
  },
];

@Injectable()
export class ContentService {
  constructor(private prisma: PrismaService) {}

  async getHomepageContent() {
    let content = await this.prisma.homepageContent.findFirst();
    if (!content) {
      content = await this.prisma.homepageContent.create({
        data: {
          heroHeadline: 'Every Moment Tells a Story.',
          heroDescription:
            'Fotografi potret editorial, wisuda, pasangan, dan momen berharga yang dikurasi secara artistik dengan pencahayaan sinematik dan arahan pose natural.',
          heroImageUrl:
            'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80',
          heroPrimaryCtaText: 'Booking Sekarang',
          heroPrimaryCtaLink: '/booking',
          heroSecondaryCtaText: 'Lihat Paket',
          heroSecondaryCtaLink: '/packages',
          aboutTitle: 'Foto yang Terasa Seperti Anda.',
          aboutTagline: 'Filosofi Fotografi Kami',
          aboutDescription:
            'Kami adalah studio fotografi kontemporer yang percaya bahwa keindahan visual terletak pada keaslian ekspresi. Tidak ada pose kaku atau manipulasi berlebihan — hanya Anda, cerita Anda, dan momen terbaik yang diabadikan dengan estetika abadi.',
          ctaHeadline: 'Siap Mengabadikan Momen Berharga Anda?',
          ctaDescription:
            'Konsultasikan konsep sesi pemotretan Anda bersama fotografer kami atau amankan tanggal pilihan Anda sekarang.',
          ctaButtonText: 'Reservasi Sesi Sekarang',
          ctaButtonLink: '/booking',
          faqItems: DEFAULT_FAQS,
          footerText: 'Every Moment Tells a Story. Hak Cipta Dilindungi.',
        },
      });
    }
    return content;
  }

  async updateHomepageContent(dto: UpdateHomepageContentDto) {
    const current = await this.getHomepageContent();
    return this.prisma.homepageContent.update({
      where: { id: current.id },
      data: dto,
    });
  }
}
