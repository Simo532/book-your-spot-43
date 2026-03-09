import { apiRequest, tokenStorage, BASE_URL } from './api';
import { ChatMessageResponseDTO, ChatMessageRequestDTO } from '@/types/chatMessage';
import { PageResponse } from '@/types/appointment';

export const chatMessageService = {
  // Create a chat message
  create(dto: ChatMessageRequestDTO) {
    return apiRequest<ChatMessageResponseDTO>(`/chat-messages`, {
      method: 'POST',
      body: dto,
    });
  },

  // Get unread message count for a chat
  countUnreadMessages(chatId: string, receiverType: string) {
    return apiRequest<number>(`/chat-messages/chat/${chatId}/unread-count`, {
      params: { receiverType },
    });
  },

  // Get messages by chatId (paginated)
  getMessagesByChatId(chatId: string, page = 0, size = 10) {
    return apiRequest<PageResponse<ChatMessageResponseDTO>>(
      `/chat-messages/chat/${chatId}`,
      { params: { page: String(page), size: String(size) } },
    );
  },

  // Mark messages as seen
  markMessagesAsSeen(chatId: string, messageIds: string[]) {
    return apiRequest<void>(`/chat-messages/seen/${chatId}`, {
      method: 'PUT',
      body: messageIds,
    });
  },

  // Upload a file message (multipart)
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

    const token = tokenStorage.getAccessToken();
    const res = await fetch(`${BASE_URL}/chat-messages/file`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`File upload error [${res.status}]: ${errorText}`);
    }

    return res.json();
  },
};
