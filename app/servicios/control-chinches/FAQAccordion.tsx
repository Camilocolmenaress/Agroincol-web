'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQAccordionProps {
  faqs: Array<{ question: string; answer: string }>;
}

export default function FAQAccordion({ faqs }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="divide-y divide-brand-gray-light">
      {faqs.map((faq, index) => (
        <div key={index}>
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full flex items-center justify-between py-5 text-left"
          >
            <span className="font-heading font-semibold text-brand-black pr-4">{faq.question}</span>
            <ChevronDown
              size={20}
              className={`text-brand-orange shrink-0 transition-transform duration-200 ${
                openIndex === index ? 'rotate-180' : ''
              }`}
            />
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ${
              openIndex === index ? 'max-h-96 pb-5' : 'max-h-0'
            }`}
          >
            <p className="text-brand-gray text-body">{faq.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
