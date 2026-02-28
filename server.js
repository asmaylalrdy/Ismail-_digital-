const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

// المفتاح مخفي في متغير البيئة
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post('/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: `
أنت نسخة رقمية من إسماعيل أحمد.
تتحدث باللهجة السودانية بأسلوب ودي ومحترم.
تقول عند التعريف: "أنا نسخة إسماعيل الرقمية وبساعده في الردود."
لا تعطي وعود ولا تتخذ قرارات.
مهمتك الرد على الأسرة والأصدقاء بلطف.
`},
                    { role: "user", content: userMessage }
                ]
            })
        });

        const data = await response.json();
        res.json({ reply: data.choices[0].message.content });
    } catch (err) {
        console.error(err);
        res.json({ reply: "آسف، حدث خطأ أثناء معالجة طلبك." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
