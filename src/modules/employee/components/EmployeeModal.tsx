import { Button, Card, Col, DatePicker, Form, FormProps, Input, Modal, Row, Select } from 'antd'
import { toast } from 'sonner'
import { useEffect } from 'react'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { BuildingEmployee } from 'types/employee'
import { CreateEmployeeDto, useCreateEmployee } from '../services/createEmployee'
import { useUpdateEmployee } from '../services/updateEmployee'

dayjs.extend(utc)
dayjs.extend(timezone)

interface EmployeeModalProps {
  open: boolean
  record?: BuildingEmployee
  onCancel: () => void
  onSuccess: () => void
}

export default function EmployeeModal({ open, onCancel, onSuccess, record }: EmployeeModalProps) {
  const [form] = Form.useForm<CreateEmployeeDto>()

  const { mutate: mutateCreateEmployee, isPending: isPendingCreateEmployee } = useCreateEmployee()
  const { mutate: mutateUpdateEmployee, isPending: isPendingUpdateEmployee } = useUpdateEmployee()

  const handleSubmit: FormProps<CreateEmployeeDto>['onFinish'] = (value) => {
    console.log(value)

    if (record?._id) {
      mutateUpdateEmployee(
        { ...value, id: record._id },
        {
          onSuccess: () => {
            toast.success('Cập nhật nhân viên thành công')
            onSuccess()
            form.resetFields()
          },
        },
      )
    } else {
      mutateCreateEmployee(value, {
        onSuccess: () => {
          toast.success('Thêm nhân viên thành công')
          onSuccess()
          form.resetFields()
        },
      })
    }
  }

  useEffect(() => {
    if (record?._id && open) {
      form.resetFields()
      const { birthday, ...other } = record
      console.log(birthday)

      form.setFieldsValue(other)
      form.setFieldsValue({ birthday: dayjs(birthday) })
    }
  }, [form, open, record])

  return (
    <Modal
      width={800}
      classNames={{ content: '!p-0' }}
      styles={{ body: { padding: 0 } }}
      open={open}
      onCancel={() => {
        onCancel()
      }}
      footer={null}
      confirmLoading={isPendingCreateEmployee || isPendingUpdateEmployee}
    >
      <Card title={record ? 'Sửa thông tin nhân viên' : 'Thêm nhân viên mới'}>
        <Form onFinish={handleSubmit} form={form} layout="vertical">
          <Row gutter={20}>
            <Col span={12}>
              <Form.Item<CreateEmployeeDto>
                label="Tên nhân viên"
                required
                name="name"
                rules={[{ required: true, message: 'Bắt buộc' }]}
              >
                <Input placeholder="Nhập tên nhân viên" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item<CreateEmployeeDto>
                label="Mã nhân viên"
                name="code"
                required
                rules={[{ required: true, message: 'Bắt buộc' }]}
              >
                <Input placeholder="Nhập mã nhân viên" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item<CreateEmployeeDto>
                label="Bậc"
                name="level"
                required
                rules={[{ required: true, message: 'Bắt buộc' }]}
              >
                <Select
                  allowClear
                  showSearch
                  placeholder="Chọn bậc"
                  options={[
                    {
                      label: 'Nhân viên',
                      value: 'NV',
                    },
                    {
                      label: 'Trưởng phòng',
                      value: 'TP',
                    },
                    {
                      label: 'Phó trưởng phòng',
                      value: 'PTP',
                    },
                    {
                      label: 'Giám đốc',
                      value: 'GĐ',
                    },
                    {
                      label: 'Phó giám đốc',
                      value: 'PGĐ',
                    },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item<CreateEmployeeDto>
                label="Vị trí"
                name="position"
                required
                rules={[{ required: true, message: 'Bắt buộc' }]}
              >
                <Input placeholder="Nhập vị trí" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item<CreateEmployeeDto>
                label="Địa chỉ"
                name="address"
                required
                rules={[{ required: true, message: 'Bắt buộc' }]}
              >
                <Input placeholder="Nhập địa chỉ" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item<CreateEmployeeDto>
                label="Số điện thoại"
                name="phone"
                required
                rules={[{ required: true, message: 'Bắt buộc' }]}
              >
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item<CreateEmployeeDto>
                label="Lương cơ bản"
                name="baseSalary"
                required
                rules={[{ required: true, message: 'Bắt buộc' }]}
              >
                <Input placeholder="Nhập lương cơ bản" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item<CreateEmployeeDto>
                label="Ngày sinh"
                name="birthday"
                required
                rules={[{ required: true, message: 'Bắt buộc' }]}
              >
                <DatePicker format={'DD/MM/YYYY'} className="w-full" />
              </Form.Item>
            </Col>
          </Row>
          <div className="flex justify-center gap-3 mt-3">
            <Button htmlType="submit" type="primary">
              {record ? 'Cập nhật' : 'Thêm mới'}
            </Button>
            <Button
              onClick={() => {
                onCancel()
                form.resetFields()
              }}
            >
              Hủy
            </Button>
          </div>
        </Form>
      </Card>
    </Modal>
  )
}
