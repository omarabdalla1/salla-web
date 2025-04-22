// ✅ ملف: index.js
const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const { Configuration, OpenAIApi } = require("openai");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(bodyParser.json());

const ordersFile = "orders.json";
if (!fs.existsSync(ordersFile)) fs.writeFileSync(ordersFile, "[]");

// 🔐 إعداد OpenAI API
const configuration = new Configuration({
  apiKey: "sk-ضع_مفتاحك_هنا"
});
const openai = new OpenAIApi(configuration);

// 📩 استقبال Webhook من سلة
app.post("/webhook", (req, res) => {
  const event = req.body.event;
  const data = req.body.data;

  if (event === "invoice.created") {
    const order = {
      order_id: data.order_id,
      product_name: data.items[0].name,
      total: data.total.amount,
      phone: `+966${data.customer.mobile}`,
      email: data.customer.email,
      status: "تم إنشاء الطلب",
      date: data.date
    };

    const orders = JSON.parse(fs.readFileSync(ordersFile));
    orders.push(order);
    fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));

    console.log("✅ تم حفظ الطلب بنجاح", order);
  }

  res.sendStatus(200);
});

// 🤖 Endpoint للرد الذكي
app.post("/chat", async (req, res) => {
  const { message, phone } = req.body;
  const orders = JSON.parse(fs.readFileSync(ordersFile));
  const lastOrder = orders.reverse().find(o => o.phone === phone);

  let reply = "لم أتمكن من العثور على طلب مرتبط بهذا الرقم.";

  if (lastOrder) {
    reply = `طلبك رقم ${lastOrder.order_id} في حالة: ${lastOrder.status}. المنتج: ${lastOrder.product_name} بمبلغ ${lastOrder.total} ريال.`;
  }

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "أنت مساعد ذكي تخبر العميل بحالة طلبه بناءً على البيانات القادمة من النظام." },
      { role: "user", content: message },
      { role: "assistant", content: reply }
    ]
  });

  const aiReply = completion.data.choices[0].message.content;
  res.json({ reply: aiReply });
});

app.listen(PORT, () => {
  console.log(`🚀 السيرفر شغال على المنفذ ${PORT}`);
});
