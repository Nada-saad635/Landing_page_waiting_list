"use client"

import { Brain, Database, Users, Zap, Globe } from "lucide-react"

interface ValuePropositionsProps {
  language: "en" | "ar"
}

export function ValuePropositions({ language }: ValuePropositionsProps) {
  const content = {
    en: {
      title: "Why UAE Students Choose EssayTest",
      subtitle: "Built specifically for the unique needs of UAE university students",
      features: [
        {
          icon: Database,
          title: "Smart Question Bank",
          description:
            "Access thousands of past exam questions organized by subject, semester, and difficulty level from major UAE universities.",
        },
        {
          icon: Brain,
          title: "AI-Powered Practice",
          description:
            "Get personalized practice questions generated specifically for your learning style and weak areas using advanced AI.",
        },
        {
          icon: Zap,
          title: "Interactive Learning",
          description:
            "Step-by-step hints, video explanations, and progress tracking to accelerate your understanding and retention.",
        },
        {
          icon: Users,
          title: "Crowdsourced Content",
          description:
            "Contribute and access questions shared by fellow UAE university students, creating a collaborative learning environment.",
        },
        {
          icon: Globe,
          title: "Cultural Integration",
          description:
            "Built specifically for UAE students with local university alignment, bilingual support, and cultural understanding.",
        },
      ],
    },
    ar: {
      title: "لماذا يختار طلاب الإمارات إيساي تست",
      subtitle: "مصمم خصيصاً لتلبية الاحتياجات الفريدة لطلاب الجامعات الإماراتية",
      features: [
        {
          icon: Database,
          title: "بنك الأسئلة الذكي",
          description:
            "الوصول إلى آلاف أسئلة الامتحانات السابقة منظمة حسب المادة والفصل الدراسي ومستوى الصعوبة من الجامعات الإماراتية الرئيسية.",
        },
        {
          icon: Brain,
          title: "التدريب المدعوم بالذكاء الاصطناعي",
          description:
            "احصل على أسئلة تدريب مخصصة تم إنشاؤها خصيصاً لأسلوب تعلمك ونقاط ضعفك باستخدام الذكاء الاصطناعي المتقدم.",
        },
        {
          icon: Zap,
          title: "التعلم التفاعلي",
          description: "تلميحات خطوة بخطوة وشروحات فيديو وتتبع التقدم لتسريع فهمك واستيعابك.",
        },
        {
          icon: Users,
          title: "المحتوى التشاركي",
          description: "ساهم واحصل على أسئلة مشتركة من زملائك طلاب الجامعات الإماراتية، مما يخلق بيئة تعلم تعاونية.",
        },
        {
          icon: Globe,
          title: "التكامل الثقافي",
          description: "مصمم خصيصاً لطلاب الإمارات مع التوافق مع الجامعات المحلية والدعم ثنائي اللغة والفهم الثقافي.",
        },
      ],
    },
  }

  return (
    <section className={`py-20 px-4 sm:px-6 lg:px-8 ${language === "ar" ? "text-right" : "text-left"}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h3 className={`text-3xl sm:text-4xl font-bold text-white mb-4 ${language === "ar" ? "font-arabic" : ""}`}>
            {content[language].title}
          </h3>
          <p className={`text-xl text-blue-200 max-w-3xl mx-auto ${language === "ar" ? "font-arabic" : ""}`}>
            {content[language].subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {content[language].features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105"
            >
              <div className={`flex items-center mb-6 ${language === "ar" ? "flex-row-reverse" : ""}`}>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h4 className={`text-xl font-semibold text-white ${language === "ar" ? "font-arabic" : ""}`}>
                  {feature.title}
                </h4>
              </div>
              <p className={`text-blue-200 leading-relaxed ${language === "ar" ? "font-arabic" : ""}`}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
