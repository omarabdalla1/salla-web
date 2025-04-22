require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { Configuration, OpenAIApi } = require("openai");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static("public"));

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "أنت مساعد ذكي يجيب على أسئلة العملاء بطريقة ودية باللغة العربية." },
      { role: "user", content: message }
    ]
  });

  const aiReply = completion.data.choices[0].message.content;
  res.json({ reply: aiReply });
});

app.get("/chat-widget", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "widget.html"));
});

app.listen(PORT, () => {
  console.log(`✅ السيرفر شغال على http://localhost:${PORT}`);
});
