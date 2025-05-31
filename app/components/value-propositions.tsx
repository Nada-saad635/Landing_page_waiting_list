"use client"

import { Brain, Database, Users, Zap, Globe } from "lucide-react"

interface ValuePropositionsProps {
  language: "en" | "ar"
}

export function ValuePropositions({ language }: ValuePropositionsProps) {
  const content = {
    en: {
      title: "Why UAE Students Choose PastToPass",
      subtitle: "Transform your exam preparation with organized past papers and smart learning tools",
      features: [
        {
          icon: Database,
          title: "Organized Past Papers",
          description: "Sorted by subject and difficulty.",
        },
        {
          icon: Brain,
          title: "AI-Powered Practice",
          description: "Personalized question sets.",
        },
        {
          icon: Zap,
          title: "Interactive Learning",
          description: "Step-by-step hints and video explanations.",
        },
        {
          icon: Users,
          title: "Community Support",
          description: "Connect with fellow UAE students.",
        },
        {
          icon: Globe,
          title: "UAE-Focused Content",
          description: "Built specifically for UAE university curriculum.",
        },
      ],
    },
    ar: {
      title: "لماذا يختار طلاب الإمارات باست تو باس",
      subtitle: "حول تحضيرك للامتحانات بأوراق سابقة منظمة وأدوات تعلم ذكية",
      features: [
        {
          icon: Database,
          title: "أوراق سابقة منظمة",
          description: "مصنفة حسب الموضوع والصعوبة.",
        },
        {
          icon: Brain,
          title: "التدريب المدعوم بالذكاء الاصطناعي",
          description: "مجموعات أسئلة مخصصة.",
        },
        {
          icon: Zap,
          title: "التعلم التفاعلي",
          description: "تلميحات خطوة بخطوة وشروحات فيديو.",
        },
        {
          icon: Users,
          title: "دعم المجتمع",
          description: "تواصل مع زملائك طلاب الإمارات.",
        },
        {
          icon: Globe,
          title: "محتوى مركز على الإمارات",
          description: "مصمم خصيصاً لمناهج الجامعات الإماراتية.",
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
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 cursor-pointer"
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
