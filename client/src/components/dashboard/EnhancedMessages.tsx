import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  MessageCircle, 
  Send, 
  Search, 
  Filter, 
  Paperclip, 
  MoreVertical,
  User,
  Clock,
  Check,
  CheckCheck
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { AssistantBubble } from "@/components/messages/AssistantBubble";

interface Conversation {
  partnerId: string;
  partnerName: string;
  partnerRole: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

interface Message {
  id: number;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  isRead?: boolean;
  attachments?: Array<{
    id: string;
    fileName: string;
    fileUrl: string;
    fileType: string;
  }>;
}

export function EnhancedMessages() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [location, setLocation] = useLocation();
  
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [assistantHistory, setAssistantHistory] = useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >([]);
  const [assistantResponse, setAssistantResponse] = useState<{
    message: string;
    suggestedProviders: any[];
  } | null>(null);
  const [assistantLoading, setAssistantLoading] = useState(false);

  const { data: conversations, isLoading: conversationsLoading } = useQuery({
    queryKey: ["/api/conversations", user?.id],
    enabled: !!user?.id,
  });

  const { data: messages, isLoading: messagesLoading } = useQuery({
    queryKey: ["/api/messages", user?.id, selectedConversation],
    enabled: !!user?.id && !!selectedConversation,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (data: { receiverId: string; content: string; attachments?: any[] }) => {
      return apiRequest("POST", "/api/messages", data);
    },
    onSuccess: () => {
      setMessageText("");
      queryClient.invalidateQueries({ queryKey: ["/api/messages", user?.id, selectedConversation] });
      queryClient.invalidateQueries({ queryKey: ["/api/conversations", user?.id] });
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to send message",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (partnerId: string) => {
      return apiRequest("PUT", `/api/conversations/${encodeURIComponent(partnerId)}/read`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations", user?.id] });
    }
  });

  useEffect(() => {
    const query = location.includes("?") ? location.split("?")[1] : "";
    const partnerId = new URLSearchParams(query).get("partner");
    if (partnerId) {
      setSelectedConversation(partnerId);
      markAsReadMutation.mutate(partnerId);
    }
  }, [location]);

  const callAssistant = (sentText: string) => {
    setAssistantLoading(true);
    fetch("/api/assistant/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        message: sentText,
        history: assistantHistory,
        patientContext: { location: "Calgary", insuranceProviders: [] },
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(await response.text());
        }
        return response.json();
      })
      .then((data: { message: string; suggestedProviders: any[] }) => {
        setAssistantResponse(data);
        setAssistantLoading(false);
        setAssistantHistory((prev) => [
          ...prev,
          { role: "user", content: sentText },
          { role: "assistant", content: data.message },
        ]);
      })
      .catch(() => setAssistantLoading(false));
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedConversation) return;
    const sentText = messageText.trim();

    sendMessageMutation.mutate(
      {
        receiverId: selectedConversation,
        content: sentText,
      },
    );
  };

  const handleConversationSelect = (partnerId: string) => {
    setSelectedConversation(partnerId);
    markAsReadMutation.mutate(partnerId);
    setLocation(`/dashboard/patient?tab=messages&partner=${encodeURIComponent(partnerId)}`);
  };

  if (conversationsLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Messages</h2>
          <p className="text-gray-600">Communicate with your healthcare providers</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          <Card className="lg:col-span-1">
            <CardContent className="p-0">
              <Skeleton className="h-full w-full" />
            </CardContent>
          </Card>
          <Card className="lg:col-span-2">
            <CardContent className="p-0">
              <Skeleton className="h-full w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const conversationList = (conversations as Conversation[]) || [];
  const messageList = (messages as Message[]) || [];
  const uniqueMessages = messageList.filter(
    (msg, index, arr) => arr.findIndex((message) => message.id === msg.id) === index,
  );
  const filteredConversations = conversationList.filter(conv =>
    searchQuery === "" ||
    (conv.partnerName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (conv.lastMessage || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedConversationData = conversationList.find(c => c.partnerId === selectedConversation);
  const totalUnread = conversationList.reduce((sum, conv) => sum + conv.unreadCount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Messages</h2>
          <p className="text-gray-600">Communicate with your healthcare providers</p>
        </div>
        {totalUnread > 0 && (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800" data-testid="unread-count">
            {totalUnread} unread
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="search-conversations"
                />
              </div>
              <Button variant="outline" size="sm" data-testid="filter-conversations">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              {filteredConversations.length === 0 ? (
                <div className="p-6 text-center">
                  <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No conversations yet</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredConversations.map((conversation) => (
                    <div
                      key={conversation.partnerId}
                      onClick={() => handleConversationSelect(conversation.partnerId)}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors border-l-4 ${
                        selectedConversation === conversation.partnerId
                          ? 'border-[hsl(207,90%,54%)] bg-blue-50' 
                          : 'border-transparent'
                      }`}
                      data-testid={`conversation-${conversation.partnerId}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {(conversation.partnerName || "?").charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium text-gray-900 truncate">
                                {conversation.partnerName}
                              </h4>
                              {conversation.unreadCount > 0 && (
                                <Badge variant="secondary" className="bg-blue-500 text-white text-xs ml-2">
                                  {conversation.unreadCount}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 truncate mb-1">
                              {conversation.lastMessage}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(conversation.lastMessageTime).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Message View */}
        <Card className="lg:col-span-2">
          {!selectedConversation ? (
            <CardContent className="p-8 h-full flex items-center justify-center">
              {user?.userType === "patient" ? (
                <div className="w-full max-w-lg">
                  <AssistantBubble
                    message={
                      assistantResponse?.message ??
                      "Hi! I'm the MedLink assistant. What kind of healthcare are you looking for today?"
                    }
                    suggestedProviders={assistantResponse?.suggestedProviders}
                    isLoading={assistantLoading}
                    onSelectProvider={(id) => setLocation(`/providers/${id}`)}
                  />
                  <div className="flex items-end gap-2 mt-4">
                    <textarea
                      className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[60px] resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder="Describe what you're looking for..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          if (!messageText.trim()) return;
                          const sentText = messageText.trim();
                          setMessageText("");
                          callAssistant(sentText);
                        }
                      }}
                    />
                    <Button
                      disabled={!messageText.trim() || assistantLoading}
                      className="bg-[hsl(207,90%,54%)] hover:bg-[hsl(207,90%,44%)]"
                      onClick={() => {
                        if (!messageText.trim()) return;
                        const sentText = messageText.trim();
                        setMessageText("");
                        callAssistant(sentText);
                      }}
                    >
                      Ask
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a conversation</h3>
                  <p className="text-gray-600">Choose a conversation from the list to start messaging</p>
                </div>
              )}
            </CardContent>
          ) : (
            <>
              {/* Message Header */}
              <CardHeader className="pb-3 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {selectedConversationData?.partnerName?.charAt(0) ?? "?"}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {selectedConversationData?.partnerName}
                      </h3>
                      <p className="text-sm text-gray-600">{selectedConversationData?.partnerRole || "Healthcare Provider"}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" data-testid="conversation-options">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="p-0 flex-1">
                <ScrollArea className="h-[400px] p-4">
                  {messagesLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-start space-x-2">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <Skeleton className="h-16 w-64 rounded-lg" />
                        </div>
                      ))}
                    </div>
                  ) : messageList.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-600">No messages in this conversation yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {uniqueMessages.map((message, index) => {
                        const isFromUser = message.senderId === user?.id;
                        const isLastMessage = index === uniqueMessages.length - 1;
                        
                        return (
                          <div
                            key={message.id}
                            className={`flex items-start space-x-2 ${isFromUser ? 'justify-end' : ''}`}
                            data-testid={`message-${message.id}`}
                          >
                            {!isFromUser && (
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                {selectedConversationData?.partnerName?.charAt(0) ?? "?"}
                              </div>
                            )}
                            <div className={`max-w-xs lg:max-w-md ${isFromUser ? 'order-1' : ''}`}>
                              <div className={`rounded-lg p-3 ${
                                isFromUser 
                                  ? 'bg-[hsl(207,90%,54%)] text-white' 
                                  : 'bg-gray-100 text-gray-900'
                              }`}>
                                <p className="text-sm">{message.content}</p>
                                {message.attachments && message.attachments.length > 0 && (
                                  <div className="mt-2 space-y-1">
                                    {message.attachments.map((attachment) => (
                                      <div key={attachment.id} className="flex items-center space-x-2 text-xs">
                                        <Paperclip className="h-3 w-3" />
                                        <span>{attachment.fileName}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <div className={`flex items-center mt-1 space-x-1 text-xs text-gray-500 ${
                                isFromUser ? 'justify-end' : ''
                              }`}>
                                <Clock className="h-3 w-3" />
                                <span>{new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                {isFromUser && (
                                  <>
                                    {message.isRead ? (
                                      <CheckCheck className="h-3 w-3 text-blue-500" />
                                    ) : (
                                      <Check className="h-3 w-3" />
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                            {isFromUser && (
                              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-sm font-semibold order-2">
                                <User className="h-4 w-4" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex items-end space-x-2">
                  <div className="flex-1">
                    <Textarea
                      placeholder="Type your message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      className="min-h-[60px] resize-none"
                      data-testid="message-input"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" data-testid="attach-file">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!messageText.trim() || sendMessageMutation.isPending}
                      className="bg-[hsl(207,90%,54%)] hover:bg-[hsl(207,90%,44%)]"
                      data-testid="send-message"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
