"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";

interface ContactProps {
  onClose?: () => void;
}

export default function Contact({ onClose }: ContactProps) {
  return (
    <motion.section
      className="py-16 bg-white dark:bg-gray-800"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Get In Touch
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Contact our office or visit us at our location
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="ml-4 p-2 border border-gray-300 rounded hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Office Address
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                Unit 9 Amir Building<br />
                18th Street & Tubman Blvd.<br />
                Sinkor, Monrovia, Liberia
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Phone Numbers
              </h3>
              <ul className="text-gray-600 dark:text-gray-300 space-y-2 text-base">
                <li>
                  <span className="font-medium">Clir. G. Moses Paegar:</span><br />
                  +231 777 511 760
                </li>
                <li>
                  <span className="font-medium">Clir. Albert S. Sims:</span><br />
                  +231 777 556 038
                </li>
                <li>
                  <span className="font-medium">Clir. Neto Zorzor Lighe, Sr.:</span><br />
                  +231 886 556 399
                </li>
                <li>
                  <span className="font-medium">Attorney Nyekeh Y. Forkpah:</span><br />
                  +231 880 690 750
                </li>
                <li>
                  <span className="font-medium">Administrator Sando J. Wilson:</span><br />
                  +231 886 660 469
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Email
              </h3>
              <a
                href="mailto:justice.advocates.partners@gmail.com"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-base"
              >
                justice.advocates.partners@gmail.com
              </a>
            </div>
          </motion.div>

          {/* Map Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative group"
          >
            {/* Glass Frame */}
            <div className="absolute -inset-1 bg-gradient-to-br from-white/40 to-white/0 dark:from-white/10 dark:to-transparent rounded-[2.6rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/20 dark:border-white/10 bg-white/5 backdrop-blur-2xl h-full min-h-[450px]">
              <iframe
                src="https://maps.google.com/maps?q=Amir%20Building,%2018th%20Street,%20Sinkor,%20Monrovia&t=&z=16&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                className="grayscale-[0.2] contrast-[1.1] brightness-[1.05] dark:invert-[0.9] dark:hue-rotate-[180deg] dark:contrast-[0.9] dark:brightness-[0.9]"
                style={{ border: 0, minHeight: "450px" }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>

              {/* Floating Address Label */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/80 dark:bg-black/60 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/20 dark:border-white/10 shadow-lg flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest text-blue-600 dark:text-blue-400 font-bold mb-0.5">Headquarters</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">Amir Building, Sinkor</span>
                  </div>
                  <a 
                    href="https://www.google.com/maps/dir/?api=1&destination=Amir+Building,Sinkor,Monrovia" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs bg-blue-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20"
                  >
                    Directions
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
