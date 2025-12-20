interface WebSocketMessage {
  type: string;
  room_id?: number;
  data?: any;
  message_id?: number;
  message?: string;
  token?: string;
  userId?: number;
}

interface WebSocketEventMap {
  connected: (data: any) => void;
  disconnected: (data: { code: number; reason: string }) => void;
  error: (error: any) => void;
  message: (data: WebSocketMessage) => void;
  chat_message: (data: WebSocketMessage) => void;
  message_reaction: (data: WebSocketMessage) => void;
  message_viewed: (data: WebSocketMessage) => void;
  connection_established: (data: any) => void;
  authentication_failed: (data: any) => void;
  authentication_success: (data: any) => void;
}

class WebSocketManager {
  private static instance: WebSocketManager;
  private socket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 5;
  private readonly reconnectDelay = 1000;
  private pingInterval: number | null = null;
  private reconnectTimeout: number | null = null;
  private isManualDisconnect = false;
  private eventHandlers: Map<keyof WebSocketEventMap, Function[]> = new Map();
  private currentUserId: number | null = null;

  private constructor() {}

  public static getInstance(): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager();
    }
    return WebSocketManager.instance;
  }

  public on<K extends keyof WebSocketEventMap>(
    event: K,
    handler: WebSocketEventMap[K]
  ): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)!.push(handler);
  }

  public off<K extends keyof WebSocketEventMap>(
    event: K,
    handler: WebSocketEventMap[K]
  ): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  private emit<K extends keyof WebSocketEventMap>(event: K, data: any): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(data);
        } catch (error) {
          console.error(`Error in WebSocket handler for ${event}:`, error);
        }
      });
    }
  }

  public connect(userId?: number): void {
    this.cleanupTimers();
    this.isManualDisconnect = false;
    if (userId !== undefined) {
      this.currentUserId = userId;
    }

    if (this.currentUserId === null) {
      const storedUserId = localStorage.getItem('userId');
      if (storedUserId) {
        this.currentUserId = parseInt(storedUserId, 10);
      } else {
        console.error('User ID is not available for WebSocket connection');
        this.emit('error', new Error('User ID is not available'));
        return;
      }
    }

    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }

    const ws_protocol =
      window.location.protocol === 'https:' ? 'wss://' : 'ws://';

    let ws_host = window.location.host;
    let ws_port = null;

    if (
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.port === '8000'
    ) {
      ws_port = 8000;
    }

    let url;
    if (ws_port) {
      url = `${ws_protocol}${window.location.hostname}:${ws_port}/socket-server/${this.currentUserId}/`;
    } else {
      url = `${ws_protocol}${ws_host}/socket-server/${this.currentUserId}/`;
    }

    console.log('Connecting to WebSocket:', url);

    try {
      this.socket = new WebSocket(url);

      this.socket.onopen = (e: Event): void => {
        console.log('WebSocket connection established successfully');
        this.reconnectAttempts = 0;
        // this.startPingInterval();
        this.emit('connected', {});
      };

      this.socket.onmessage = (e: MessageEvent): void => {
        this.handleMessage(e);
      };

      this.socket.onclose = (e: CloseEvent): void => {
        console.log(
          `WebSocket connection closed. Code: ${e.code}, Reason: ${e.reason}`
        );

        this.cleanupTimers();
        this.emit('disconnected', { code: e.code, reason: e.reason });

        if (this.isManualDisconnect) {
          console.log('Manual disconnect, no reconnection');
          return;
        }

        if (e.code === 1000 || e.code === 1001) {
          console.log('WebSocket closed normally, no reconnection needed');
          return;
        }

        this.attemptReconnection();
      };

      this.socket.onerror = (err: Event): void => {
        console.error('WebSocket error:', err);
        this.emit('error', err);
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.emit('error', error);
    }
  }

  private handleMessage(e: MessageEvent): void {
    try {
      const data: WebSocketMessage = JSON.parse(e.data);

      this.emit('message', data);

      if (data.type === 'connection_established') {
        console.log('WebSocket connection confirmed', data);
        this.emit('connection_established', data);
        return;
      }

      if (data.type === 'pong') {
        console.log('WebSocket ping-pong successful');
        return;
      }

      if (data.type === 'error') {
        console.error('WebSocket error:', data.message);
        this.emit('error', data);
        return;
      }

      if (data.type === 'authentication_failed') {
        console.error('WebSocket authentication failed');
        this.emit('authentication_failed', data);
        return;
      }

      if (data.type === 'authentication_success') {
        console.log('WebSocket authentication successful');
        this.emit('authentication_success', data);
        return;
      }

      if (
        data.type === 'chat_message' &&
        data.data &&
        data.room_id !== undefined
      ) {
        console.log('WebSocket message received:', data);

        this.emit('chat_message', data);
      }

      if (data.type === 'message_reaction' && data.message_id) {
        this.emit('message_reaction', data);
      }

      if (data.type === 'message_viewed' && data.message_id) {
        this.emit('message_viewed', data);
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
      this.emit('error', error);
    }
  }

  private handleChatMessage(data: WebSocketMessage): void {
    if (!data.room_id || !data.data) return;

    console.log('New chat message:', data);

    const event = new CustomEvent('newChatMessage', {
      detail: {
        roomId: data.room_id,
        message: data.data,
      },
    });
    window.dispatchEvent(event);
  }

  private attemptReconnection(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts);
      console.log(
        `Reconnecting in ${delay}ms... (Attempt ${this.reconnectAttempts + 1}/${
          this.maxReconnectAttempts
        })`
      );

      this.reconnectTimeout = window.setTimeout(() => {
        this.reconnectAttempts++;
        this.connect();
      }, delay);
    } else {
      console.error('Max reconnection attempts reached');
      this.emit('error', new Error('Max reconnection attempts reached'));
    }
  }

  private cleanupTimers(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }

  private startPingInterval(): void {
    this.cleanupTimers();

    this.sendPing();

    this.pingInterval = window.setInterval(() => {
      this.sendPing();
    }, 30000);
  }

  private sendPing(): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type: 'ping' }));
      console.log('Ping sent');
    }
  }

  public sendMessage(message: WebSocketMessage): boolean {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
      return true;
    } else {
      console.error(
        'WebSocket is not connected. Current state:',
        this.socket?.readyState
      );
      return false;
    }
  }

  public sendChatMessage(roomId: number, message: string): boolean {
    return this.sendMessage({
      type: 'chat_message',
      room_id: roomId,
      data: {
        value: message,
      },
    });
  }

  public sendMessageReaction(messageId: number, reaction: any): boolean {
    return this.sendMessage({
      type: 'message_reaction',
      message_id: messageId,
      data: reaction,
    });
  }

  public sendMessageViewed(messageId: number): boolean {
    return this.sendMessage({
      type: 'message_viewed',
      message_id: messageId,
    });
  }

  public authenticate(token: string): boolean {
    return this.sendMessage({
      type: 'authenticate',
      token: token,
    });
  }

  public disconnect(): void {
    console.log('Manually disconnecting WebSocket');
    this.isManualDisconnect = true;
    this.cleanupTimers();

    if (this.socket) {
      this.socket.close(1000, 'Manual disconnect');
      this.socket = null;
    }

    this.emit('disconnected', { code: 1000, reason: 'Manual disconnect' });
  }

  public getConnectionState(): string {
    if (!this.socket) return 'CLOSED';

    switch (this.socket.readyState) {
      case WebSocket.CONNECTING:
        return 'CONNECTING';
      case WebSocket.OPEN:
        return 'OPEN';
      case WebSocket.CLOSING:
        return 'CLOSING';
      case WebSocket.CLOSED:
        return 'CLOSED';
      default:
        return 'UNKNOWN';
    }
  }

  public isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }

  public getCurrentToken(): string | null {
    return localStorage.getItem('authToken');
  }

  public getCurrentUserId(): number | null {
    return this.currentUserId;
  }

  public setUserId(userId: number): void {
    if (this.currentUserId !== userId) {
      this.currentUserId = userId;
      localStorage.setItem('userId', userId.toString());

      if (this.isConnected()) {
        this.disconnect();
      } else {
        this.connect();
      }
    }
  }

  public updateToken(newToken: string): void {
    localStorage.setItem('authToken', newToken);
    if (this.isConnected()) {
      this.disconnect();
    }
    this.connect();
  }

  public updateAuthData(userId: number, token: string): void {
    this.currentUserId = userId;
    localStorage.setItem('userId', userId.toString());
    localStorage.setItem('authToken', token);

    if (this.isConnected()) {
      this.disconnect();
    }
    this.connect();
  }
}

export const websocketManager = WebSocketManager.getInstance();
export type { WebSocketMessage };
