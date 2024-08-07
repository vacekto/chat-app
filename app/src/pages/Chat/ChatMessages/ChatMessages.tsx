import { useAppSelector } from '../../../redux/hooks';
import BorderContainer from '../../../components/BorderContainer';
import './ChatMessages.scss';
import Message from './Message';
import { useEffect } from 'react';

interface IChatMessagesProps { }

const ChatMessages: React.FC<IChatMessagesProps> = () => {
    const activeChannel = useAppSelector(state => state.message.activeChannel)

    useEffect(() => {
        console.log(activeChannel.messages)
    }, [activeChannel.messages])

    return <div className="ChatMessages">
        <BorderContainer
            title={activeChannel.channelName}
        >

            {activeChannel.messages.map(msg => {
                return <Message message={msg} key={msg.id} />
            })}
        </BorderContainer>
    </div>
}

export default ChatMessages