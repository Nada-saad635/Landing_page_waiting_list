"use client"

interface HeroSectionProps {
  language: "en" | "ar"
}

export function HeroSection({ language }: HeroSectionProps) {
  const content = {
    en: {
      headline: "Revolutionize Your Exam Preparation",
      subheadline:
        "Join thousands of UAE university students who are already acing their exams with EssayTest's smart learning platform",
      description:
        "Students across the Emirates are discovering a smarter way to study. Get personalized practice questions, access past exam banks, and learn with your peers.",
      cta: "Join the Waitlist - Be Among the First",
      secondaryCta: "Learn More About Our Mission",
    },
    ar: {
      headline: "ثورة في تحضير الامتحانات",
      subheadline: "انضم إلى آلاف طلاب الجامعات الإماراتية الذين يتفوقون في امتحاناتهم باستخدام منصة إيساي تست الذكية",
      description:
        "يكتشف الطلاب في جميع أنحاء الإمارات طريقة أذكى للدراسة. احصل على أسئلة تدريب مخصصة، وادخل إلى بنوك الأسئلة السابقة، وتعلم مع زملائك.",
      cta: "انضم إلى قائمة الانتظار - كن من الأوائل",
      secondaryCta: "تعرف على مهمتنا",
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
