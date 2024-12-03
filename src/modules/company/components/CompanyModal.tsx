import { Button, Card, Col, Form, FormProps, Input, InputNumber, Modal, Row } from 'antd'
import { CreateCompanyDto, useCreateCompany } from '../services/createCompany'
import { toast } from 'sonner'
import { Company } from 'types/company'
import { useEffect } from 'react'
import { useUpdateCompany } from '../services/updateCompany'

interface CompanyModalProps {
  open: boolean
  record?: Company
  onCancel: () => void
  onSuccess: () => void
}

export default function CompanyModal({ open, onCancel, onSuccess, record }: CompanyModalProps) {
  const [form] = Form.useForm<CreateCompanyDto>()

  const { mutate: mutateCreateCompany, isPending: isPendingCreateCompany } = useCreateCompany()
  const { mutate: mutateUpdateCompany, isPending: isPendingUpdateCompany } = useUpdateCompany()

  const handleSubmit: FormProps<CreateCompanyDto>['onFinish'] = (value) => {
    if (record?._id) {
      mutateUpdateCompany(
        { ...value, _id: record._id },
        {
          onSuccess: () => {
            toast.success('Cập nhật công ty thành công')
            onSuccess()
            form.resetFields()
          },
        },
      )
    } else {
      mutateCreateCompany(value, {
        onSuccess: () => {
          toast.success('Thêm công ty thành công')
          onSuccess()
          form.resetFields()
        },
      })
    }
  }

  useEffect(() => {
    if (record?._id && open) {
      form.resetFields()
      form.setFieldsValue(record)
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
      confirmLoading={isPendingCreateCompany || isPendingUpdateCompany}
    >
      <Card title={record ? 'Sửa thông tin công ty' : 'Thêm công ty mới'}>
        <Form onFinish={handleSubmit} form={form} layout="vertical">
          <Row gutter={20}>
            <Col span={12}>
              <Form.Item<CreateCompanyDto>
                label="Tên công ty"
                required
                name="name"
                rules={[{ required: true, message: 'Bắt buộc' }]}
              >
                <Input placeholder="Nhập tên công ty" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item<CreateCompanyDto>
                label="Mã số thuế"
                name="taxCode"
                required
                rules={[{ required: true, message: 'Bắt buộc' }]}
              >
                <Input placeholder="Nhập mã số thuế" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item<CreateCompanyDto>
                label="Lĩnh vực hoạt động"
                name="industry"
                required
                rules={[{ required: true, message: 'Bắt buộc' }]}
              >
                <Input placeholder="Nhập lĩnh vực hoạt động" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item<CreateCompanyDto>
                label="Địa chỉ ở tòa nhà"
                name="address"
                required
                rules={[{ required: true, message: 'Bắt buộc' }]}
              >
                <Input placeholder="Nhập địa chỉ" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item<CreateCompanyDto>
                label="Số điện thoại"
                name="phone"
                required
                rules={[{ required: true, message: 'Bắt buộc' }]}
              >
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item<CreateCompanyDto>
                label="Vốn điều lệ"
                name="capital"
                required
                rules={[{ required: true, message: 'Bắt buộc' }]}
              >
                <Input placeholder="Nhập vốn điều lệ" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item<CreateCompanyDto>
                label={
                  <div>
                    Diện tích mặt bằng (m<span className="align-super font-semibold text-[11px]">2</span>)
                  </div>
                }
                name="area"
                required
                rules={[{ required: true, message: 'Bắt buộc' }]}
              >
                <InputNumber changeOnWheel min={0} className="w-full" placeholder="Nhập diện tích mặt bằng" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Số lượng nhân viên">
                <InputNumber
                  className="w-full"
                  min={0}
                  defaultValue={0}
                  changeOnWheel
                  placeholder="Nhập số nhân viên"
                />
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
