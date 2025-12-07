import { GoogleGenAI } from "@google/genai";
import { Sheep, Transaction, CalendarEvent } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeFarmStatus = async (
  sheep: Sheep[],
  transactions: Transaction[],
  events: CalendarEvent[]
): Promise<string> => {
  
  const totalSheep = sheep.length;
  const sickSheep = sheep.filter(s => s.status === 'sick' || s.status === 'treatment').length;
  
  const totalIncome = transactions
    .filter(t => t.type === 'sale')
    .reduce((acc, curr) => acc + curr.amount, 0);
    
  const totalExpenses = transactions
    .filter(t => t.type === 'expense' || t.type === 'purchase')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const pendingEvents = events.filter(e => !e.isCompleted).map(e => `${e.title} (${e.date})`).join(', ');

  const prompt = `
    أنت مستشار زراعي وبيطري خبير متخصص في الأغنام. قم بتحليل بيانات المزرعة التالية وقدم نصيحة مقتضبة وعملية للمزارع (باللغة العربية).
    
    البيانات:
    - عدد القطيع: ${totalSheep}
    - عدد الحالات المريضة/تحت العلاج: ${sickSheep}
    - إجمالي المبيعات: ${totalIncome} ريال
    - إجمالي المصروفات: ${totalExpenses} ريال
    - المهام القادمة: ${pendingEvents || 'لا يوجد مهام قادمة'}

    المطلوب:
    1. تقييم سريع للحالة الصحية للقطيع.
    2. نصيحة مالية بناءً على الدخل والمصروفات.
    3. تذكير بأهمية المهام القادمة (إن وجدت) أو اقتراح إجراء وقائي عام.
    
    اجعل الرد مشجعاً، بسيطاً، ومقسماً إلى نقاط واضحة. لا تزد عن 150 كلمة.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "عذراً، لم أتمكن من تحليل البيانات حالياً.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "حدث خطأ أثناء الاتصال بالمستشار الذكي. يرجى التحقق من الاتصال بالإنترنت.";
  }
};
