import { apiRequest, api } from './api';
import { ChatMessageResponseDTO, ChatMessageRequestDTO } from '@/types/chatMessage';
import { PageResponse } from '@/types/appointment';

export const chatMessageService = {
  create(dto: ChatMessageRequestDTO) {
    return apiRequest<ChatMessageResponseDTO>(`/chat-messages`, {
      method: 'POST',
      body: dto,
    });
  },

  countUnreadMessages(chatId: string, receiverType: string) {
    return apiRequest<number>(`/chat-messages/chat/${chatId}/unread-count`, {
      params: { receiverType },
    });
  },

  getMessagesByChatId(chatId: string, page = 0, size = 10) {
    return apiRequest<PageResponse<ChatMessageResponseDTO>>(
      `/chat-messages/chat/${chatId}`,
      { params: { page: String(page), size: String(size) } },
    );
  },

  markMessagesAsSeen(chatId: string, messageIds: string[]) {
    return apiRequest<void>(`/chat-messages/seen/${chatId}`, {
      method: 'PUT',
      body: messageIds,
    });
  },

  async uploadFile(params: {
    chatId: string;
    senderId: string;
    senderType: string;
    contentType: string;
    file: File;
  }): Promise<ChatMessageResponseDTO> {
    const formData = new FormData();
    formData.append('chatId', params.chatId);
    formData.append('senderId', params.senderId);
    formData.append('senderType', params.senderType);
    formData.append('contentType', params.contentType);
    formData.append('file', params.file);

    const { data } = await api.post<ChatMessageResponseDTO>('/chat-messages/file', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return data;
  },
};
