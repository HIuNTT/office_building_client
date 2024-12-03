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
import { queryClient } from 'configs/queryClient'
import { BuildingEmployee } from 'types/employee'
import { BuildingEmployeeListParams, useGetBuildingEmployeeList } from '../services/getEmployeeList'
import { useState } from 'react'

import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import dayjs from 'dayjs'
import EmployeeModal from '../components/EmployeeModal'
import useDisclosure from 'hooks/useDisclosure'
import { useDeleteEmployee } from '../services/deleteEmployee'
import { toast } from 'sonner'

dayjs.extend(utc)
dayjs.extend(timezone)

export default function EmpoyeeComponent() {
  const [form] = useForm<Omit<BuildingEmployeeListParams, 'limit' | 'page'>>()

  const disclosureEmployee = useDisclosure()

  const [query, setQuery] = useState<BuildingEmployeeListParams>({ limit: 5, page: 1 })
  const [currentRow, setCurrentRow] = useState<BuildingEmployee>()

  const getBuildingEmployeeList = useGetBuildingEmployeeList(query)
  const deleteEmployee = useDeleteEmployee()

  const columns: TableProps<BuildingEmployee>['columns'] = [
    {
      title: 'TT',
      align: 'center',
      width: 60,
      render(_, __, index) {
        return (query.page! - 1) * query.limit! + index + 1
      },
    },
    {
      title: <div className="text-center">Mã nhân viên</div>,
      dataIndex: 'code',
      width: 150,
      align: 'center',
      fixed: 'left',
    },
    {
      title: <div style={{ textAlign: 'center' }}>Tên nhân viên</div>,
      dataIndex: 'name',
      fixed: 'left',
    },

    {
      title: <div className="text-center">Bậc</div>,
      dataIndex: 'level',
      align: 'center',
    },
    {
      title: 'Vị trí',
      dataIndex: 'position',
      width: 130,
      align: 'center',
    },
    {
      title: <div className="text-center">Lương cơ bản</div>,
      dataIndex: 'baseSalary',
      align: 'right',
      render: (value) => `${value.toLocaleString('en-US')} VNĐ`,
    },
    {
      title: <div className="text-center">Số điện thoại</div>,
      dataIndex: 'phone',
      width: 150,
      align: 'right',
    },
    {
      title: <div className="text-center">Địa chỉ</div>,
      dataIndex: 'address',
      align: 'right',
    },
    {
      title: <div className="text-center">Ngày sinh</div>,
      dataIndex: 'birthday',
      width: 200,
      align: 'right',
      render: (value) => {
        return dayjs(value).format('DD/MM/YYYY')
      },
    },
    {
      title: 'Thao tác',
      width: 100,
      fixed: 'right',
      align: 'center',
      render: (_, record: BuildingEmployee) => {
        return (
          <div>
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
                onConfirm={() => handleDelete(record)}
                okButtonProps={{ loading: deleteEmployee.isPending }}
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

  const handleDelete = (record: BuildingEmployee) => {
    deleteEmployee.mutate(record._id, {
      onSuccess: () => {
        queryClient.removeQueries({ queryKey: ['buildingEmployeeList'] })
        toast.success('Xóa nhân viên thành công')
        setQuery({ ...query, page: 1 })
      },
    })
  }

  const handleReset = () => {
    form.resetFields()
    queryClient.removeQueries({ queryKey: ['buildingEmployeeList'] })
    setQuery({ ...query, page: 1, name: undefined, code: undefined, level: undefined })
  }

  const handleSubmit: FormProps<Omit<BuildingEmployeeListParams, 'limit' | 'page'>>['onFinish'] = (value) => {
    setQuery({ ...query, ...value, page: 1 })
  }

  const handleTableChange: TableProps<BuildingEmployee>['onChange'] = ({ current, pageSize }) => {
    setQuery({ ...query, page: current, limit: pageSize })
  }

  const handleModalOnSuccess = () => {
    queryClient.removeQueries({ queryKey: ['buildingEmployeeList'] })
    disclosureEmployee.onClose()
    setQuery({ ...query, page: 1 })
  }

  return (
    <>
      <Card className="h-full" title="Danh sách nhân viên tòa nhà">
        <Form form={form} onFinish={handleSubmit}>
          <Row gutter={24}>
            <Col span={24} md={12} lg={8}>
              <Form.Item name="name" label="Tên nhân viên:">
                <Input allowClear placeholder="Nhập tên nhân viên" />
              </Form.Item>
            </Col>
            <Col span={24} md={12} lg={8}>
              <Form.Item name="code" label="Mã nhân viên:">
                <Input allowClear placeholder="Nhập mã nhân viên" />
              </Form.Item>
            </Col>
            <Col span={24} md={12} lg={8}>
              <Form.Item name="level" label="Bậc:">
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
            <Col span={24}>
              <div>
                <Form.Item className="text-right">
                  <Space>
                    <Button htmlType="button" onClick={handleReset}>
                      Nhập lại
                    </Button>
                    <Button loading={getBuildingEmployeeList.isFetching} type="primary" htmlType="submit">
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
              disclosureEmployee.onOpen()
            }}
          >
            Thêm mới
          </Button>
        </div>
        <Table<BuildingEmployee>
          rowKey="_id"
          pagination={{
            current: query.page,
            total: getBuildingEmployeeList.data?.meta.totalItems,
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
          dataSource={getBuildingEmployeeList.data?.items}
          loading={getBuildingEmployeeList.isFetching}
        />
      </Card>
      <EmployeeModal
        onSuccess={handleModalOnSuccess}
        record={currentRow}
        open={disclosureEmployee.isOpen}
        onCancel={disclosureEmployee.onClose}
      />
    </>
  )
}
