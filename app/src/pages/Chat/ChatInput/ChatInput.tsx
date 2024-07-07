import './ChatInput.scss';
import BorderContainer from '../../../components/BorderContainer';
import { ChangeEvent, KeyboardEventHandler, useState } from 'react';
import { Button } from '@chakra-ui/react'
import { Textarea } from '@chakra-ui/react'
import { useAppSelector } from '../../../redux/hooks';
import socket from '../../../util/socket';
import { v4 as uuidv4 } from 'uuid';
import { IMessage } from '@chatapp/shared';

interface IChatInputProps { }

const ChatInput: React.FC<IChatInputProps> = () => {
    const [text, setText] = useState<string>("")
    const activeChannel = useAppSelector(state => state.message.activeChannel)
    const username = useAppSelector(state => state.userData.username)

    const sendMessage = () => {
        const message: IMessage = {
            author: username,
            id: uuidv4(),
            channelId: activeChannel.id,
            text
        }

        const event = activeChannel.kind === "direct" ?
            "directMessage" :
            "groupMessage"

        socket.emit(event, message)
    }

    const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
        if (e.key !== "Enter") return
        if (e.shiftKey) {
            setText(prevState => prevState + "\n")
            return
        }

        e.preventDefault()
        sendMessage()
        setText("")
    }

    const test = () => {
    }

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value)
    }
    return <div className="ChatInput">
        <BorderContainer
            title='Message'
        >
            <Textarea
                onKeyDown={handleKeyDown}
                onChange={handleChange}
                value={text}
                size='sm'
                resize='none'
            />
            <Button onClick={test}>send</Button>
        </BorderContainer>
    </div>
}

export default ChatInput