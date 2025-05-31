"use client"

interface HeroSectionProps {
  language: "en" | "ar"
}

export function HeroSection({ language }: HeroSectionProps) {
  const content = {
    en: {
      headline: "Transform Past Papers Into Future Success",
      subheadline: "Join thousands of students preparing smarter with curated questions from previous years",
      description:
        "Access organized past exam questions, get AI-powered practice, and connect with fellow UAE students. Turn yesterday's papers into tomorrow's success.",
    },
    ar: {
      headline: "حول الأوراق السابقة إلى نجاح مستقبلي",
      subheadline: "انضم إلى آلاف الطلاب الذين يستعدون بشكل أذكى مع أسئلة منسقة من السنوات السابقة",
      description:
        "احصل على أسئلة الامتحانات السابقة المنظمة، والتدريب المدعوم بالذكاء الاصطناعي، وتواصل مع زملائك الطلاب الإماراتيين. حول أوراق الأمس إلى نجاح الغد.",
    },
  }

  return (
    <section className={`text-center py-16 px-4 sm:px-6 lg:px-8 ${language === "ar" ? "text-right" : "text-left"}`}>
      <div className="max-w-4xl mx-auto">
        <h2
          className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-purple-200 leading-tight ${language === "ar" ? "font-arabic" : ""}`}
        >
          {content[language].headline}
        </h2>
        <p
          className={`text-xl sm:text-2xl mb-8 text-blue-100 leading-relaxed ${language === "ar" ? "font-arabic" : ""}`}
        >
          {content[language].subheadline}
        </p>
        <p
          className={`text-lg mb-12 text-blue-200 max-w-3xl mx-auto leading-relaxed ${language === "ar" ? "font-arabic" : ""}`}
        >
          {content[language].description}
        </p>
      </div>
    </section>
  )
}
