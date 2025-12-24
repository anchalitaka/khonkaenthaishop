import Link from 'next/link';
import { Card, CardBody } from '@/components/ui';

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          FullStack Web Application
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          แอปพลิเคชันที่สร้างด้วย Next.js + NestJS + Prisma + Supabase PostgreSQL
        </p>
      </div>

      {/* Tech Stack */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardBody className="text-center py-8">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Next.js 15</h3>
            <p className="text-gray-600 text-sm">
              React Framework สำหรับ Frontend พร้อม App Router
            </p>
          </CardBody>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardBody className="text-center py-8">
            <div className="text-4xl mb-4">🔴</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">NestJS</h3>
            <p className="text-gray-600 text-sm">
              Backend Framework แบบ Progressive Node.js
            </p>
          </CardBody>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardBody className="text-center py-8">
            <div className="text-4xl mb-4">🔷</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Prisma ORM</h3>
            <p className="text-gray-600 text-sm">
              ORM ที่ทันสมัยสำหรับ TypeScript
            </p>
          </CardBody>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardBody className="text-center py-8">
            <div className="text-4xl mb-4">🟢</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Supabase</h3>
            <p className="text-gray-600 text-sm">
              PostgreSQL Database บน Cloud
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="flex justify-center gap-4 pt-8">
        <Link
          href="/users"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          จัดการผู้ใช้งาน →
        </Link>
        <Link
          href="/posts"
          className="px-6 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-medium"
        >
          ดูโพสต์ทั้งหมด →
        </Link>
      </div>

      {/* API Status */}
      <Card className="mt-12">
        <CardBody>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">API Endpoints</h2>
          <div className="space-y-2 font-mono text-sm">
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded">GET</span>
              <span className="text-gray-600">/api/users</span>
              <span className="text-gray-400">- ดึงรายชื่อผู้ใช้</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">POST</span>
              <span className="text-gray-600">/api/users</span>
              <span className="text-gray-400">- สร้างผู้ใช้ใหม่</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded">GET</span>
              <span className="text-gray-600">/api/posts</span>
              <span className="text-gray-400">- ดึงโพสต์ทั้งหมด</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">POST</span>
              <span className="text-gray-600">/api/posts</span>
              <span className="text-gray-400">- สร้างโพสต์ใหม่</span>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
