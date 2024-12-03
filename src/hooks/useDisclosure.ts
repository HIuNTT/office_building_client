import { useCallback, useState } from 'react'

export interface UseDisclosureProps {
  isOpen?: boolean
  defaultOpen?: boolean
  onClose?(): void
  onOpen?(): void
}

export default function useDisclosure(props: UseDisclosureProps = {}) {
  const { defaultOpen, isOpen: isOpenProp, onClose: onCloseProp, onOpen: onOpenProp } = props

  const [isInternalOpen, setIsInternalOpen] = useState<boolean>(defaultOpen || false)

  const isControlled = isOpenProp !== undefined
  const isOpen = isControlled ? isOpenProp : isInternalOpen

  const onClose = useCallback(() => {
    if (!isControlled) {
      setIsInternalOpen(false)
    }
    onCloseProp?.()
  }, [isControlled, onCloseProp])

  const onOpen = useCallback(() => {
    if (!isControlled) {
      setIsInternalOpen(true)
    }
    onOpenProp?.()
  }, [isControlled, onOpenProp])

  const onOpenChange = useCallback(() => {
    const action = isOpen ? onClose : onOpen
    action()
  }, [isOpen, onOpen, onClose])

  return {
    isOpen: !!isOpen,
    onOpen,
    onClose,
    onOpenChange,
    isControlled,
  }
}

export type UseDisclosureReturn = ReturnType<typeof useDisclosure>
