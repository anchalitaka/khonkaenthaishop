'use client';

import { useState } from 'react';
import { usePosts, useUsers } from '@/lib/hooks';
import { postsApi } from '@/lib/api';
import { Button, Input, Card, CardHeader, CardBody, CardFooter } from '@/components/ui';
import type { CreatePostInput } from '@/types';

export default function PostsPage() {
  const { data: postsData, error, isLoading, mutate } = usePosts({ take: 20 });
  const { data: usersData } = useUsers({ take: 100 });
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<CreatePostInput>({
    title: '',
    content: '',
    authorId: '',
    published: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError('');

    if (!formData.authorId) {
      setFormError('กรุณาเลือกผู้เขียน');
      setIsSubmitting(false);
      return;
    }

    try {
      await postsApi.create(formData);
      setFormData({ title: '', content: '', authorId: '', published: false });
      setShowForm(false);
      mutate();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setFormError(error.response?.data?.message || 'เกิดข้อผิดพลาด');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublish = async (id: string, isPublished: boolean) => {
    try {
      if (isPublished) {
        await postsApi.unpublish(id);
      } else {
        await postsApi.publish(id);
      }
      mutate();
    } catch (err) {
      console.error('Publish error:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('ยืนยันการลบโพสต์นี้?')) return;

    try {
      await postsApi.delete(id);
      mutate();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-50 border-red-200">
        <CardBody>
          <p className="text-red-600">ไม่สามารถโหลดข้อมูลได้ กรุณาตรวจสอบว่า Backend ทำงานอยู่</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">โพสต์ทั้งหมด</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'ยกเลิก' : '+ สร้างโพสต์ใหม่'}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">สร้างโพสต์ใหม่</h2>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="หัวข้อ"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="กรอกหัวข้อโพสต์"
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">เนื้อหา</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="กรอกเนื้อหา..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ผู้เขียน</label>
                <select
                  value={formData.authorId}
                  onChange={(e) => setFormData({ ...formData, authorId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">เลือกผู้เขียน</option>
                  {usersData?.data.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name || user.email}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="published" className="text-sm text-gray-700">เผยแพร่ทันที</label>
              </div>
              {formError && <p className="text-red-600 text-sm">{formError}</p>}
              <Button type="submit" isLoading={isSubmitting}>บันทึก</Button>
            </form>
          </CardBody>
        </Card>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {postsData?.data.map((post) => (
          <Card key={post.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{post.title}</h3>
                <span className={`ml-2 flex-shrink-0 px-2 py-1 text-xs font-semibold rounded-full ${
                  post.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {post.published ? 'เผยแพร่แล้ว' : 'ฉบับร่าง'}
                </span>
              </div>
            </CardHeader>
            <CardBody className="flex-grow">
              <p className="text-gray-600 text-sm line-clamp-3">{post.content || 'ไม่มีเนื้อหา'}</p>
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                <span>โดย: {post.author?.name || post.author?.email}</span>
              </div>
              <div className="mt-1 text-xs text-gray-400">{formatDate(post.createdAt)}</div>
            </CardBody>
            <CardFooter className="flex justify-between">
              <Button
                variant={post.published ? 'secondary' : 'primary'}
                size="sm"
                onClick={() => handlePublish(post.id, post.published)}
              >
                {post.published ? 'ซ่อน' : 'เผยแพร่'}
              </Button>
              <Button variant="danger" size="sm" onClick={() => handleDelete(post.id)}>ลบ</Button>
            </CardFooter>
          </Card>
        ))}
        {(!postsData?.data || postsData.data.length === 0) && (
          <div className="col-span-full text-center py-12 text-gray-500">ยังไม่มีโพสต์ในระบบ</div>
        )}
      </div>

      {postsData && postsData.meta.total > 0 && (
        <div className="text-center text-sm text-gray-500">
          แสดง {postsData.data.length} จาก {postsData.meta.total} โพสต์
        </div>
      )}
    </div>
  );
}
