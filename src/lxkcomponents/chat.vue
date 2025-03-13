<template>
  <div>
    <h1>Chat Room</h1>
    <div v-if="!userId">
      <input
        v-model="tempUserId"
        placeholder="Enter your unique ID"
        @keyup.enter="setUserId"
      />
      <button @click="setUserId">Join Chat</button>
      <p v-if="error" class="error">{{ error }}</p>
    </div>
    <div v-else>
      <div class="chat-window">
        <div
          v-for="(msg, index) in messages"
          :key="index"
          :class="['message', msg.sender === userId ? 'own-message' : 'other-message']"
        >
          <strong>{{ msg.sender }}</strong>:
          <span v-if="msg.messageType === 'text'">{{ msg.text }}</span>
          <img v-if="msg.messageType === 'image'" :src="msg.text" alt="Image" class="chat-image" />
          <span v-if="msg.messageType === 'emoji'">{{ msg.text }}</span>
          <!-- <span>{{ msg.text }}</span> -->
        </div>
      </div>
      <div class="chat-input">
        <input
          v-model="message"
          @keyup.enter="sendMessage"
          placeholder="Type your message..."
          :disabled="!isConnected"
        />
        <button @click="toggleEmojiPicker">😀</button>
        <input
          type="file"
          accept="image/*"
          @change="handleImageUpload"
          id="fileInput"
          style="display: none"
        />
        <button @click="triggerFileInput">📷</button>
      </div>
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
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const message = ref('');
const messages = ref([]);
const ws = ref(null);
const userId = ref('');
const tempUserId = ref('');
const isConnected = ref(false);
const error = ref('');
const showEmojiPicker = ref(false);
const emojis = ref(['😀', '😎', '❤️', '👍', '🔥']);

const setUserId = () => {
  if (tempUserId.value.trim()) {
    userId.value = tempUserId.value;
    initWebSocket();
  } else {
    error.value = 'Please enter a valid ID.';
  }
};

const initWebSocket = () => {
  
  ws.value = new WebSocket('ws://localhost:8080');

  ws.value.onopen = () => {
    console.log('WebSocket connected'); // 确认连接
    isConnected.value = true;
    error.value = '';

    // 发送用户ID到后端
    ws.value.send(JSON.stringify({ type: 'set-user-id', userId: userId.value }));
  };

  ws.value.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.type === 'history') {
      if (Array.isArray(data.messages) && data.messages.length > 0) {
        messages.value = [...data.messages];
    } else {
      console.error('History messages is not an array:', data.messages);
    }
    } else if (data.type === 'message') {
      messages.value.push(data);
    }
  };

  ws.value.onclose = () => {
    isConnected.value = false;
    error.value = 'Connection closed. Please refresh the page.';
  };

  ws.value.onerror = (err) => {
    console.error('WebSocket error:', err); // 打印错误日志
    isConnected.value = false;
    error.value = 'WebSocket error. Please check your connection.';
  };
};

const sendMessage = () => {
  if (message.value.trim() && isConnected.value) {
    try {
      ws.value.send(JSON.stringify({
        type: 'message',
        text: message.value,
        sender: userId.value,
        messageType: 'text',
      }));
      message.value = '';
    } catch (err) {
      console.error('Failed to send message:', err); // 打印错误日志
      error.value = 'Failed to send message.';
    }
  }
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target.result;
      ws.value.send(JSON.stringify({
        type: 'message',
        text: imageData,
        sender: userId.value,
        messageType: 'image',
      }));
    };
    reader.readAsDataURL(file);
  }
};

const triggerFileInput = () => {
  document.getElementById('fileInput').click();
};

const toggleEmojiPicker = () => {
  showEmojiPicker.value = !showEmojiPicker.value;
};

const selectEmoji = (emoji) => {
  ws.value.send(JSON.stringify({
    type: 'message',
    text: emoji,
    sender: userId.value,
    messageType: 'emoji',
  }));
  showEmojiPicker.value = false;
};

onUnmounted(() => {
  if (ws.value) {
    ws.value.close();
  }
});

</script>

<style scoped>
.chat-window {
  border: 1px solid #ccc;
  height: 300px;
  overflow-y: scroll;
  padding: 10px;
  margin-bottom: 10px;
}

.message {
  margin-bottom: 10px;
  padding: 8px;
  border-radius: 8px;
}

.own-message {
  background-color: #d1e7dd;
  text-align: right;
  margin-left: 20%;
}

.other-message {
  background-color: #f8d7da;
  text-align: left;
  margin-right: 20%;
}

.chat-image {
  max-width: 200px;
  max-height: 200px;
  border-radius: 8px;
}

.chat-input {
  display: flex;
  gap: 10px;
}

.emoji-picker {
  display: flex;
  gap: 5px;
  margin-top: 10px;
}

.emoji {
  cursor: pointer;
  font-size: 20px;
}

.error {
  color: red;
}
</style>
