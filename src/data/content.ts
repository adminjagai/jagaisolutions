import { NavItem, Service, Benefit, Testimonial, FAQItem } from '../types';

export const navItems: NavItem[] = [
  { label: 'Home', href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'Benefits', href: '#benefits' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
];

export const services: Service[] = [
  {
    id: 1,
    title: 'AI Chat Agents',
    description: 'Intelligent conversational agents that provide 24/7 customer support, qualified lead generation, and personalized interactions.',
    icon: 'message-circle',
  },
  {
    id: 2,
    title: 'Lead Capture',
    description: 'Smart forms and AI-powered qualification systems that convert visitors into high-quality leads for your business.',
    icon: 'user-plus',
  },
  {
    id: 3,
    title: 'CRM Integration',
    description: 'Seamless integration with popular CRM platforms to automate data flow and enhance customer relationship management.',
    icon: 'database',
  },
  {
    id: 4,
    title: 'Custom Web & App Development',
    description: 'Tailored website and application development with AI capabilities built-in from the ground up.',
    icon: 'code',
  },
];

export const benefits: Benefit[] = [
  {
    id: 1,
    title: '24/7 Availability',
    description: 'Our AI agents are always online, providing round-the-clock support and lead capture for your business.',
    icon: 'clock',
  },
  {
    id: 2,
    title: 'Increased Conversion Rates',
    description: 'Smart lead qualification and personalized interactions lead to higher conversion rates and better ROI.',
    icon: 'trending-up',
  },
  {
    id: 3,
    title: 'Reduced Operational Costs',
    description: 'Automate repetitive tasks and support inquiries, allowing your team to focus on high-value activities.',
    icon: 'piggy-bank',
  },
  {
    id: 4,
    title: 'Data-Driven Insights',
    description: 'Gain valuable insights from customer interactions to continuously improve your products and services.',
    icon: 'bar-chart',
  },
  {
    id: 5,
    title: 'Scalable Solutions',
    description: 'Our AI solutions scale with your business, handling increasing volumes of interactions without additional resources.',
    icon: 'expand',
  },
  {
    id: 6,
    title: 'Seamless Integration',
    description: 'Easily integrate with your existing systems and workflows for a smooth transition to AI-powered operations.',
    icon: 'layers',
  },
];

export const testimonials: Testimonial[] = [
  {
    id: 1,
    quote: "JAG AI Solutions transformed our customer service operations. Their AI chat agents handle over 80% of our support inquiries, resulting in faster response times and happier customers.",
    author: "Sarah Johnson",
    role: "Customer Success Manager",
    company: "TechNova Inc.",
    avatarUrl: "https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=150",
  },
  {
    id: 2,
    quote: "Implementing JAG's lead capture system increased our qualified leads by 43% in the first month. The integration with our CRM was seamless and the insights we've gained are invaluable.",
    author: "Michael Chen",
    role: "Marketing Director",
    company: "GrowthForge",
    avatarUrl: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150",
  },
  {
    id: 3,
    quote: "The custom web application JAG built for us has revolutionized how we interact with our clients. The AI-powered features have set us apart from competitors and significantly improved user engagement.",
    author: "Alexandra Rivera",
    role: "CTO",
    company: "InnovateSphere",
    avatarUrl: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150",
  },
];

export const faqItems: FAQItem[] = [
  {
    id: 1,
    question: "How long does it take to implement an AI chat agent?",
    answer: "Implementation typically takes 2-4 weeks, depending on the complexity of your requirements and the level of customization needed. Our team works closely with you to ensure a smooth and efficient deployment process.",
  },
  {
    id: 2,
    question: "Can your AI solutions integrate with my existing CRM?",
    answer: "Yes, our solutions are designed to integrate seamlessly with popular CRM platforms including Salesforce, HubSpot, Zoho, and many others. We also offer custom integration services for proprietary systems.",
  },
  {
    id: 3,
    question: "How do you ensure the AI agents represent our brand appropriately?",
    answer: "We conduct thorough brand immersion sessions to understand your voice, tone, and values. Our AI agents are extensively trained on your specific guidelines, and we provide continuous refinement based on feedback and performance analysis.",
  },
  {
    id: 4,
    question: "What kind of ROI can I expect from implementing your solutions?",
    answer: "Clients typically see ROI within 3-6 months of implementation. This includes cost savings from automated support, increased conversion rates from better lead qualification, and revenue growth from improved customer experiences. We provide detailed analytics to track performance and ROI.",
  },
  {
    id: 5,
    question: "Do you offer ongoing support and maintenance?",
    answer: "Absolutely. We offer various support packages that include regular updates, performance optimization, and continuous improvement of your AI solutions. Our team is always available to address any issues or implement new features as your business evolves.",
  },
];