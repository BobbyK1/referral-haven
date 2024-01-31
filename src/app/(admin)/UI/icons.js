'use client'

import { Icon } from "@chakra-ui/react"
import { AiOutlineDown, AiOutlineEllipsis, AiOutlineSearch } from "react-icons/ai"

export const DownChevron = (props) => {
    return <Icon as={AiOutlineDown} {...props} />
}

export const Search = (props) => {
    return <Icon as={AiOutlineSearch} {...props} />
}

export const Options = (props) => {
    return <Icon as={AiOutlineEllipsis} {...props} />
}