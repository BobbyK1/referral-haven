'use client'

import { Icon } from "@chakra-ui/react"
import { GoDotFill } from "react-icons/go"
import { AiOutlineMail, AiOutlinePhone, AiOutlinePlus, AiOutlineSetting } from 'react-icons/ai'


export const Status = (props) => {
    return <Icon as={GoDotFill}  {...props} />
}

export const Phone = (props) => {
    return <Icon as={AiOutlinePhone} {...props} />
}

export const Email = (props) => {
    return <Icon as={AiOutlineMail} {...props} />
}

export const Settings = (props) => {
    return <Icon as={AiOutlineSetting} {...props} />
}

export const Add = (props) => {
    return <Icon as={AiOutlinePlus} {...props} />
}