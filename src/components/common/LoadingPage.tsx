import { Flex, Spin } from 'antd'

export default function LoadingPage() {
  return (
    <Flex className="h-screen" vertical justify="center" align="center">
      <Spin size="large" />
    </Flex>
  )
}
