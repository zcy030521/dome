<template>
  <div class="chat-container">
    <!-- 顶部导航 -->
    <div class="nav">
      <div class="back-icon" @click="$router.push('/Service')">
        <van-icon name="arrow-left" />
      </div>
      <div class="title">AI 助手</div>
      <div class="more-icon">
        <van-icon name="ellipsis" />
      </div>
    </div>

    <!-- 聊天内容区域 -->
    <div class="chat-content" ref="chatContent">
      <div class="message-list">
        <!-- 欢迎消息 -->
        <div class="message ai-message">
          <div class="avatar ai-avatar">AI</div>
          <div class="bubble">
            <p>你好！我是你的AI助手，有什么可以帮你的吗？</p>
          </div>
        </div>

        <!-- 消息记录 -->
        <template v-for="(msg, index) in messages" :key="index">
          <!-- 用户消息 -->
          <div class="message user-message">
            <div class="bubble">
              <p>{{ msg.content }}</p>
            </div>
            <div class="avatar user-avatar">我</div>
          </div>

          <!-- AI思考动画 -->
          <div class="message ai-message" v-if="msg.isThinking">
            <div class="avatar ai-avatar">AI</div>
            <div class="bubble thinking">
              <span class="dot"></span>
              <span class="dot"></span>
              <span class="dot"></span>
            </div>
          </div>

          <!-- AI回复 -->
          <div class="message ai-message" v-if="msg.reply">
            <div class="avatar ai-avatar">AI</div>
            <div class="bubble">
              <p class="typing" v-if="msg.isTyping">{{ msg.reply }}</p>
              <p v-else>{{ msg.reply }}</p>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="input-area">
      <van-field
        v-model="userInput"
        type="textarea"
        placeholder="请输入消息..."
        rows="1"
        autosize
        ref="inputField"
        @keydown="handleKeydown"
      />
      <van-button 
        type="primary" 
        size="small" 
        :disabled="!canSend"
        @click="handleSend"
      >{{ buttonText }}</van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import { getChatResponse } from '../deepseekAI/DeepSeekService';

interface Message {
  id: string;
  content: string;
  reply: string;
  isTyping: boolean;
  isThinking: boolean;
}

// 状态管理
const userInput = ref('');
const messages = ref<Message[]>([]);
const chatContent = ref<HTMLElement | null>(null);
const inputField = ref(null);
const isProcessing = ref(false);

// 计算属性
const canSend = computed(() => userInput.value.trim() !== '' && !isProcessing.value);
const buttonText = computed(() => isProcessing.value ? '发送中...' : '发送');

// 生成唯一ID
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

// 键盘事件处理
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    if (canSend.value) {
      handleSend();
    }
  }
};

// 消息发送处理
const handleSend = async () => {
  if (!canSend.value) return;
  
  const messageContent = userInput.value.trim();
  userInput.value = '';
  
  await sendMessage(messageContent);
  
  // 重新聚焦到输入框
  await nextTick();
  (inputField.value as any)?.focus();
};

// 消息处理核心逻辑
const sendMessage = async (content: string) => {
  isProcessing.value = true;
  
  const newMessage: Message = {
    id: generateId(),
    content,
    reply: '',
    isTyping: false,
    isThinking: true,
  };
  
  messages.value.push(newMessage);
  await scrollToBottom();

  try {
    await processAIResponse(newMessage);
  } finally {
    isProcessing.value = false;
  }
};

// AI响应处理
const processAIResponse = async (message: Message) => {
  try {
    message.isThinking = true;
    await getChatResponse(message.content, (chunk: string) => {
      message.isThinking = false;
      appendResponse(message, chunk);
    });
  } catch (error) {
    handleError(message, error);
  }
};

// 响应追加处理
const appendResponse = (message: Message, chunk: string) => {
  if (!message.reply) {
    message.reply = '';
  }
  message.reply += chunk;
  message.isTyping = true;
  scrollToBottom();
};

// 错误处理
const handleError = (message: Message, error: any) => {
  message.isThinking = false;
  message.reply = '抱歉，出现了一些错误，请稍后再试。';
  console.error('Error in AI response:', error);
};

// 滚动处理
const scrollToBottom = async () => {
  await nextTick();
  if (chatContent.value) {
    chatContent.value.scrollTop = chatContent.value.scrollHeight;
  }
};

onMounted(() => {
  scrollToBottom();
});
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f7f7f7;
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #fff;
  position: sticky;
  top: 0;
  z-index: 100;
}

.title {
  font-size: 16px;
  font-weight: 500;
}

.chat-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
  animation: fadeIn 0.3s ease;
}

.user-message {
  flex-direction: row-reverse;
}

.avatar {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.ai-avatar {
  background: #f5f5f5;
  color: #333;
  border: 1px solid #e0e0e0;
}

.user-avatar {
  background: #007AFF;
  color: white;
  border: 1px solid #0066d6;
}

.bubble {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 16px;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  word-break: break-word;
}

.user-message .bubble {
  background: #007AFF;
  color: white;
}

.typing::after {
  content: '|';
  animation: blink 1s infinite;
}

.input-area {
  padding: 12px 16px;
  background: white;
  border-top: 1px solid #eee;
  display: flex;
  gap: 8px;
  align-items: flex-end;
}

.input-area :deep(.van-field) {
  flex: 1;
  background: #f5f5f5;
  border-radius: 20px;
  padding: 8px 16px;
}

.input-area :deep(.van-field__control) {
  min-height: 20px;
  max-height: 100px;
  resize: none; /* 禁用手动调整大小 */
  line-height: 1.5;
  padding: 8px 0;
}

.input-area :deep(.van-button) {
  height: 36px;
  padding: 0 16px;
  border-radius: 18px;
  font-size: 14px;
}

/* 禁用状态样式 */
.input-area :deep(.van-button--disabled) {
  opacity: 0.6;
  cursor: not-allowed;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes blink {
  from, to {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .bubble {
    max-width: 85%;
  }
}

.thinking {
  padding: 16px 20px;
  min-width: 60px;
}

.dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #999;
  margin: 0 2px;
  animation: bounce 1.4s infinite ease-in-out;
}

.dot:nth-child(1) {
  animation-delay: -0.32s;
}

.dot:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes bounce {
  0%, 80%, 100% { 
    transform: scale(0);
  } 
  40% { 
    transform: scale(1.0);
  }
}
</style>