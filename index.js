const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// لتحليل JSON من سلة
app.use(express.json());

// صفحة اختبار
app.get('/', (req, res) => {
  res.send("✅ البوت شغال! جاهز يستقبل Webhooks من سلة.");
});

// مسار Webhook من سلة
app.post('/webhook', (req, res) => {
  const event = req.body;
  console.log("📦 Webhook من سلة:", JSON.stringify(event, null, 2));

  // هنا تقدر تضيف منطق إضافي، مثل إرسال واتساب أو الردود
  res.status(200).send("Webhook استلم بنجاح");
});

app.listen(PORT, () => {
  console.log(`🚀 السيرفر شغال على المنفذ ${PORT}`);
});
