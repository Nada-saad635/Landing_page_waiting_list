"use client"
import { Mail, Phone, MapPin } from "lucide-react"

interface FooterProps {
  language: "en" | "ar"
}

export function Footer({ language }: FooterProps) {
  const content = {
    en: {
      tagline: "Empowering UAE students to achieve academic excellence",
      contact: "Contact Us",
      email: "nadasaad635@gmail.com",
      phone: "+971503012964",
      address: "Abu Dhabi, UAE",
      followUs: "Follow Us",
      copyright: "© 2024 EssayTest. All rights reserved.",
      madeWith: "Made with ❤️ for UAE students",
    },
    ar: {
      tagline: "تمكين طلاب الإمارات لتحقيق التميز الأكاديمي",
      contact: "اتصل بنا",
      email: "nadasaad635@gmail.com",
      phone: "+971503012964",
      address: "أبو ظبي، الإمارات العربية المتحدة",
      followUs: "تابعنا",
      copyright: "© 2024 إيساي تست. جميع الحقوق محفوظة.",
      madeWith: "صنع بـ ❤️ لطلاب الإمارات",
    },
  }

  return (
    <footer className="bg-black/20 backdrop-blur-sm border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 ${language === "ar" ? "text-right" : "text-left"}`}>
          {/* Brand Section */}
          <div className="space-y-4">
            <div
              className={`flex items-center space-x-3 ${language === "ar" ? "flex-row-reverse space-x-reverse" : ""}`}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{language === "en" ? "EssayTest" : "إيساي تست"}</h3>
              </div>
            </div>
            <p className={`text-blue-200 leading-relaxed ${language === "ar" ? "font-arabic" : ""}`}>
              {content[language].tagline}
            </p>
          </div>

          {/* Contact Section */}
          <div className="space-y-4">
            <h4 className={`text-lg font-semibold text-white ${language === "ar" ? "font-arabic" : ""}`}>
              {content[language].contact}
            </h4>
            <div className="space-y-3">
              <div
                className={`flex items-center space-x-3 text-blue-200 ${language === "ar" ? "flex-row-reverse space-x-reverse" : ""}`}
              >
                <Mail className="w-4 h-4" />
                <span>{content[language].email}</span>
              </div>
              <div
                className={`flex items-center space-x-3 text-blue-200 ${language === "ar" ? "flex-row-reverse space-x-reverse" : ""}`}
              >
                <Phone className="w-4 h-4" />
                <span>{content[language].phone}</span>
              </div>
              <div
                className={`flex items-center space-x-3 text-blue-200 ${language === "ar" ? "flex-row-reverse space-x-reverse" : ""}`}
              >
                <MapPin className="w-4 h-4" />
                <span className={language === "ar" ? "font-arabic" : ""}>{content[language].address}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div
          className={`border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 ${language === "ar" ? "text-right" : "text-left"}`}
        >
          <p className={`text-blue-300 text-sm ${language === "ar" ? "font-arabic" : ""}`}>
            {content[language].copyright}
          </p>
          <p className={`text-blue-300 text-sm ${language === "ar" ? "font-arabic" : ""}`}>
            {content[language].madeWith}
          </p>
        </div>
      </div>
    </footer>
  )
}
