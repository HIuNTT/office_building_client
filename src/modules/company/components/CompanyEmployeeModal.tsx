import { Button, Card, Col, DatePicker, Form, FormProps, Input, Modal, Row } from 'antd'
import { toast } from 'sonner'
import { CompanyEmployee } from 'types/company'
import { useEffect } from 'react'
import { CreateCompanyEmployeeDto, useCreateCompanyEmployee } from '../services/createEmployee'
import { useUpdateCompanyEmployee } from '../services/updateEmployee'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

interface CompanyEmployeeModalProps {
  companyId?: string
  open: boolean
  record?: CompanyEmployee
  onCancel: () => void
  onSuccess: () => void
}

export default function CompanyEmployeeModal({
  open,
  onCancel,
  onSuccess,
  record,
  companyId,
}: CompanyEmployeeModalProps) {
  const [form] = Form.useForm<CreateCompanyEmployeeDto>()

  const { mutate: mutateCreateCompanyEmployee, isPending: isPendingCreateCompanyEmployee } = useCreateCompanyEmployee()
  const { mutate: mutateUpdateCompanyEmployee, isPending: isPendingUpdateCompanyEmployee } = useUpdateCompanyEmployee()

  const handleSubmit: FormProps<CreateCompanyEmployeeDto>['onFinish'] = (value) => {
    console.log(value)

    if (record?._id) {
      mutateUpdateCompanyEmployee(
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
      mutateCreateCompanyEmployee(
        { ...value, companyId: companyId! },
        {
          onSuccess: () => {
            toast.success('Thêm nhân viên thành công')
            onSuccess()
            form.resetFields()
          },
        },
      )
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
      confirmLoading={isPendingCreateCompanyEmployee || isPendingUpdateCompanyEmployee}
    >
      <Card title={record ? 'Sửa thông tin nhân viên' : 'Thêm nhân viên mới'}>
        <Form onFinish={handleSubmit} form={form} layout="vertical">
          <Row gutter={20}>
            <Col span={12}>
              <Form.Item<CreateCompanyEmployeeDto>
                label="Tên nhân viên"
                required
                name="name"
                rules={[{ required: true, message: 'Bắt buộc' }]}
              >
                <Input placeholder="Nhập tên nhân viên" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item<CreateCompanyEmployeeDto>
                label="Mã nhân viên"
                name="code"
                required
                rules={[{ required: true, message: 'Bắt buộc' }]}
              >
                <Input placeholder="Nhập mã nhân viên" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item<CreateCompanyEmployeeDto>
                label="Số CMND/CCCD"
                name="identityNumber"
                required
                rules={[{ required: true, message: 'Bắt buộc' }]}
              >
                <Input placeholder="Nhập số CMND/CCCD" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item<CreateCompanyEmployeeDto>
                label="Số điện thoại"
                name="phone"
                required
                rules={[{ required: true, message: 'Bắt buộc' }]}
              >
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item<CreateCompanyEmployeeDto>
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
