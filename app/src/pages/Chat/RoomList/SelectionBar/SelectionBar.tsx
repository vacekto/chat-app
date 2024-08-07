import './SelectionBar.scss';
import { Icon } from '@chakra-ui/react';
import {
    AutoComplete,
    AutoCompleteInput,
    AutoCompleteItem,
    AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";
import { useRef, useState } from 'react';
import { TbUser } from "react-icons/tb";
import { TbUsersGroup } from "react-icons/tb";
import socket from '../../../../util/socket';
import { v4 as uuidv4 } from 'uuid';
import { IUser, TChannelKind } from '@chatapp/shared';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import thunk from '../../../../redux/thunk';

interface ITopBarProps {
    selectChannelKind: React.Dispatch<React.SetStateAction<TChannelKind>>
}

const SelectionBar: React.FC<ITopBarProps> = ({ selectChannelKind }) => {

    const [options, setOptions] = useState<IUser[]>([])
    const clientUsername = useAppSelector(state => state.userData.username)
    const inputRef = useRef<HTMLInputElement>(null)
    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const dispatch = useAppDispatch()
    const fetchOptions = () => {

        const debounceCb = () => {
            debounceTimeoutRef.current = null
            const eventCb = (users: IUser[]) => {
                users = users.filter(u => u.username !== clientUsername)
                console.log(users)
                setOptions(users)
            }
            socket.emit("requestUsersList", inputRef.current!.value, eventCb)
        }

        if (debounceTimeoutRef.current)
            clearTimeout(debounceTimeoutRef.current)
        debounceTimeoutRef.current = setTimeout(debounceCb, 300)
    }

    const selectOption = (username: string) => {
        console.log(username, clientUsername)
        dispatch(thunk.fetchDirectChannel([username, clientUsername]))
    }

    return <div className="SelectionBar">
        <div className="options">
            <div
                className="icon"
                onClick={() => selectChannelKind("direct")}
            >
                <Icon as={TbUser} />
                <div className="caption">messages</div>
            </div>
            <div
                className="icon"
                onClick={() => selectChannelKind("group")}
            >
                <Icon as={TbUsersGroup} />
                <div className="caption">groups</div>
            </div>
        </div>

        <AutoComplete
            openOnFocus
            onChange={selectOption}
        >
            <AutoCompleteInput
                variant="filled"
                onChange={fetchOptions}
                ref={inputRef}

            />
            <AutoCompleteList>
                {options.map(user => (
                    <AutoCompleteItem
                        key={uuidv4()}
                        value={user.username}
                    >
                        {user.username}
                    </AutoCompleteItem>
                ))}
            </AutoCompleteList>
        </AutoComplete>
    </div>
}

export default SelectionBar