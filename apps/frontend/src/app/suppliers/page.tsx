'use client';

import { useState, useEffect } from 'react';
import { Card, CardBody, Button, Modal } from '@/components/ui';
import { suppliersApi } from '@/lib/api';
import type { Supplier, CreateSupplierInput } from '@/types';

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [formData, setFormData] = useState<CreateSupplierInput>({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    isActive: true,
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const response = await suppliersApi.getAll();
      setSuppliers(response.data.data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSupplier) {
        await suppliersApi.update(editingSupplier.id, formData);
      } else {
        await suppliersApi.create(formData);
      }
      setIsModalOpen(false);
      resetForm();
      fetchSuppliers();
    } catch (error) {
      console.error('Error saving supplier:', error);
    }
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      name: supplier.name,
      contactPerson: supplier.contactPerson || '',
      phone: supplier.phone || '',
      email: supplier.email || '',
      address: supplier.address || '',
      isActive: supplier.isActive,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('คุณต้องการลบผู้จำหน่ายนี้หรือไม่?')) return;
    try {
      await suppliersApi.delete(id);
      fetchSuppliers();
    } catch (error) {
      console.error('Error deleting supplier:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      contactPerson: '',
      phone: '',
      email: '',
      address: '',
      isActive: true,
    });
    setEditingSupplier(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-gray-600">กำลังโหลด...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">จัดการผู้จำหน่าย</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          + เพิ่มผู้จำหน่าย
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {suppliers.map((supplier) => (
          <Card key={supplier.id}>
            <CardBody>
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  {supplier.name}
                </h3>
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    supplier.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {supplier.isActive ? 'ใช้งาน' : 'ไม่ใช้งาน'}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                {supplier.contactPerson && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">ผู้ติดต่อ:</span> {supplier.contactPerson}
                  </p>
                )}
                {supplier.phone && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">โทร:</span> {supplier.phone}
                  </p>
                )}
                {supplier.email && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">อีเมล:</span> {supplier.email}
                  </p>
                )}
                {supplier.address && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">ที่อยู่:</span> {supplier.address}
                  </p>
                )}
              </div>

              {supplier._count && (
                <p className="text-gray-500 text-sm mb-4">
                  จำนวนสินค้า: {supplier._count.products} รายการ
                </p>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(supplier)}
                >
                  แก้ไข
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(supplier.id)}
                  className="text-red-600 hover:bg-red-50"
                >
                  ลบ
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {suppliers.length === 0 && (
        <Card>
          <CardBody className="text-center py-12">
            <p className="text-gray-600">ยังไม่มีผู้จำหน่าย กรุณาเพิ่มผู้จำหน่ายใหม่</p>
          </CardBody>
        </Card>
      )}

      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingSupplier ? 'แก้ไขผู้จำหน่าย' : 'เพิ่มผู้จำหน่ายใหม่'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ชื่อผู้จำหน่าย *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ผู้ติดต่อ
                </label>
                <input
                  type="text"
                  value={formData.contactPerson}
                  onChange={(e) =>
                    setFormData({ ...formData, contactPerson: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  เบอร์โทร
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  อีเมล
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ที่อยู่
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="isActive"
                  className="ml-2 text-sm text-gray-700"
                >
                  ใช้งาน
                </label>
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseModal}
                >
                  ยกเลิก
                </Button>
                <Button type="submit">
                  {editingSupplier ? 'บันทึก' : 'เพิ่ม'}
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
}
