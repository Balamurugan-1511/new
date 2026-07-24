'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CourseCard from '@/components/CourseCard';
const stats = [{
  value: '5,000+',
  label: 'Students Trained'
}, {
  value: '50+',
  label: 'Expert Instructors'
}, {
  value: '30+',
  label: 'AI & IT Courses'
}, {
  value: '95%',
  label: 'Placement Rate'
}];
const whyChooseUs = [{
  icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>,
  title: 'Industry Expert Trainers',
  description: 'Learn from AI practitioners with 10+ years of real-world experience at top tech companies.'
}, {
  icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>,
  title: 'Hands-On Projects',
  description: 'Build real AI projects and a portfolio that impresses employers from day one.'
}, {
  icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>,
  title: 'Career Placement Support',
  description: '95% placement rate with dedicated career counselling, resume reviews, and interview prep.'
}, {
  icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>,
  title: 'Flexible Learning',
  description: 'Online and in-person classes with weekend and evening batches to fit your schedule.'
}, {
  icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>,
  title: 'Globally Recognised Certs',
  description: 'Earn certifications recognised by top employers across Pune and across India.'
}, {
  icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>,
  title: 'Small Batch Sizes',
  description: 'Maximum 15 students per batch ensures personalised attention and better learning outcomes.'
}];

const testimonials = [{
  name: 'Aarav Deshmukh',
  role: 'Data Analyst, Pune',
  text: 'Skandaplus transformed my career. The instructor-led Machine Learning batch was incredibly practical — I landed a strong analytics role within 2 months of completing the program.',
  rating: 5,
  avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_11da40f54-1763293529528.png",
  avatarAlt: 'Aarav Deshmukh, Data Analyst in Pune, smiling professional headshot'
}, {
  name: 'Priya Nair',
  role: 'Software Engineer',
  text: 'I went self-paced because of my job timings. The Deep Learning course content is world-class — the pacing and project reviews still kept me honest and confident tackling complex AI problems.',
  rating: 5,
  avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1f4a1b099-1763299783605.png",
  avatarAlt: 'Priya Nair, Software Engineer, professional photo'
}, {
  name: 'Rohan Iyer',
  role: 'Product Analyst',
  text: 'The AI for Business Leaders course gave me exactly what I needed — a strategic understanding of AI without needing to code. Highly recommend for non-technical professionals.',
  rating: 5,
  avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_12672b149-1763294392419.png",
  avatarAlt: 'Rohan Iyer, Product Analyst, professional headshot'
}];

