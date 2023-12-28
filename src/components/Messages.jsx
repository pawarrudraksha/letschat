import React, { useContext, useEffect, useState, useRef } from 'react';
import Message from './Message';
import styles from '../styles/messages.module.css';
import { ChatContext } from '../context/ChatContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { GroupContext } from '../context/GroupContext';
import { SearchMessageContext } from '../context/SearchMessageContext';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);
  const { groupId, chatType } = useContext(GroupContext);
  const { selectedMessageId } = useContext(SearchMessageContext);
  const [grpMessages,setGrpMessages] = useState([]);
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    const unsubscribeUserChat = () => {};

    if (chatType === 'user' && data.chatId) {
      const onSub = onSnapshot(doc(db, 'chats', data.chatId), (doc) => {
        doc.exists() && setMessages(doc.data()?.messages || []);
      });

      return () => {
        onSub();
      };
    }

    return unsubscribeUserChat;
  }, [data.chatId, chatType]);

  useEffect(() => {
    if (groupId && chatType === 'group') {
      const onSub = onSnapshot(doc(db, 'groups', groupId), (doc) => {
        doc.exists() && setGrpMessages(doc.data()?.messages || []);
      });

      return () => {
        onSub();
      };    }
  }, [groupId, chatType,]);

  useEffect(() => {
    if (selectedMessageId && messagesContainerRef.current) {
      const selectedMessageElement = messagesContainerRef.current.querySelector(`[data-message-id="${selectedMessageId}"]`);
      if (selectedMessageElement) {
        selectedMessageElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [selectedMessageId]);

  return (
    <div ref={messagesContainerRef} className={styles.messages}>
      {chatType === 'user' &&
        messages.map((m) => (
          <Message message={m} key={m.id} />
        ))}
      {chatType === 'group' &&
        grpMessages.map((m) => (
          <Message message={m} key={m.id} />
        ))}
    </div>
  );
};

export default Messages;
