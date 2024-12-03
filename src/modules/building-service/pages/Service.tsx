import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  TableProps,
  Tooltip,
} from 'antd'
import { useForm } from 'antd/es/form/Form'
import { FormProps } from 'antd/lib'
import { useState } from 'react'
import { Service } from 'types/service'
import { ServiceListParams, useGetServiceList } from '../services/getServiceList'
import { queryClient } from 'configs/queryClient'
import ServiceModal from '../components/ServiceModal'
import useDisclosure from 'hooks/useDisclosure'
import { useDeleteService } from '../services/deleteService'
import { toast } from 'sonner'

export default function ServiceComponent() {
  const [form] = useForm<Omit<ServiceListParams, 'limit' | 'page'>>()

  const disclosureService = useDisclosure()

  const [query, setQuery] = useState<ServiceListParams>({ limit: 5, page: 1 })
  const [currentRow, setCurrentRow] = useState<Service>()

  const getServiceList = useGetServiceList(query)
  const deleteService = useDeleteService()

  const columns: TableProps<Service>['columns'] = [
    {
      title: 'TT',
      align: 'center',
      width: 60,
      render(_, __, index) {
        return (query.page! - 1) * query.limit! + index + 1
      },
    },
    {
      title: 'Mã số dịch vụ',
      dataIndex: 'code',
      width: 150,
      align: 'center',
    },
    {
      title: <div style={{ textAlign: 'center' }}>Tên dịch vụ</div>,
      dataIndex: 'name',
      fixed: 'left',
    },
    {
      title: <div className="text-center">Loại</div>,
      align: 'center',
      dataIndex: 'type',
    },
    {
      title: <div className="text-center">Đơn giá/Tháng</div>,
      sorter: true,
      sortOrder: query.order === 'asc' ? 'ascend' : query.order === 'desc' ? 'descend' : undefined,
      dataIndex: 'basePrice',
      align: 'right',
      render: (value) => {
        return `${value.toLocaleString('en-US')} VNĐ`
      },
    },
    {
      title: <div className="text-center">Tỉ lệ tăng giá</div>,
      dataIndex: 'increasePercent',
      align: 'center',
      render: (value) => {
        return `${value * 100}%`
      },
    },
    {
      title: 'Thao tác',
      width: 100,
      fixed: 'right',
      align: 'center',
      render: (_, record: Service) => {
        return (
          <div>
            <Tooltip title="Sửa thông tin" placement="bottom">
              <Button
                type="link"
                size="small"
                icon={<EditOutlined />}
                onClick={() => {
                  setCurrentRow(record)
                  disclosureService.onOpen()
                }}
              />
            </Tooltip>
            <Divider type="vertical" />
            <Popconfirm
              key="del"
              placement="left"
              title="Bạn chắc chắn muốn xóa?"
              okText="Xóa"
              cancelText="Hủy"
              cancelButtonProps={{ type: 'text', danger: true }}
              okButtonProps={{ loading: deleteService.isPending }}
              onConfirm={() => handleDelete(record)}
            >
              <Tooltip title="Xóa" placement="bottom">
                <Button size="small" type="link" icon={<DeleteOutlined />} danger />
              </Tooltip>
            </Popconfirm>
          </div>
        )
      },
    },
  ]

  const handleDelete = (record: Service) => {
    deleteService.mutate(record._id, {
      onSuccess: () => {
        queryClient.removeQueries({ queryKey: ['serviceList'] })
        toast.success('Xóa dịch vụ thành công')
        setQuery({ ...query, page: 1 })
      },
    })
  }

  const handleReset = () => {
    form.resetFields()
    queryClient.removeQueries({ queryKey: ['serviceList'] })
    setQuery({
      ...query,
      page: 1,
      name: undefined,
      type: undefined,
      code: undefined,
      sortBy: undefined,
      order: undefined,
    })
  }

  const handleSubmit: FormProps<Omit<ServiceListParams, 'limit' | 'page'>>['onFinish'] = (value) => {
    setQuery({ ...query, ...value, page: 1 })
  }

  const handleTableChange: TableProps<Service>['onChange'] = ({ current, pageSize }, _, sorter) => {
    setQuery({
      ...query,
      page: current,
      limit: pageSize,
      sortBy: Array.isArray(sorter) ? undefined : sorter.field?.toString(),
      order: Array.isArray(sorter)
        ? undefined
        : sorter.order === 'ascend'
          ? 'asc'
          : sorter.order === 'descend'
            ? 'desc'
            : undefined,
    })
  }

  const handleModalOnSuccess = () => {
    queryClient.removeQueries({ queryKey: ['serviceList'] })
    disclosureService.onClose()
    setQuery({ ...query, page: 1 })
  }

  return (
    <>
      <Card className="h-full" title="Danh sách dịch vụ của tòa nhà">
        <Form form={form} onFinish={handleSubmit}>
          <Row gutter={24}>
            <Col span={24} md={12} lg={8}>
              <Form.Item name="name" label="Tên dịch vụ:">
                <Input allowClear placeholder="Nhập tên dịch vụ" />
              </Form.Item>
            </Col>
            <Col span={24} md={12} lg={8}>
              <Form.Item name="code" label="Mã số dịch vụ:">
                <Input allowClear placeholder="Nhập mã số dịch vụ" />
              </Form.Item>
            </Col>
            <Col span={24} md={12} lg={8}>
              <Form.Item name="type" label="Loại dịch vụ:">
                <Select
                  showSearch
                  allowClear
                  placeholder="Chọn loại dịch vụ"
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
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <div>
                <Form.Item className="text-right">
                  <Space>
                    <Button htmlType="button" onClick={handleReset}>
                      Nhập lại
                    </Button>
                    <Button loading={getServiceList.isFetching} type="primary" htmlType="submit">
                      Áp dụng
                    </Button>
                  </Space>
                </Form.Item>
              </div>
            </Col>
          </Row>
        </Form>
        <div className="mt-2 mb-5">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setCurrentRow(undefined)
              disclosureService.onOpen()
            }}
          >
            Thêm mới
          </Button>
        </div>
        <Table<Service>
          rowKey="_id"
          pagination={{
            current: query.page,
            total: getServiceList.data?.meta.totalItems,
            showTotal: (total) => `Tổng số: ${total}`,
            pageSize: query.limit,
            showQuickJumper: true,
            showSizeChanger: true,
            size: 'default',
            pageSizeOptions: ['5', '10', '20', '50', '100'],
          }}
          columns={columns}
          scroll={{ x: 'max-content' }}
          onChange={handleTableChange}
          dataSource={getServiceList.data?.items}
          loading={getServiceList.isFetching}
        />
      </Card>
      <ServiceModal
        record={currentRow}
        onSuccess={handleModalOnSuccess}
        open={disclosureService.isOpen}
        onCancel={disclosureService.onClose}
      />
    </>
  )
}
