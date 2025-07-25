import React from 'react'
import { Button as AntButton } from 'antd'

export default function Button({ type = 'primary', size = 'middle', ...props }) {
  return <AntButton type={type} size={size} {...props} />
}
