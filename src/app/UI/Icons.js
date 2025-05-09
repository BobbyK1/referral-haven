'use client'

import { Icon } from "@chakra-ui/react"
import { GoDotFill } from "react-icons/go"
import { AiOutlineCheck, AiOutlineDown, AiOutlineEdit, AiOutlineException, AiOutlineExclamationCircle, AiOutlineFileText, AiOutlineMail, AiOutlineNotification, AiOutlinePhone, AiOutlinePlus, AiOutlineQuestionCircle, AiOutlineRight, AiOutlineSetting, AiOutlineUser, AiOutlineUserAdd } from 'react-icons/ai'


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

export const Edit = (props) => {
    return <Icon as={AiOutlineEdit} {...props} />
}

export const DownChevron = (props) => {
    return <Icon as={AiOutlineDown} {...props} />
}

export const RightArrow = (props) => {
    return <Icon as={AiOutlineRight} {...props} />
}

export const Bell = (props) => {
    return <Icon as={AiOutlineNotification} {...props} />
}

export const Check = (props) => {
    return <Icon as={AiOutlineCheck} {...props} />
}

export const Exclamation = (props) => {
    return <Icon as={AiOutlineExclamationCircle} {...props} />
}

export const Account = (props) => {
    return <Icon as={AiOutlineUser} {...props} />
}

export const Note = (props) => {
    return <Icon as={AiOutlineFileText} {...props} />
}

export const Document = (props) => {
    return <Icon as={AiOutlineException} {...props} />
}

export const Question = (props) => {
    return <Icon as={AiOutlineQuestionCircle} {...props} />
}

export const AddAgent = (props) => {
    return <Icon as={AiOutlineUserAdd} {...props} />
}