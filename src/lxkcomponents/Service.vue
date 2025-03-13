<template>
  <div class="chat-container">
    <!-- 顶部导航 -->
    <div class="nav">
      <div class="back-icon" @click="$router.push('/')">
        <van-icon name="arrow-left" />
      </div>
      <div class="title">聊天室</div>
      <div class="more-icon">
        <van-icon name="ellipsis" />
      </div>
    </div>

    <!-- 登录界面 -->
    <div v-if="!userId" class="login-container">
      <div class="login-box">
        <input
          v-model="tempUserId"
          placeholder="请输入用户名"
          @keyup.enter="setUserId"
          class="login-input"
        />
        <button @click="setUserId" class="login-btn">进入聊天</button>
        <p v-if="error" class="error">{{ error }}</p>
      </div>
    </div>

    <!-- 聊天界面 -->
    <div v-else class="chat-main">
      <div class="chat-window" ref="chatWindow">
        <div
          v-for="(msg, index) in messages"
          :key="index"
          :class="[
            'message-wrapper',
            msg.sender === userId ? 'own-message' : 'other-message',
          ]"
        >
          <!-- 头像 -->
          <div class="avatar" v-if="msg.sender !== userId">
            {{ msg.sender.charAt(0).toUpperCase() }}
          </div>

          <!-- 消息内容 -->
          <div class="message-content">
            <div class="sender-name" v-if="msg.sender !== userId">
              {{ msg.sender }}
            </div>
            <div class="message-bubble">
              <span v-if="msg.messageType === 'text'">{{ msg.text }}</span>
              <!-- <img
                v-if="msg.messageType === 'image'"
                :src="msg.text"
                alt="Image"
                class="chat-image"
              /> -->
              <el-image
               v-if="msg.messageType === 'image'"
      :src="msg.text"
      :zoom-rate="1.2"
      :max-scale="7"
      :min-scale="0.2"
      fit="cover"
      class="chat-image"
    />
              <span v-if="msg.messageType === 'emoji'" class="emoji-message">{{
                msg.text
              }}</span>
            </div>
          </div>

          <!-- 自己的头像 -->
          <div class="avatar own-avatar" v-if="msg.sender === userId">
            {{ userId.charAt(0).toUpperCase() }}
          </div>
        </div>
      </div>

      <!-- 底部输入区域 -->
      <div class="input-area">
        <div class="input-wrapper">
          <input
            v-model="message"
            @keyup.enter="sendMessage"
            placeholder="发送消息..."
            :disabled="!isConnected"
            class="message-input"
          />
          <div class="tools">
            <button class="tool-btn" @click="toggleEmojiPicker">😀</button>
            <button class="tool-btn" @click="triggerFileInput">📷</button>
            <button class="send-btn" @click="sendMessage">发送</button>
          </div>
        </div>

        <!-- 表情选择器 -->
        <div v-if="showEmojiPicker" class="emoji-picker">
          <span
            v-for="emoji in emojis"
            :key="emoji"
            @click="selectEmoji(emoji)"
            class="emoji"
          >
            {{ emoji }}
          </span>
        </div>

        <input
          type="file"
          accept="image/*"
          @change="handleImageUpload"
          id="fileInput"
          style="display: none"
        />
      </div>
    </div>
    <div>
      <van-floating-bubble axis="xy" icon="chat" magnetic="x"  @click="$router.push('/ai')"/>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from "vue";

const message = ref("");
const messages = ref([]);
const ws = ref(null);
const userId = ref("");
const tempUserId = ref("");
const isConnected = ref(false);
const error = ref("");
const showEmojiPicker = ref(false);
const emojis = ref([
  "😀",
  "😎",
  "❤️",
  "👍",
  "🔥",
  "😂",
  "😄",
  "😊",
  "😉",
  "😍",
  "😜",
  "😝",
  "😳",
  "😁",
  "😆",
  "😅",
  "🤣",
  "😇",
  "🥰",
  "😍",
  "😘",
  "😗",
  "😚",
  "😙",
  "😋",
  "😛",
  "😝",
  "😒",
  "😞",
  "😟",
  "😕",
  "🙁",
  "😣",
  "😖",
  "😫",
  "😩",
  "😤",
  "😠",
  "😡",
  "🤬",
  "😪",
  "😴",
  "😌",
  "😛",
  "😎",
  "🤓",
  "😇",
  "🥳",
  "🤩",
  "🥺",
  "😭",
  "😢",
  "😰",
  "😱",
  "😨",
  "😲",
  "🥶",
  "🥵",
  "😳",
  "😵",
  "😡",
  "😠",
  "🤬",
  "😷",
  "🤒",
  "🤕",
  "🤢",
  "🤮",
  "🤧",
  "😇",
  "🙏",
  "💪",
  "👍",
  "👎",
  "👌",
  "✌️",
  "👊",
  "✊",
  "🤚",
  "🖐️",
  "👋",
  "👏",
  "👐",
  "🙌",
  "🙏",
  "💪",
  "🤷",
  "💁",
  "🙅",
  "🙆",
  "🙋",
  "🧏",
  "🙇",
  "🙈",
  "🙉",
  "🙊",
  "💂",
  "👮",
  "👷",
  "💂‍♀️",
  "👩‍⚕️",
  "👨‍🍳",
  "👩‍🏫",
  "👨‍💻",
  "👨‍🔬",
  "👩‍🚒",
  "👨‍🚀",
  "👩‍🔧",
  "👷‍♀️",
  "👩‍🎤",
  "👨‍🎨",
  "👩‍💼",
  "👨‍🔬",
  "👨‍🎓",
  "👩‍🎓",
]);
const chatWindow = ref(null);

