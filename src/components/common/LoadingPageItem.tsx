import { Flex, Spin } from 'antd'

export default function LoadingPageItem() {
  return (
    <Flex vertical justify="center" align="center">
      <Spin size="large" />
    </Flex>
  )
}
