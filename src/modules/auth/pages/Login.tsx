import { Button, Card, Form, Input } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { LoginDto, useLogin } from '../services/login'
import { FormProps } from 'antd/lib'
import { useUser } from 'store/user'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { CSSProperties } from 'react'

export default function Login() {
  const [form] = useForm<LoginDto>()

  const login = useLogin()
  const user = useUser()

  const navigate = useNavigate()

  const handleSubmit: FormProps<LoginDto>['onFinish'] = async (value) => {
    if (!value.password || !value.username) return

    login.mutate(value, {
      onSuccess: async (data) => {
        user.setAuth(data)
        toast.success('Đăng nhập thành công')
        navigate('/dashboard', { replace: true })
      },
    })
  }

  return (
    <div
      className="h-screen w-screen flex flex-col items-center justify-center"
      style={{ background: 'url(/images/login-bg.svg)', backgroundSize: '100%' }}
    >
      <Card className="w-[500px] p-2">
        <h1 className="text-center text-2xl font-medium mb-8">Đăng Nhập</h1>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item<LoginDto> initialValue="admin" name="username" label="Tên đăng nhập:">
            <Input placeholder="Nhập tên đăng nhập" />
          </Form.Item>
          <Form.Item<LoginDto> name="password" initialValue="admin" label="Mật khẩu:">
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>
          <Form.Item className="mb-0" shouldUpdate>
            {() => {
              const isDisabled = !form.getFieldsValue().username?.length || !form.getFieldsValue().password?.length
              const disabledStyle: CSSProperties = {}
              if (isDisabled) {
                disabledStyle.opacity = 0.5
                disabledStyle.cursor = 'default'
                disabledStyle.pointerEvents = 'none'
              }

              return (
                <Button
                  className="font-semibold"
                  size="large"
                  loading={login.isPending}
                  type="primary"
                  htmlType="submit"
                  style={isDisabled ? disabledStyle : {}}
                  block
                >
                  Đăng Nhập
                </Button>
              )
            }}
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
