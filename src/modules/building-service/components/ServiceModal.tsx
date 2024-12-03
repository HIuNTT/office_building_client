import { Button, Card, Col, Form, FormProps, Input, InputNumber, Modal, Row, Select } from 'antd'
import { toast } from 'sonner'
import { useEffect } from 'react'
import { CreateServiceDto, useCreateService } from '../services/createService'
import { useUpdateService } from '../services/updateService'
import { Service } from 'types/service'

interface ServiceModalProps {
  open: boolean
  record?: Service
  onCancel: () => void
  onSuccess: () => void
}

export default function ServiceModal({ open, onCancel, onSuccess, record }: ServiceModalProps) {
  const [form] = Form.useForm<CreateServiceDto>()

  const { mutate: mutateCreateService, isPending: isPendingCreateService } = useCreateService()
  const { mutate: mutateUpdateService, isPending: isPendingUpdateService } = useUpdateService()

  const handleSubmit: FormProps<CreateServiceDto>['onFinish'] = (value) => {
    if (record?._id) {
      mutateUpdateService(
        { ...value, id: record._id, increasePercent: value.increasePercent / 100 },
        {
          onSuccess: () => {
            toast.success('Cập nhật dịch vụ thành công')
            onSuccess()
            form.resetFields()
          },
        },
      )
    } else {
      mutateCreateService(
        { ...value, increasePercent: value.increasePercent / 100 },
        {
          onSuccess: () => {
            toast.success('Thêm dịch vụ thành công')
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

      form.setFieldsValue({ ...record, increasePercent: record.increasePercent * 100 })
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
      confirmLoading={isPendingCreateService || isPendingUpdateService}
    >
      <Card title={record ? 'Sửa thông tin dịch vụ' : 'Thêm dịch vụ mới'}>
        <Form onFinish={handleSubmit} form={form} layout="vertical">
          <Row gutter={20}>
            <Col span={12}>
              <Form.Item<CreateServiceDto>
                label="Tên dịch vụ"
                required
                name="name"
                rules={[{ required: true, message: 'Bắt buộc' }]}
              >
                <Input placeholder="Nhập tên dịch vụ" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item<CreateServiceDto>
                label="Mã số dịch vụ"
                name="code"
                required
                rules={[{ required: true, message: 'Bắt buộc' }]}
              >
                <Input placeholder="Nhập mã số dịch vụ" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item<CreateServiceDto>
                label="Loại dịch vụ"
                name="type"
                required
                rules={[{ required: true, message: 'Bắt buộc' }]}
              >
                <Select
                  showSearch
                  allowClear
                  options={[
                    {
                      label: 'An ninh',
                      value: 'An ninh',
                    },
                    {
                      label: 'Vệ sinh',
                      value: 'Vệ sinh',
                    },
                    {
                      label: 'Trông giữ xe',
                      value: 'Trông giữ xe',
                    },
                    {
                      label: 'Khác',
                      value: 'Khác',
                    },
                  ]}
                  placeholder="Chọn loại dịch vụ"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item<CreateServiceDto>
                label="Đơn giá/Tháng"
                name="basePrice"
                required
                rules={[{ required: true, message: 'Bắt buộc' }]}
              >
                <InputNumber changeOnWheel min={0} className="w-full" placeholder="Nhập đơn giá/tháng" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item<CreateServiceDto> label="Tỉ lệ tăng giá (%)" name="increasePercent">
                <InputNumber
                  className="w-full"
                  min={0}
                  defaultValue={5}
                  changeOnWheel
                  placeholder="Nhập tỉ lệ tăng giá"
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
