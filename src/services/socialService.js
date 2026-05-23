import api from './api';

const socialService = {


  getAvailabilityConfig: async (userId) => {
    const { data } = await api.get(`/api/social/availability/${userId}`);
    return data;
  },

  saveAvailabilityConfig: async (userId, config) => {
    const { data } = await api.put(`/api/social/availability/${userId}`, config);
    return data;
  },


  searchUsers: async (query) => {
    const { data } = await api.get('/api/social/users/search', { params: { query } });
    return data;
  },

  getSocialPanel: async (userId) => {
    const { data } = await api.get(`/api/social/users/${userId}/panel`);
    return data;
  },

  sendHeartbeat: async (userId) => {
    const { data } = await api.put(`/api/social/users/${userId}/heartbeat`);
    return data;
  },

  getPresenceStatus: async (userId) => {
    const { data } = await api.get(`/api/social/users/${userId}/status`);
    return data;
  },

  sendConnectionRequest: async (senderId, receiverId) => {
    const { data } = await api.post(`/api/social/connections/${senderId}/request`, { receiverId });
    return data;
  },

  acceptConnectionRequest: async (requestId) => {
    const { data } = await api.put(`/api/social/connections/${requestId}/accept`);
    return data;
  },

  rejectConnectionRequest: async (requestId) => {
    const { data } = await api.put(`/api/social/connections/${requestId}/reject`);
    return data;
  },

  getSentRequests: async (senderId) => {
    const { data } = await api.get(`/api/social/connections/sent/${senderId}`);
    return data;
  },

  getPendingRequests: async (receiverId) => {
    const { data } = await api.get(`/api/social/connections/pending/${receiverId}`);
    return data;
  },

  getFriends: async (userId) => {
    const { data } = await api.get(`/api/social/friends/${userId}`);
    return data;
  },

  removeFriend: async (userId, friendId) => {
    const { data } = await api.delete(`/api/social/friends/${userId}/${friendId}`);
    return data;
  },


  createStudySession: async (creatorId, sessionData) => {
    const { data } = await api.post(`/api/social/sessions/${creatorId}`, sessionData);
    return data;
  },

  respondToStudySession: async (sessionId, response) => {
    const { data } = await api.put(`/api/social/sessions/${sessionId}/respond`, response);
    return data;
  },

  getUserSessions: async (userId) => {
    const { data } = await api.get(`/api/social/sessions/user/${userId}`);
    return data;
  },

  sendMessage: async (senderId, messageData) => {
    const { data } = await api.post(`/api/social/chat/${senderId}/messages`, messageData);
    return data;
  },

  getConversations: async (userId) => {
    const { data } = await api.get(`/api/social/chat/conversations/${userId}`);
    return data;
  },

  getConversation: async (userId, friendId) => {
    const { data } = await api.get(`/api/social/chat/conversations/${userId}/${friendId}`);
    return data;
  },

  markMessageAsRead: async (messageId) => {
    const { data } = await api.put(`/api/social/chat/messages/${messageId}/read`);
    return data;
  },

  deleteMessage: async (messageId) => {
    const { data } = await api.delete(`/api/social/chat/messages/${messageId}`);
    return data;
  },

  getReferralLink: async (userId) => {
    const { data } = await api.get(`/api/social/invitations/${userId}/link`);
    return data;
  },

  sendInvitations: async (userId, emails) => {
    const { data } = await api.post(`/api/social/invitations/${userId}/send`, { emails });
    return data;
  },

  redeemReferralCode: async (code, redeemData) => {
    const { data } = await api.post(`/api/social/invitations/${code}/redeem`, redeemData);
    return data;
  },

};

export default socialService;