"use client";

import { useState } from "react";
import { useUsers } from "@/lib/hooks";
import { usersApi } from "@/lib/api";
import { Button, Input, Card, CardHeader, CardBody } from "@/components/ui";
import Select from "@/components/ui/Select";
import type { CreateUserInput } from "@/types";

export default function UsersPage() {
  const { data, error, isLoading, mutate } = useUsers({ take: 20 });
  const [showForm, setShowForm] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateUserInput>({
    email: "",
    password: "",
    employeeType: "",
    nationalId: "",
    titleTh: "",
    firstNameTh: "",
    lastNameTh: "",
    firstNameEn: "",
    lastNameEn: "",
    nickname: "",
    gender: "",
    bloodType: "",
    birthDate: "",
    ethnicity: "",
    nationality: "",
    religion: "",
    phone: "",
    province: "",
    maritalStatus: "",
    username: "",
    employeeId: "",
    position: "",
    positionLevel: "",
    department: "",
    employmentStatus: "",
    startDate: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // ฟังก์ชันสร้าง username แบบสุ่ม
  const generateRandomUsername = () => {
    const prefix = formData.firstNameEn?.toLowerCase() || "user";
    const randomNum = Math.floor(Math.random() * 10000);
    const randomStr = Math.random().toString(36).substring(2, 5);
    return `${prefix}${randomNum}${randomStr}`;
  };

  // ตัวเลือกต่างๆ
  const employeeTypeOptions = [
    { value: "พนักงานประจำ", label: "พนักงานประจำ" },
    { value: "สัญญาจ้าง", label: "สัญญาจ้าง" },
  ];

  const titleOptions = [
    { value: "นาย", label: "นาย" },
    { value: "นาง", label: "นาง" },
    { value: "นางสาว", label: "นางสาว" },
    { value: "อื่นๆ", label: "อื่นๆ" },
  ];

  const genderOptions = [
    { value: "ชาย", label: "ชาย" },
    { value: "หญิง", label: "หญิง" },
  ];

  const bloodTypeOptions = [
    { value: "A", label: "A" },
    { value: "B", label: "B" },
    { value: "AB", label: "AB" },
    { value: "O", label: "O" },
  ];

  const maritalStatusOptions = [
    { value: "โสด", label: "โสด" },
    { value: "สมรส", label: "สมรส" },
    { value: "หย่า", label: "หย่า" },
    { value: "หม้าย", label: "หม้าย" },
  ];

  const departmentOptions = [
    { value: "การตลาด", label: "การตลาด" },
    { value: "ขาย", label: "ขาย" },
    { value: "IT", label: "IT" },
    { value: "Development", label: "Development" },
    { value: "บัญชี", label: "บัญชี" },
    { value: "ทรัพยากรบุคคล", label: "ทรัพยากรบุคคล" },
    { value: "บริหาร", label: "บริหาร" },
  ];

  const positionOptions = [
    { value: "Full Stack Developer", label: "Full Stack Developer" },
    { value: "Frontend Developer", label: "Frontend Developer" },
    { value: "Backend Developer", label: "Backend Developer" },
    { value: "ผู้จัดการ", label: "ผู้จัดการ" },
    { value: "หัวหน้าแผนก", label: "หัวหน้าแผนก" },
    { value: "พนักงาน", label: "พนักงาน" },
    { value: "ผู้ช่วย", label: "ผู้ช่วย" },
    { value: "ฝึกงาน", label: "ฝึกงาน" },
  ];

  const positionLevelOptions = [
    { value: "Junior 1", label: "Junior 1" },
    { value: "Junior 2", label: "Junior 2" },
    { value: "Senior 1", label: "Senior 1" },
    { value: "Senior 2", label: "Senior 2" },
    { value: "Lead", label: "Lead" },
  ];

  const employmentStatusOptions = [
    { value: "พนักงานประจำ", label: "พนักงานประจำ" },
    { value: "ทดลองงาน", label: "ทดลองงาน" },
    { value: "สัญญาจ้าง", label: "สัญญาจ้าง" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError("");

    try {
      // Convert empty strings to undefined for optional fields
      const cleanedData = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [
          key,
          value === "" ? undefined : value,
        ])
      ) as CreateUserInput;

      if (editingUserId) {
        // Update existing user
        await usersApi.update(editingUserId, cleanedData);
      } else {
        // Create new user
        await usersApi.create(cleanedData);
      }

      // Reset form
      setFormData({
        email: "",
        password: "",
        employeeType: "",
        nationalId: "",
        titleTh: "",
        firstNameTh: "",
        lastNameTh: "",
        firstNameEn: "",
        lastNameEn: "",
        nickname: "",
        gender: "",
        bloodType: "",
        birthDate: "",
        ethnicity: "",
        nationality: "",
        religion: "",
        phone: "",
        province: "",
        maritalStatus: "",
        username: "",
        employeeId: "",
        position: "",
        positionLevel: "",
        department: "",
        employmentStatus: "",
        startDate: "",
      });
      setShowForm(false);
      setEditingUserId(null);
      mutate();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setFormError(error.response?.data?.message || "เกิดข้อผิดพลาด");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = (id: string) => {
    const user = data?.data.find((u) => u.id === id);
    if (!user) return;

    // Format dates for input fields
    const formatDate = (date: string | null | undefined) => {
      if (!date) return "";
      return new Date(date).toISOString().split("T")[0];
    };

    setFormData({
      email: user.email,
      password: "", // Don't populate password for security
      employeeType: user.employeeType || "",
      nationalId: user.nationalId || "",
      titleTh: user.titleTh || "",
      firstNameTh: user.firstNameTh || "",
      lastNameTh: user.lastNameTh || "",
      firstNameEn: user.firstNameEn || "",
      lastNameEn: user.lastNameEn || "",
      nickname: user.nickname || "",
      gender: user.gender || "",
      bloodType: user.bloodType || "",
      birthDate: formatDate(user.birthDate),
      ethnicity: user.ethnicity || "",
      nationality: user.nationality || "",
      religion: user.religion || "",
      phone: user.phone || "",
      province: user.province || "",
      maritalStatus: user.maritalStatus || "",
      username: user.username || "",
      employeeId: user.employeeId || "",
      position: user.position || "",
      positionLevel: user.positionLevel || "",
      department: user.department || "",
      employmentStatus: user.employmentStatus || "",
      startDate: formatDate(user.startDate),
    });
    setEditingUserId(id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("ยืนยันการลบผู้ใช้นี้?")) return;

    try {
      await usersApi.delete(id);
      mutate();
    } catch (err) {
      console.error("Delete error:", err);
    }
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
          <p className="text-red-600">
            ไม่สามารถโหลดข้อมูลได้ กรุณาตรวจสอบว่า Backend ทำงานอยู่
          </p>
        </CardBody>
      </Card>
    );
  }

  const handleCancel = () => {
    setShowForm(false);
    setEditingUserId(null);
    setFormData({
      email: "",
      password: "",
      employeeType: "",
      nationalId: "",
      titleTh: "",
      firstNameTh: "",
      lastNameTh: "",
      firstNameEn: "",
      lastNameEn: "",
      nickname: "",
      gender: "",
      bloodType: "",
      birthDate: "",
      ethnicity: "",
      nationality: "",
      religion: "",
      phone: "",
      province: "",
      maritalStatus: "",
      username: "",
      employeeId: "",
      position: "",
      positionLevel: "",
      department: "",
      employmentStatus: "",
      startDate: "",
    });
    setFormError("");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">จัดการผู้ใช้งาน</h1>
        <Button onClick={() => (showForm ? handleCancel() : setShowForm(true))}>
          {showForm ? "ยกเลิก" : "+ เพิ่มผู้ใช้ใหม่"}
        </Button>
      </div>

      {/* Add/Edit User Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-black">
              {editingUserId ? "แก้ไขข้อมูลผู้ใช้" : "เพิ่มผู้ใช้ใหม่"}
            </h2>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* ข้อมูลบุคคล */}
              <div>
                <h3 className="text-md font-semibold text-gray-800 mb-4 border-b pb-2">
                  ข้อมูลบุคคล
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="ประเภทบุคคล"
                    value={formData.employeeType}
                    onChange={(value) =>
                      setFormData({ ...formData, employeeType: value })
                    }
                    options={employeeTypeOptions}
                    placeholder="เลือกประเภทบุคคล"
                  />
                  <Input
                    label="เลขประจำตัวประชาชน"
                    type="text"
                    inputMode="numeric"
                    maxLength={13}
                    pattern="[0-9]{13}"
                    value={formData.nationalId}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      setFormData({ ...formData, nationalId: value });
                    }}
                    placeholder="1234567890123"
                  />
                  <Select
                    label="คำนำหน้า (ไทย)"
                    value={formData.titleTh}
                    onChange={(value) =>
                      setFormData({ ...formData, titleTh: value })
                    }
                    options={titleOptions}
                    placeholder="เลือกคำนำหน้า"
                  />
                  <Input
                    label="ชื่อ (ภาษาไทย)"
                    value={formData.firstNameTh}
                    onChange={(e) =>
                      setFormData({ ...formData, firstNameTh: e.target.value })
                    }
                    placeholder="ชื่อ"
                  />
                  <Input
                    label="นามสกุล (ภาษาไทย)"
                    value={formData.lastNameTh}
                    onChange={(e) =>
                      setFormData({ ...formData, lastNameTh: e.target.value })
                    }
                    placeholder="นามสกุล"
                  />
                  <Input
                    label="ชื่อ (ภาษาอังกฤษ)"
                    value={formData.firstNameEn}
                    onChange={(e) =>
                      setFormData({ ...formData, firstNameEn: e.target.value })
                    }
                    placeholder="First Name"
                  />
                  <Input
                    label="นามสกุล (ภาษาอังกฤษ)"
                    value={formData.lastNameEn}
                    onChange={(e) =>
                      setFormData({ ...formData, lastNameEn: e.target.value })
                    }
                    placeholder="Last Name"
                  />
                  <Input
                    label="ชื่อเล่น"
                    value={formData.nickname}
                    onChange={(e) =>
                      setFormData({ ...formData, nickname: e.target.value })
                    }
                    placeholder="ชื่อเล่น"
                  />
                  <Select
                    label="เพศ"
                    value={formData.gender}
                    onChange={(value) =>
                      setFormData({ ...formData, gender: value })
                    }
                    options={genderOptions}
                    placeholder="เลือกเพศ"
                  />
                  <Select
                    label="หมู่โลหิต"
                    value={formData.bloodType}
                    onChange={(value) =>
                      setFormData({ ...formData, bloodType: value })
                    }
                    options={bloodTypeOptions}
                    placeholder="เลือกหมู่โลหิต"
                  />
                  <Input
                    label="วันเกิด"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) =>
                      setFormData({ ...formData, birthDate: e.target.value })
                    }
                  />
                  <Input
                    label="เชื้อชาติ"
                    value={formData.ethnicity}
                    onChange={(e) =>
                      setFormData({ ...formData, ethnicity: e.target.value })
                    }
                    placeholder="ไทย"
                  />
                  <Input
                    label="สัญชาติ"
                    value={formData.nationality}
                    onChange={(e) =>
                      setFormData({ ...formData, nationality: e.target.value })
                    }
                    placeholder="ไทย"
                  />
                  <Input
                    label="ศาสนา"
                    value={formData.religion}
                    onChange={(e) =>
                      setFormData({ ...formData, religion: e.target.value })
                    }
                    placeholder="พุทธ"
                  />
                  <Input
                    label="เบอร์โทรศัพท์"
                    value={formData.phone}
                    maxLength={10}
                    pattern="[0-9]{13}"
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="0912345678"
                  />
                  <Input
                    label="ภูมิลำเนา (จังหวัด)"
                    value={formData.province}
                    onChange={(e) =>
                      setFormData({ ...formData, province: e.target.value })
                    }
                    placeholder="กรุงเทพมหานคร"
                  />

                  <Select
                    label="สถานภาพสมรส"
                    value={formData.maritalStatus}
                    onChange={(value) =>
                      setFormData({ ...formData, maritalStatus: value })
                    }
                    options={maritalStatusOptions}
                    placeholder="เลือกสถานภาพ"
                  />
                </div>
              </div>

              {/* ตำแหน่งปัจจุบัน */}
              <div>
                <h3 className="text-md font-semibold text-gray-800 mb-4 border-b pb-2">
                  ตำแหน่งปัจจุบัน
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      รหัสผู้ใช้
                    </label>
                    <div className="flex gap-2">
                      <Input
                        value={formData.username}
                        onChange={(e) =>
                          setFormData({ ...formData, username: e.target.value })
                        }
                        placeholder="คลิกปุ่มเพื่อสร้างรหัสผู้ใช้"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            username: generateRandomUsername(),
                          })
                        }
                      >
                        สร้าง
                      </Button>
                    </div>
                  </div>
                  <Input
                    label="รหัสพนักงาน"
                    value={formData.employeeId}
                    onChange={(e) =>
                      setFormData({ ...formData, employeeId: e.target.value })
                    }
                    placeholder="291"
                  />
                  <Select
                    label="ตำแหน่ง"
                    value={formData.position}
                    onChange={(value) =>
                      setFormData({ ...formData, position: value })
                    }
                    options={positionOptions}
                    placeholder="เลือกตำแหน่ง"
                  />
                  <Select
                    label="ระดับตำแหน่ง"
                    value={formData.positionLevel}
                    onChange={(value) =>
                      setFormData({ ...formData, positionLevel: value })
                    }
                    options={positionLevelOptions}
                    placeholder="เลือกระดับตำแหน่ง"
                  />
                  <Select
                    label="แผนก"
                    value={formData.department}
                    onChange={(value) =>
                      setFormData({ ...formData, department: value })
                    }
                    options={departmentOptions}
                    placeholder="เลือกแผนก"
                  />
                  <Select
                    label="สถานะการจ้างงาน"
                    value={formData.employmentStatus}
                    onChange={(value) =>
                      setFormData({ ...formData, employmentStatus: value })
                    }
                    options={employmentStatusOptions}
                    placeholder="เลือกสถานะ"
                  />
                  <Input
                    label="วันที่เริ่มงาน"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* ข้อมูลเข้าสู่ระบบ */}
              <div>
                <h3 className="text-md font-semibold text-gray-800 mb-4 border-b pb-2">
                  ข้อมูลเข้าสู่ระบบ
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="อีเมล"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="example@email.com"
                    required
                  />
                  <Input
                    label="รหัสผ่าน"
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="อย่างน้อย 6 ตัวอักษร"
                    required
                  />
                </div>
              </div>

              {formError && <p className="text-red-600 text-sm">{formError}</p>}
              <Button type="submit" isLoading={isSubmitting} className="w-full">
                บันทึกข้อมูล
              </Button>
            </form>
          </CardBody>
        </Card>
      )}

      {/* Users List */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-black">
            รายชื่อผู้ใช้ ({data?.meta.total || 0} คน)
          </h2>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ชื่อ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  อีเมล
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  แผนก
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ตำแหน่ง
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  บทบาท
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  สถานะ
                </th>
                <th
                  colSpan={2}
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  การจัดการ
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.data.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {user.firstNameTh && user.lastNameTh
                        ? `${user.firstNameTh} ${user.lastNameTh}`
                        : user.name || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {user.department || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {user.position || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === "ADMIN"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.isActive ? "ใช้งาน" : "ปิดใช้งาน"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleUpdate(user.id)}
                    >
                      แก้ไข
                    </Button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(user.id)}
                    >
                      ลบ
                    </Button>
                  </td>
                </tr>
              ))}
              {(!data?.data || data.data.length === 0) && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    ยังไม่มีผู้ใช้ในระบบ
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
