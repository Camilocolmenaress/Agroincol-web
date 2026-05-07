'use client';

import { useState, useEffect } from 'react';

export default function LazyMap() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="mt-10 rounded-xl overflow-hidden shadow-sm bg-gray-100" style={{ height: 300 }}>
      {show && (
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.533050839392!2d-73.088757224765!3d7.064019492938516!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e683f1b468e8eff%3A0x48e4d9481746a1df!2sAGROINCOL!5e0!3m2!1sen!2sco!4v1776444477179!5m2!1sen!2sco"
          width="100%"
          height="300"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="AGROINCOL en Google Maps"
        />
      )}
    </div>
  );
}
