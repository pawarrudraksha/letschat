import React, { useContext, useEffect, useState } from 'react';
import Message from './Message';
import styles from '../styles/messages.module.css';
import { ChatContext } from '../context/ChatContext';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { GroupContext } from '../context/GroupContext';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [grpMessages, setGrpMessages] = useState([]);
  const { data } = useContext(ChatContext);
  const { groupId, chatType } = useContext(GroupContext);

  const getGroupById = async () => {
    try {
      const groupDocRef = doc(db, 'groups', groupId);
      const groupSnapshot = await getDoc(groupDocRef);
      setGrpMessages(groupSnapshot.data()?.messages || []);
    } catch (error) {
      console.error('Error fetching group messages:', error);
    }
  };

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
      getGroupById();
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
