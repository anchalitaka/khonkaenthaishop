import Link from 'next/link';
import { Card, CardBody } from '@/components/ui';

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          ระบบจัดการร้านขอนแก่น
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          ระบบจัดการสินค้า หมวดหมู่ และผู้จำหน่าย พร้อมระบบอัพโหลดรูปภาพ
        </p>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6">
        <Link href="/products">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardBody className="text-center py-8">
              <div className="text-4xl mb-4">📦</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">จัดการสินค้า</h3>
              <p className="text-gray-600 text-sm">
                เพิ่ม แก้ไข ลบสินค้า พร้อมอัพโหลดรูปภาพ ระบุราคา สต็อก และข้อมูลอื่นๆ
              </p>
            </CardBody>
          </Card>
        </Link>

        <Link href="/categories">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardBody className="text-center py-8">
              <div className="text-4xl mb-4">📁</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">จัดการหมวดหมู่</h3>
              <p className="text-gray-600 text-sm">
                จัดกลุ่มสินค้าตามหมวดหมู่ เพื่อความสะดวกในการค้นหาและจัดการ
              </p>
            </CardBody>
          </Card>
        </Link>

        <Link href="/suppliers">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardBody className="text-center py-8">
              <div className="text-4xl mb-4">🏢</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">จัดการผู้จำหน่าย</h3>
              <p className="text-gray-600 text-sm">
                บันทึกข้อมูลผู้จำหน่าย ผู้ติดต่อ เบอร์โทร และที่อยู่
              </p>
            </CardBody>
          </Card>
        </Link>
      </div>

      {/* Tech Stack */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          เทคโนโลยีที่ใช้
        </h2>
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
                PostgreSQL Database + Storage
              </p>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Quick Links */}
      <div className="flex justify-center gap-4 pt-8">
        <Link
          href="/products"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          จัดการสินค้า →
        </Link>
        <Link
          href="/categories"
          className="px-6 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-medium"
        >
          จัดการหมวดหมู่ →
        </Link>
        <Link
          href="/suppliers"
          className="px-6 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-medium"
        >
          จัดการผู้จำหน่าย →
        </Link>
      </div>

      {/* API Endpoints */}
      <Card className="mt-12">
        <CardBody>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">API Endpoints</h2>
          <div className="space-y-3 font-mono text-sm">
            <div className="text-gray-700 font-semibold">สินค้า (Products)</div>
            <div className="flex items-center gap-2 ml-4">
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">GET</span>
              <span className="text-gray-600">/api/products</span>
              <span className="text-gray-400">- ดึงรายการสินค้า</span>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">POST</span>
              <span className="text-gray-600">/api/products</span>
              <span className="text-gray-400">- เพิ่มสินค้าใหม่ (รองรับ multipart/form-data)</span>
            </div>

            <div className="text-gray-700 font-semibold mt-4">หมวดหมู่ (Categories)</div>
            <div className="flex items-center gap-2 ml-4">
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">GET</span>
              <span className="text-gray-600">/api/categories</span>
              <span className="text-gray-400">- ดึงรายการหมวดหมู่</span>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">POST</span>
              <span className="text-gray-600">/api/categories</span>
              <span className="text-gray-400">- เพิ่มหมวดหมู่ใหม่</span>
            </div>

            <div className="text-gray-700 font-semibold mt-4">ผู้จำหน่าย (Suppliers)</div>
            <div className="flex items-center gap-2 ml-4">
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">GET</span>
              <span className="text-gray-600">/api/suppliers</span>
              <span className="text-gray-400">- ดึงรายการผู้จำหน่าย</span>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">POST</span>
              <span className="text-gray-600">/api/suppliers</span>
              <span className="text-gray-400">- เพิ่มผู้จำหน่ายใหม่</span>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