const faqs = [{
  q: 'Which is the best AI training institute in Pune?',
  a: 'SkandaPlus is Pune\'s premier AI training institute, offering practical, industry-aligned courses with expert instructors and strong placement support.'
}, {
  q: 'Do you offer job placement assistance?',
  a: 'Yes! We provide comprehensive career support including resume reviews, mock interviews, LinkedIn profile optimisation, and direct connections with our hiring partners across Pune.'
}, {
  q: 'What AI courses do you offer?',
  a: 'We offer 6 specialised AI courses: AI Fundamentals, Machine Learning Engineering, Deep Learning & Neural Networks, Generative AI & LLMs, AI for Business Leaders, and NLP & Conversational AI.'
}, {
  q: 'Can beginners join your AI courses?',
  a: 'Absolutely! Our AI Fundamentals course is designed for complete beginners. We also offer AI for Business Leaders for non-technical professionals. All you need is curiosity and commitment.'
}, {
  q: 'Are classes available online or in-person?',
  a: 'We offer both online and in-person classes at our Pune campus. Weekend and evening batches are available to accommodate working professionals.'
}];
export default function HomePage() {
  const [openFaq, setOpenFaq] = useState(0);

  // Used to be a hardcoded list of the original 6 courses — meaning any
  // course added later through Admin (e.g. a new QA or IT course) never
  // showed up on the homepage. Fetching live means new courses appear here
  // automatically, same as the nav dropdown.
  const [aiCourses, setAiCourses] = useState([]);
  useEffect(() => {
    fetch('/api/courses')
      .then(res => res.json())
      .then(data => {
        if (data?.success) {
          setAiCourses(
            data.courses.slice(0, 6).map(c => ({
              title: c.title,
              description: c.description || `Learn ${c.title} with hands-on, industry-aligned training.`,
              duration: c.duration,
              level: c.level,
              href: c.href || `/ai-courses/${c.slug}`,
            }))
          );
        }
      })
      .catch(() => {});
  }, []);
  return <div className="font-body text-bodyText">
      <Header />
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-50 via-blue-50 to-white overflow-hidden min-h-[560px] flex items-center">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-16 right-16 w-72 h-72 bg-accentBlue/8 rounded-full blur-3xl" />
          <div className="absolute bottom-8 left-8 w-56 h-56 bg-violet/8 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 py-16 lg:py-24 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative z-10">
              <span className="inline-block bg-accentBlue/10 text-accentBlue font-body font-semibold text-sm px-4 py-1.5 rounded-full mb-5">
                #1 AI Training Institute in Pune
              </span>
              <h1 className="font-heading font-semibold text-darkText text-4xl lg:text-5xl leading-tight mb-6">
                Premier AI & IT Training Institute in Pune for Career-Focused Professionals
              </h1>
              <p className="font-body text-bodyText text-lg leading-relaxed mb-8">
                Learn the most in-demand AI and technology skills with hands-on training, real-world projects, expert mentors, and placement support. Start your journey with Pune's top-rated AI training institute.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link href="/contact" className="inline-flex items-center gap-2 bg-accentBlue text-white font-body font-semibold px-7 py-4 rounded hover:bg-navy transition-colors duration-200">
                  Enroll Now
                </Link>
                <Link href="/ai-courses" className="inline-flex items-center gap-2 bg-white text-navy font-body font-semibold px-7 py-4 rounded border border-navy/20 hover:border-accentBlue hover:text-accentBlue transition-colors duration-200">
                  Explore Courses
                </Link>
              </div>
            </div>
            <div className="relative">
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=700&q=80" alt="Students learning AI and technology skills at SkandaPlus Pune training institute" className="w-full h-auto rounded-2xl shadow-xl" />
              
              <div className="absolute -top-5 -right-5 w-20 h-20 bg-navy rounded-full flex items-center justify-center shadow-lg z-10">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="absolute -bottom-4 -left-4 w-14 h-14 bg-accentBlue rounded-full flex items-center justify-center shadow-lg z-10">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Stats Bar */}
      <section className="bg-navy py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats?.map(stat => <div key={stat?.label} className="text-center">
                <div className="font-heading font-bold text-white text-3xl lg:text-4xl mb-1">{stat?.value}</div>
                <div className="font-body text-blue-200 text-sm">{stat?.label}</div>
              </div>)}
          </div>
        </div>
      </section>
      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div className="relative">
              <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=700&q=80" alt="SkandaPlus Pune AI training team and students in a modern classroom environment" className="w-full h-auto rounded-2xl shadow-xl" />
              
              <div className="absolute -bottom-6 -right-6 bg-accentBlue text-white p-5 rounded-xl shadow-lg">
                <div className="font-heading font-bold text-3xl">15+</div>
                <div className="font-body text-sm text-blue-100">Years in Pune</div>
              </div>
            </div>
            <div>
              <p className="font-body text-accentBlue font-semibold text-sm uppercase tracking-wider mb-2">About SkandaPlus</p>
              <h2 className="font-heading font-semibold text-navy text-3xl lg:text-4xl leading-tight mb-3">
                Your Trusted Partner In AI & Technology Career Success
              </h2>
              <div className="w-20 h-1 bg-yellow-400 rounded mb-6" />
              <p className="font-body text-bodyText text-base leading-relaxed mb-4">
                SkandaPlus is Pune's <strong className="text-navy">leading AI and IT training institute,</strong> dedicated to helping students and professionals build strong careers in the fast-growing technology industry. We have been empowering learners with industry-relevant skills, hands-on training, and the confidence they need to excel in today's competitive AI-driven world.
              </p>
              <p className="font-body text-bodyText text-base leading-relaxed mb-6">
                As one of Pune's most trusted training institutes, our goal is to bridge the skill gap by providing practical, job-oriented AI and IT courses that align with current industry demands. Our training approach combines real-time projects, expert mentorship, and personalised support to ensure every student is career-ready.
              </p>
              <Link href="/about" className="inline-flex items-center gap-2 bg-accentBlue text-white font-body font-semibold px-6 py-3 rounded hover:bg-navy transition-colors duration-200">
                Learn More About Us
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* AI Courses Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading font-semibold text-navy text-3xl lg:text-4xl mb-3">
              Top Trending{' '}
              <span className="text-accentBlue">AI Courses</span>
            </h2>
            <div className="w-20 h-1 bg-yellow-400 rounded mx-auto mb-4" />
            <p className="font-body text-bodyText text-base max-w-2xl mx-auto">
              Explore our industry-aligned AI courses designed to fast-track your career in Pune's booming tech sector.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {aiCourses?.map((course, i) => <CourseCard key={course?.href} {...course} index={i} />)}
          </div>
          <div className="text-center mt-10">
            <Link href="/ai-courses" className="inline-flex items-center gap-2 bg-accentBlue text-white font-body font-semibold px-8 py-4 rounded hover:bg-navy transition-colors duration-200">
              View All AI Courses
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
      {/* Learning Modes */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="font-body text-accentBlue font-semibold text-sm uppercase tracking-wider mb-2">How You Learn</p>
            <h2 className="font-heading font-semibold text-navy text-3xl lg:text-4xl mb-3">
              Two Paths, <span className="text-accentBlue">Same Rigor</span>
            </h2>
            <div className="w-20 h-1 bg-yellow-400 rounded mx-auto mb-4" />
            <p className="font-body text-bodyText text-base max-w-2xl mx-auto">
              Pick self-paced for full flexibility, or instructor-led for structure and live feedback. Switch anytime — the curriculum underneath is identical.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            <div className="bg-gray-50 rounded-xl p-8 hover:shadow-card transition-shadow duration-200">
              <div className="w-12 h-12 bg-accentBlue/10 rounded-lg flex items-center justify-center text-accentBlue font-heading font-bold text-sm mb-5">SP</div>
              <h3 className="font-heading font-semibold text-navy text-xl mb-3">Self-Paced</h3>
              <p className="font-body text-bodyText text-sm leading-relaxed mb-5">Recorded lectures, guided projects, and lifetime access. Learn on your schedule from anywhere.</p>
              <ul className="space-y-3">
                {['Learn anytime, no fixed timing', 'Hands-on notebooks & datasets', 'Community forum for doubts', 'Certificate on project submission']?.map(item => <li key={item} className="flex items-start gap-3 font-body text-bodyText text-sm">
                    <svg className="w-4 h-4 text-accentBlue mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                    {item}
                  </li>)}
              </ul>
            </div>
            <div className="bg-gray-50 rounded-xl p-8 border-2 border-accentBlue/20 hover:shadow-card transition-shadow duration-200">
              <div className="w-12 h-12 bg-yellow-400/20 rounded-lg flex items-center justify-center text-yellow-600 font-heading font-bold text-sm mb-5">IL</div>
              <h3 className="font-heading font-semibold text-navy text-xl mb-3">Instructor-Led</h3>
              <p className="font-body text-bodyText text-sm leading-relaxed mb-5">Live online cohorts with a mentor, batchmates, and weekly deadlines to keep you accountable.</p>
              <ul className="space-y-3">
                {['Live sessions with industry mentors', 'Cohort-based peer learning', '1:1 doubt-clearing & code reviews', 'Placement & interview support']?.map(item => <li key={item} className="flex items-start gap-3 font-body text-bodyText text-sm">
                    <svg className="w-4 h-4 text-accentBlue mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                    {item}
                  </li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>
      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <p className="font-body text-accentBlue font-semibold text-sm uppercase tracking-wider mb-2">Why SkandaPlus</p>
              <h2 className="font-heading font-semibold text-navy text-3xl lg:text-4xl leading-tight mb-3">
                Why SkandaPlus Is The Best AI Training Institute In Pune
              </h2>
              <div className="w-20 h-1 bg-yellow-400 rounded mb-6" />
              <p className="font-body text-bodyText text-base leading-relaxed mb-8">
                Choose SkandaPlus for a complete learning and career experience:
              </p>
              <ul className="space-y-3">
                {['Expert trainers with 10+ years AI industry experience', 'Comprehensive, practical training with real datasets', 'Real-time AI projects & hands-on labs', 'Affordable fees with flexible batch timings', 'Online + offline class options', '95% placement assistance', 'Modern AI learning environment', 'Personalised mentorship']?.map(item => <li key={item} className="flex items-start gap-3 font-body text-bodyText text-sm">
                    <svg className="w-5 h-5 text-accentBlue mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>)}
              </ul>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {whyChooseUs?.map(item => <div key={item?.title} className="bg-gray-50 rounded-xl p-5 hover:shadow-card transition-shadow duration-200">
                  <div className="w-12 h-12 bg-accentBlue/10 rounded-lg flex items-center justify-center text-accentBlue mb-4">
                    {item?.icon}
                  </div>
                  <h4 className="font-heading font-semibold text-navy text-sm mb-2">{item?.title}</h4>
                  <p className="font-body text-bodyText text-xs leading-relaxed">{item?.description}</p>
                </div>)}
            </div>
          </div>
        </div>
      </section>
      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading font-semibold text-navy text-3xl lg:text-4xl mb-3">
              Students{' '}
              <span className="text-accentBlue">Reviews</span>
            </h2>
            <div className="w-20 h-1 bg-yellow-400 rounded mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {testimonials?.map(t => <div key={t?.name} className="bg-white rounded-xl p-7 shadow-card hover:shadow-cardHover transition-shadow duration-200">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({
                length: t?.rating
              })?.map((_, i) => <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>)}
                </div>
                <p className="font-body text-bodyText text-sm leading-relaxed mb-5 italic">&ldquo;{t?.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <img src={t?.avatar} alt={t?.avatarAlt} className="w-11 h-11 rounded-full object-cover" />
                  <div>
                    <div className="font-heading font-semibold text-navy text-sm">{t?.name}</div>
                    <div className="font-body text-bodyText text-xs">{t?.role}</div>
                  </div>
                </div>
              </div>)}
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-violet rounded-xl2 p-14 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.3) 40px, rgba(255,255,255,0.3) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.3) 40px, rgba(255,255,255,0.3) 41px)'
          }} />
            <div className="relative z-10">
              <h2 className="font-heading font-bold text-white text-3xl lg:text-4xl mb-4">
                Start Your AI Career Today!
              </h2>
              <p className="font-body text-blue-100 text-base mb-8 max-w-2xl mx-auto">
                Join SkandaPlus – Pune's most trusted AI training institute offering career-focused courses with complete placement assistance.
              </p>
              <Link href="/ai-courses" className="inline-flex items-center gap-2 bg-white text-navy font-body font-semibold px-8 py-4 rounded hover:bg-blue-50 transition-colors duration-200">
                
                Explore Courses
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading font-semibold text-navy text-3xl lg:text-4xl mb-3">
              Students{' '}
              <span className="text-accentBlue">Frequently</span>{' '}Asked Question
            </h2>
            <div className="w-20 h-1 bg-yellow-400 rounded mx-auto" />
          </div>
          <div className="space-y-3">
            {faqs?.map((faq, i) => <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left">
                
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-violet/10 rounded flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-violet" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="font-body font-semibold text-navy text-sm">{i + 1}. {faq?.q}</span>
                  </div>
                  <svg className={`w-5 h-5 text-violet flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === i && <div className="px-5 pb-5">
                    <p className="font-body text-bodyText text-sm leading-relaxed pl-11">{faq?.a}</p>
                  </div>}
              </div>)}
          </div>
        </div>
      </section>
      <Footer />
    </div>;
}
