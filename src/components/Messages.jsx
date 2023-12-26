import React, { useContext, useEffect, useState } from 'react';
import Message from './Message';
import styles from '../styles/messages.module.css';
import { ChatContext } from '../context/ChatContext';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { GroupContext } from '../context/GroupContext';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  // const [grpMessages, setGrpMessages] = useState([]);
  const { data } = useContext(ChatContext);
  const { groupId, chatType,groupData ,getGroupById} = useContext(GroupContext);

  const grpMessages=groupData?.messages
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
      getGroupById(groupId);
    }
  }, [groupId, chatType]);

  return (
    <div className={styles.messages}>
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
