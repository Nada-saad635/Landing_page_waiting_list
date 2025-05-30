"use client"

interface TestimonialsProps {
  language: "en" | "ar"
}

export function Testimonials({ language }: TestimonialsProps) {
  const content = {
    en: {
      title: "What UAE Students Are Saying",
      subtitle: "Join thousands of students who are already transforming their study experience",
      testimonials: [
        {
          name: "Sarah Al-Mansouri",
          university: "American University of Sharjah",
          text: "Finally, a platform that understands the UAE education system! The bilingual support and local content make all the difference.",
          rating: 5,
        },
        {
          name: "Ahmed Hassan",
          university: "United Arab Emirates University",
          text: "The AI-powered practice questions are incredibly accurate. It's like having a personal tutor who knows exactly what I need to work on.",
          rating: 5,
        },
        {
          name: "Fatima Al-Zahra",
          university: "Zayed University",
          text: "I love how I can access questions from students across different UAE universities. The collaborative aspect is amazing!",
          rating: 5,
        },
      ],
    },
    ar: {
      title: "ما يقوله طلاب الإمارات",
      subtitle: "انضم إلى آلاف الطلاب الذين يحولون تجربة دراستهم بالفعل",
      testimonials: [
        {
          name: "سارة المنصوري",
          university: "الجامعة الأمريكية في الشارقة",
          text: "أخيراً، منصة تفهم نظام التعليم الإماراتي! الدعم ثنائي اللغة والمحتوى المحلي يحدث كل الفرق.",
          rating: 5,
        },
        {
          name: "أحمد حسن",
          university: "جامعة الإمارات العربية المتحدة",
          text: "أسئلة التدريب المدعومة بالذكاء الاصطناعي دقيقة بشكل لا يصدق. إنه مثل وجود مدرس خاص يعرف بالضبط ما أحتاج للعمل عليه.",
          rating: 5,
        },
        {
          name: "فاطمة الزهراء",
          university: "جامعة زايد",
          text: "أحب كيف يمكنني الوصول إلى أسئلة من طلاب عبر جامعات الإمارات المختلفة. الجانب التعاوني مذهل!",
          rating: 5,
        },
      ],
    },
  }

  return null
}
