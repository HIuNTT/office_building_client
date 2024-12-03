import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Card, Col, Divider, Form, Input, Popconfirm, Row, Space, Table, TableProps, Tooltip } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { Company } from 'types/company'
import { CompanyListParams, useGetCompanyList } from '../services/getCompanyList'
import { useState } from 'react'
import { FormProps } from 'antd/lib'
import { queryClient } from 'configs/queryClient'
import { useNavigate } from 'react-router-dom'
import CompanyModal from '../components/CompanyModal'
import useDisclosure from 'hooks/useDisclosure'
import { useDeleteCompany } from '../services/deleteCompany'
import { toast } from 'sonner'

export default function CompanyRental() {
  const [form] = useForm<{ name: string }>()

  const navigate = useNavigate()

  const disclosureCompany = useDisclosure()

  const [query, setQuery] = useState<CompanyListParams>({ limit: 5, page: 1 })
  const [currentRow, setCurrentRow] = useState<Company>()

  const getCompanyList = useGetCompanyList(query)
  const deleteCompany = useDeleteCompany()

  const columns: TableProps<Company>['columns'] = [
    {
      title: 'TT',
      align: 'center',
      width: 60,
      render(_, __, index) {
        return (query.page! - 1) * query.limit! + index + 1
      },
    },
    {
      title: <div style={{ textAlign: 'center' }}>Tên công ty</div>,
      dataIndex: 'name',
      fixed: 'left',
    },
    {
      title: <div className="text-center">Mã số thuế</div>,
      dataIndex: 'taxCode',
    },
    {
      title: <div className="text-center">Lĩnh vực hoạt động</div>,
      dataIndex: 'industry',
    },
    {
      title: 'Số nhân viên',
      dataIndex: 'employeeQuantity',
      align: 'center',
    },
    {
      title: <div className="text-center">Địa chỉ ở tòa nhà</div>,
      dataIndex: 'address',
    },
    {
      title: <div className="text-center">Số điện thoại</div>,
      dataIndex: 'phone',
    },
    {
      title: <div className="text-center">Diện tích mặt bằng</div>,
      dataIndex: 'area',
      width: 100,
      align: 'right',
    },
    {
      title: 'Thao tác',
      width: 100,
      fixed: 'right',
      align: 'center',
      render: (_, record: Company) => {
        return (
          <div>
            <Button type="link" onClick={() => navigate(`/company/${record._id}`)}>
              Xem thêm
            </Button>
            <div>
              <Tooltip title="Sửa thông tin" placement="bottom">
                <Button
                  type="link"
                  size="small"
                  icon={<EditOutlined />}
                  onClick={() => {
                    setCurrentRow(record)
                    disclosureCompany.onOpen()
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
                okButtonProps={{ loading: deleteCompany.isPending }}
                onConfirm={() => handleDelete(record)}
              >
                <Tooltip title="Xóa" placement="bottom">
                  <Button size="small" type="link" icon={<DeleteOutlined />} danger />
                </Tooltip>
              </Popconfirm>
            </div>
          </div>
        )
      },
    },
  ]

  const handleDelete = (record: Company) => {
    deleteCompany.mutate(record._id, {
      onSuccess: () => {
        queryClient.removeQueries({ queryKey: ['companyList'] })
        toast.success('Xóa công ty thành công')
        setQuery({ ...query, page: 1 })
      },
    })
  }

  const handleReset = () => {
    form.resetFields()
    queryClient.removeQueries({ queryKey: ['companyList'] })
    setQuery({ ...query, page: 1, name: undefined })
  }

  const handleSubmit: FormProps<{ name: string }>['onFinish'] = (value) => {
    setQuery({ ...query, ...value, page: 1 })
  }

  const handleTableChange: TableProps<Company>['onChange'] = ({ current, pageSize }) => {
    setQuery({ ...query, page: current, limit: pageSize })
  }

  const handleModalOnSuccess = () => {
    queryClient.removeQueries({ queryKey: ['companyList'] })
    disclosureCompany.onClose()
    setQuery({ ...query, page: 1 })
  }

  return (
    <>
      <Card className="h-full" title="Danh sách công ty thuê văn phòng">
        <Form form={form} onFinish={handleSubmit}>
          <Row gutter={24}>
            <Col span={24} md={12} lg={8}>
              <Form.Item name="name" label="Tên công ty:">
                <Input allowClear placeholder="Nhập tên công ty" />
              </Form.Item>
            </Col>
            <Col span={24} md={12} lg={16}>
              <div>
                <Form.Item className="text-right">
                  <Space>
                    <Button htmlType="button" onClick={handleReset}>
                      Nhập lại
                    </Button>
                    <Button loading={getCompanyList.isFetching} type="primary" htmlType="submit">
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
              disclosureCompany.onOpen()
            }}
          >
            Thêm mới
          </Button>
        </div>
        <Table<Company>
          rowKey="_id"
          pagination={{
            current: query.page,
            total: getCompanyList.data?.meta.totalItems,
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
          dataSource={getCompanyList.data?.items}
          loading={getCompanyList.isFetching}
        />
      </Card>
      <CompanyModal
        record={currentRow}
        onSuccess={handleModalOnSuccess}
        open={disclosureCompany.isOpen}
        onCancel={disclosureCompany.onClose}
      />
    </>
  )
}
