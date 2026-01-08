import Link from "next/link";
import { Card, CardBody } from "@/components/ui";

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
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                จัดการสินค้า
              </h3>
              <p className="text-gray-600 text-sm">
                เพิ่ม แก้ไข ลบสินค้า พร้อมอัพโหลดรูปภาพ ระบุราคา สต็อก
                และข้อมูลอื่นๆ
              </p>
            </CardBody>
          </Card>
        </Link>

        <Link href="/categories">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardBody className="text-center py-8">
              <div className="text-4xl mb-4">📁</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                จัดการหมวดหมู่
              </h3>
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
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                จัดการผู้จำหน่าย
              </h3>
              <p className="text-gray-600 text-sm">
                บันทึกข้อมูลผู้จำหน่าย ผู้ติดต่อ เบอร์โทร และที่อยู่
              </p>
            </CardBody>
          </Card>
        </Link>
      </div>
    </div>
  );
}
