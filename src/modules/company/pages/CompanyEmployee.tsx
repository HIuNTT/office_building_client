import { DeleteOutlined, EditOutlined, LeftOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Card, Col, Divider, Form, Input, Popconfirm, Row, Space, Table, TableProps, Tooltip } from 'antd'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { CompanyParams } from '../route'
import { useGetCompany } from '../services/getCompany'
import { CompanyEmployee } from 'types/company'
import { useForm } from 'antd/es/form/Form'
import { useState } from 'react'
import { CompanyEmployeeParams, useGetCompanyEmployeeList } from '../services/getEmployee'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import dayjs from 'dayjs'
import { FormProps } from 'antd/lib'
import { queryClient } from 'configs/queryClient'
import useDisclosure from 'hooks/useDisclosure'
import CompanyEmployeeModal from '../components/CompanyEmployeeModal'
import { useDeleteCompanyEmployee } from '../services/deleteEmployee'
import { toast } from 'sonner'

dayjs.extend(utc)
dayjs.extend(timezone)

export default function CompanyEmployeeComponent() {
  const { companyId } = useParams<keyof CompanyParams>()

  const [form] = useForm<{ name: string }>()

  if (!companyId) {
    ;<Navigate to={'/dashboard'} />
  }

  const getCompany = useGetCompany(companyId!)

  const disclosureEmployee = useDisclosure()

  const [query, setQuery] = useState<CompanyEmployeeParams>({ limit: 5, page: 1, companyId })
  const [currentRow, setCurrentRow] = useState<CompanyEmployee>()

  const getCompanyEmployee = useGetCompanyEmployeeList(query)
  const deleteCompanyEmployee = useDeleteCompanyEmployee()

  const navigate = useNavigate()

  const columns: TableProps<CompanyEmployee>['columns'] = [
    {
      title: 'TT',
      align: 'center',
      width: 60,
      render(_, __, index) {
        return (query.page! - 1) * query.limit! + index + 1
      },
    },
    {
      title: <div style={{ textAlign: 'center' }}>Mã nhân viên</div>,
      dataIndex: 'code',
      align: 'center',
      fixed: 'left',
    },
    {
      title: <div className="text-center">Tên nhân viên</div>,
      dataIndex: 'name',
    },
    {
      title: <div className="text-center">Số CMND/CCCD</div>,
      dataIndex: 'identityNumber',
      align: 'center',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      align: 'center',
    },
    {
      title: <div className="text-center">Ngày sinh</div>,
      dataIndex: 'birthday',
      align: 'center',
      render: (text) => dayjs(text).format('DD/MM/YYYY'),
    },
    {
      title: 'Thao tác',
      width: 100,
      fixed: 'right',
      align: 'center',
      render: (_, record: CompanyEmployee) => {
        return (
          <div>
            <Tooltip title="Sửa thông tin" placement="bottom">
              <Button
                type="link"
                size="small"
                icon={<EditOutlined />}
                onClick={() => {
                  setCurrentRow(record)
                  disclosureEmployee.onOpen()
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
              okButtonProps={{ loading: deleteCompanyEmployee.isPending }}
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

  const handleDelete = (record: CompanyEmployee) => {
    deleteCompanyEmployee.mutate(record._id, {
      onSuccess: () => {
        queryClient.removeQueries({ queryKey: ['companyEmployeeList'] })
        queryClient.refetchQueries({ queryKey: ['company'] })
        toast.success('Xóa nhân viên thành công')
        setQuery({ ...query, page: 1 })
      },
    })
  }

  const handleReset = () => {
    form.resetFields()
    queryClient.removeQueries({ queryKey: ['companyEmployeeList'] })
    setQuery({ ...query, name: undefined, page: 1 })
  }

  const handleSubmit: FormProps<{ name: string }>['onFinish'] = (value) => {
    setQuery({ ...query, ...value, page: 1 })
  }

  const handleTableChange: TableProps<CompanyEmployee>['onChange'] = ({ current, pageSize }) => {
    setQuery({ ...query, page: current, limit: pageSize })
  }

  const handleModalOnSuccess = () => {
    queryClient.removeQueries({ queryKey: ['companyEmployeeList'] })
    disclosureEmployee.onClose()
    queryClient.refetchQueries({ queryKey: ['company'] })
    setQuery({ ...query, page: 1 })
  }
  return (
    <>
      <Card
        loading={getCompany.isLoading}
        className="h-full"
        title={
          <div>
            <LeftOutlined className="h-full pr-2 cursor-pointer" onClick={() => navigate(-1)} />
            <span className="ml-4">Thông tin công ty</span>
          </div>
        }
      >
        <Row gutter={[18, 18]} className="mb-9">
          <Col span={24} lg={8} md={12}>
            <span className="font-semibold">Tên công ty: </span>
            <span>{getCompany.data?.name}</span>
          </Col>
          <Col span={24} lg={8} md={12}>
            <span className="font-semibold">Mã số thuế: </span>
            <span>{getCompany.data?.taxCode}</span>
          </Col>
          <Col span={24} lg={8} md={12}>
            <span className="font-semibold">Vốn điều lệ: </span>
            <span>{getCompany.data?.capital.toLocaleString('en-US')} VNĐ</span>
          </Col>
          <Col span={24} lg={8} md={12}>
            <span className="font-semibold">Lĩnh vực hoạt động: </span>
            <span>{getCompany.data?.industry}</span>
          </Col>
          <Col span={24} lg={8} md={12}>
            <span className="font-semibold">Địa chỉ ở tòa nhà: </span>
            <span>{getCompany.data?.address}</span>
          </Col>
          <Col span={24} lg={8} md={12}>
            <span className="font-semibold">Số lượng nhân viên: </span>
            <span>{getCompany.data?.employeeQuantity}</span>
          </Col>
          <Col span={24} lg={8} md={12}>
            <span className="font-semibold">Số điện thoại: </span>
            <span>{getCompany.data?.phone}</span>
          </Col>
          <Col span={24} lg={8} md={12}>
            <span className="font-semibold">Diện tích mặt bằng: </span>
            <span>
              {getCompany.data?.area} m<span className="align-super text-[11px]">2</span>
            </span>
          </Col>
        </Row>
        <Form className="mb-8" form={form} onFinish={handleSubmit}>
          <Row gutter={24}>
            <Col span={24} md={12} lg={8}>
              <Form.Item name="name" label="Tên nhân viên:">
                <Input allowClear placeholder="Nhập tên nhân viên" />
              </Form.Item>
            </Col>
            <Col span={24} md={12} lg={16}>
              <div>
                <Form.Item className="text-right">
                  <Space>
                    <Button htmlType="button" onClick={handleReset}>
                      Nhập lại
                    </Button>
                    <Button loading={getCompanyEmployee.isFetching} type="primary" htmlType="submit">
                      Áp dụng
                    </Button>
                  </Space>
                </Form.Item>
              </div>
            </Col>
          </Row>
        </Form>
        <div className="flex justify-between mb-4">
          <div className="text-[16px] font-medium">Danh sách nhân viên</div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setCurrentRow(undefined)
              disclosureEmployee.onOpen()
            }}
          >
            Thêm mới
          </Button>
        </div>
        <Table
          dataSource={getCompanyEmployee.data?.items}
          columns={columns}
          loading={getCompanyEmployee.isFetching}
          scroll={{ x: 'max-content' }}
          rowKey="_id"
          pagination={{
            current: query.page,
            total: getCompanyEmployee.data?.meta.totalItems,
            showTotal: (total) => `Tổng số: ${total}`,
            pageSize: query.limit,
            showQuickJumper: true,
            showSizeChanger: true,
            size: 'default',
            pageSizeOptions: ['5', '10', '20', '50', '100'],
          }}
          onChange={handleTableChange}
        />
      </Card>
      <CompanyEmployeeModal
        companyId={companyId}
        open={disclosureEmployee.isOpen}
        onCancel={disclosureEmployee.onClose}
        onSuccess={handleModalOnSuccess}
        record={currentRow}
      />
    </>
  )
}