const setUserId = () => {
  if (tempUserId.value.trim()) {
    userId.value = tempUserId.value;
    initWebSocket();
  } else {
    error.value = "Please enter a valid ID.";
  }
};

const initWebSocket = () => {
  ws.value = new WebSocket("ws://localhost:8080");

  ws.value.onopen = () => {
    isConnected.value = true;
    error.value = "";

    // 发送用户ID到后端
    ws.value.send(
      JSON.stringify({ type: "set-user-id", userId: userId.value })
    );
  };

  ws.value.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.type === "history") {
      if (Array.isArray(data.messages) && data.messages.length > 0) {
        messages.value = [...data.messages];
        scrollToBottom();
      } else {
        console.error("History messages is not an array:", data.messages);
      }
    } else if (data.type === "message") {
      messages.value.push(data);
      scrollToBottom();
    }
  };

  ws.value.onclose = () => {
    isConnected.value = false;
    error.value = "Connection closed. Please refresh the page.";
  };

  ws.value.onerror = (err) => {
    console.error("WebSocket error:", err); // 打印错误日志
    isConnected.value = false;
    error.value = "WebSocket error. Please check your connection.";
  };
};

const scrollToBottom = async () => {
  await nextTick();
  if (chatWindow.value) {
    chatWindow.value.scrollTop = chatWindow.value.scrollHeight;
  }
};

const sendMessage = () => {
  if (message.value.trim() && isConnected.value) {
    console.log("Sending message:", message.value); // 确认发送消息
    try {
      ws.value.send(
        JSON.stringify({
          type: "message",
          text: message.value,
          sender: userId.value,
          messageType: "text",
        })
      );
      message.value = "";
      scrollToBottom();
    } catch (err) {
      console.error("Failed to send message:", err); // 打印错误日志
      error.value = "Failed to send message.";
    }
  }
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target.result;
      ws.value.send(
        JSON.stringify({
          type: "message",
          text: imageData,
          sender: userId.value,
          messageType: "image",
        })
      );
    };
    reader.readAsDataURL(file);
  }
};

const triggerFileInput = () => {
  document.getElementById("fileInput").click();
};

const toggleEmojiPicker = () => {
  showEmojiPicker.value = !showEmojiPicker.value;
};

const selectEmoji = (emoji) => {
  ws.value.send(
    JSON.stringify({
      type: "message",
      text: emoji,
      sender: userId.value,
      messageType: "emoji",
    })
  );
  showEmojiPicker.value = false;
};

onUnmounted(() => {
  if (ws.value) {
    ws.value.close();
  }
});
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f0f0f0;
  position: relative;
  overflow: hidden;
}

.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #f7f7f7;
  border-bottom: 1px solid #e5e5e5;
}

.title {
  font-size: 17px;
  font-weight: 500;
  color: #333;
}

.login-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-box {
  width: 100%;
  max-width: 300px;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.login-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 12px;
  font-size: 15px;
}

.login-btn {
  width: 100%;
  padding: 10px;
  background: #07c160;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 15px;
  cursor: pointer;
}

.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-top: 56px;
  margin-bottom: 120px;
  height: calc(100vh - 176px);
}

.chat-window {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #f0f0f0;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
}

.message-wrapper {
  display: flex;
  align-items: flex-start;
  margin-bottom: 16px;
  animation: fadeIn 0.3s ease;
  will-change: transform, opacity;
}

.own-message {
  flex-direction: row-reverse;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  background: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #fff;
  margin: 0 12px;
}

.own-avatar {
  background: #07c160;
}

.message-content {
  max-width: 60%;
}

.sender-name {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
  padding-left: 4px;
}

.message-bubble {
  padding: 10px 16px;
  background: #fff;
  border-radius: 4px;
  font-size: 15px;
  line-height: 1.4;
  word-break: break-word;
}

.own-message .message-bubble {
  background: #95ec69;
}

.chat-image {
  max-width: 200px;
  max-height: 200px;
  border-radius: 4px;
  display: block;
}

.emoji-message {
  font-size: 24px;
}

.input-area {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: #f7f7f7;
  border-top: 1px solid #e5e5e5;
  padding: 8px;
}

.input-wrapper {
  display: flex;
  align-items: flex-end;
  gap: 8px;
}

.message-input {
  flex: 1;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  background: #fff;
  font-size: 15px;
  line-height: 20px;
  max-height: 80px;
  resize: none;
}

.tools {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tool-btn {
  background: none;
  border: none;
  font-size: 20px;
  padding: 4px;
  cursor: pointer;
}

.send-btn {
  padding: 6px 16px;
  background: #07c160;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.emoji-picker {
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;
  background: #fff;
  padding: 12px;
  border-radius: 4px 4px 0 0;
  margin-top: 0;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  max-height: 200px;
  overflow-y: auto;
}

.emoji {
  font-size: 24px;
  cursor: pointer;
  text-align: center;
  padding: 4px;
  transition: transform 0.2s;
}

.emoji:hover {
  transform: scale(1.2);
}

.error {
  color: #ff4646;
  font-size: 14px;
  text-align: center;
  margin-top: 8px;
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

@media (max-width: 768px) {
  .chat-main {
    margin-top: 50px;
    margin-bottom: 100px;
    height: calc(100vh - 150px);
  }

  .input-area {
    padding: 6px;
  }

  .message-input {
    font-size: 14px;
    padding: 6px 10px;
  }
}

/* 优化滚动条样式 */
.chat-window::-webkit-scrollbar {
  width: 6px;
}

.chat-window::-webkit-scrollbar-track {
  background: transparent;
}

.chat-window::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}
.demo-image__error .image-slot {
  font-size: 30px;
}
.demo-image__error .image-slot .el-icon {
  font-size: 30px;
}
.demo-image__error .el-image {
  width: 100%;
  height: 200px;
}
</style>
