# 🔑 API Key Setup Guide

## 🎯 **Pre-Configured API Key for All Users**

Your chatbot now supports a **pre-configured API key** that's automatically available for all users without them needing to enter it!

## 🚀 **Quick Setup (Recommended)**

### **Step 1: Get Your OpenRouter API Key**
1. Go to [OpenRouter](https://openrouter.ai/keys)
2. Sign up/login to your account
3. Generate a new API key (starts with `sk-or-`)
4. Copy the key

### **Step 2: Configure the API Key**
Edit `src/config/chatbotConfig.js`:

```javascript
// API Configuration
api: {
  // Add your OpenRouter API key here
  preConfiguredKey: "sk-or-your-actual-api-key-here",
  
  // Other settings...
  allowUserOverride: true,  // Users can still use their own key if they want
  showApiKeySettings: true  // Show settings button to users
}
```

### **Step 3: Done!**
- ✅ All users can now use the chatbot immediately
- ✅ No need for users to enter API keys
- ✅ API key is securely masked in the UI
- ✅ Users can still override with their own key if needed

## 🔧 **Configuration Options**

### **Option 1: Pre-configured Key (Recommended)**
```javascript
preConfiguredKey: "sk-or-your-api-key-here"
```
- **Pros**: Users don't need to enter anything
- **Cons**: You pay for all usage
- **Best for**: Public websites, demos, company tools

### **Option 2: User-provided Keys**
```javascript
preConfiguredKey: ""  // Leave empty
```
- **Pros**: Users pay for their own usage
- **Cons**: Users must enter their own API key
- **Best for**: Personal projects, developer tools

### **Option 3: Environment Variable (Most Secure)**
```javascript
preConfiguredKey: process.env.REACT_APP_OPENROUTER_API_KEY || ""
```
- **Pros**: Key not visible in code
- **Cons**: Requires environment setup
- **Best for**: Production deployments

## 🛡️ **Security Features**

### **Built-in Protection**
- ✅ API keys are masked in UI (`sk-or-***-abcd`)
- ✅ No console logging of full keys
- ✅ Secure localStorage storage
- ✅ Password input fields
- ✅ Clear key functionality

### **User Override Options**
```javascript
allowUserOverride: true,    // Users can use their own key
showApiKeySettings: true    // Show settings to users
```

## 📊 **Usage Scenarios**

### **Scenario 1: Public Website**
```javascript
api: {
  preConfiguredKey: "sk-or-your-key",
  allowUserOverride: false,  // Don't allow overrides
  showApiKeySettings: false  // Hide settings
}
```
- All users share your API key
- You pay for all usage
- Users can't see or change the key

### **Scenario 2: Developer Tool**
```javascript
api: {
  preConfiguredKey: "",
  allowUserOverride: true,
  showApiKeySettings: true
}
```
- Users must provide their own keys
- Each user pays for their own usage
- Full control for users

### **Scenario 3: Hybrid Approach**
```javascript
api: {
  preConfiguredKey: "sk-or-your-key",
  allowUserOverride: true,
  showApiKeySettings: true
}
```
- Default key available for all users
- Users can override with their own key
- Best of both worlds

## 💰 **Cost Management**

### **Pre-configured Key**
- You pay for all API calls
- Monitor usage in OpenRouter dashboard
- Set up billing alerts
- Consider rate limiting

### **User-provided Keys**
- Users pay for their own usage
- No cost to you
- Users manage their own limits

## 🔍 **Monitoring Usage**

### **OpenRouter Dashboard**
1. Log into [OpenRouter](https://openrouter.ai/dashboard)
2. Check usage statistics
3. Monitor API calls
4. Set up alerts

### **Usage Tracking**
- Track requests per user
- Monitor response times
- Check error rates
- Set usage limits

## 🚨 **Troubleshooting**

### **Common Issues**

**"Invalid API key" error**
- Check if key starts with `sk-or-`
- Verify key is active in OpenRouter
- Ensure no extra spaces

**"Insufficient credits" error**
- Check your OpenRouter balance
- Add more credits if needed
- Monitor usage patterns

**"Rate limit exceeded" error**
- Implement rate limiting
- Add delays between requests
- Upgrade your plan if needed

### **Debug Steps**
1. Check browser console for errors
2. Verify API key format
3. Test key in OpenRouter dashboard
4. Check network requests

## 📝 **Example Configurations**

### **Production Website**
```javascript
api: {
  preConfiguredKey: process.env.REACT_APP_OPENROUTER_API_KEY,
  model: "deepseek/deepseek-chat-v3-0324",
  allowUserOverride: false,
  showApiKeySettings: false
}
```

### **Development/Testing**
```javascript
api: {
  preConfiguredKey: "sk-or-test-key-here",
  model: "deepseek/deepseek-chat-v3-0324",
  allowUserOverride: true,
  showApiKeySettings: true
}
```

### **Personal Project**
```javascript
api: {
  preConfiguredKey: "",
  model: "deepseek/deepseek-chat-v3-0324",
  allowUserOverride: true,
  showApiKeySettings: true
}
```

## 🎉 **Benefits of Pre-configured Keys**

1. **Instant Access**: Users can chat immediately
2. **No Setup Required**: No API key entry needed
3. **Better UX**: Seamless experience
4. **Centralized Control**: You manage the key
5. **Usage Monitoring**: Track all interactions
6. **Cost Control**: Manage your own spending

---

**Ready to set up?** Just add your OpenRouter API key to the config file and all users will have instant access to your chatbot! 🚀 