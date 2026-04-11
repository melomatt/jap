"use client";

import { motion } from "framer-motion";
import { useRef } from "react";

interface TeamMember {
  name: string;
  title: string;
  credentials: string;
  image: string | null;
  bio: string;
  education: string[];
}

const teamMembers: TeamMember[] = [
  {
    name: 'G. Moses Paegar, Esq',
    title: 'Senior Managing Partner',
    credentials: 'SCL (Senior Counsellor of Liberia)',
    image: '/paegar.jpeg',
    bio: 'Senior Managing Partner at Justice Advocates & Partners, Inc. with thirty (30) years of legal practice. Vast expertise in banking, finance, and commercial transactions. Former Managing Director of Liberia Electricity Corporation, current law professor at Louis Arthur Grimes School of Law, University of Liberia. Former President of the Liberian National Bar Association.',
    education: [
      'B.Sc. Business Administration (Magna Cum Laude) - Cuttington University',
      'M.Sc. Finance - The American University, Washington, D.C.',
      'LLB (Magna Cum Laude) - Louis Arthur Grimes School of Law, University of Liberia'
    ]
  },
  {
    name: 'Albert S. Sims',
    title: 'Senior Counsel & Head of Litigation',
    credentials: 'Twenty (20) years of legal practice',
    image: '/sims.jpeg',
    bio: 'Senior Counsel and Head of Litigation with expertise in real estate, property, and labour matters. Previously served as Assistant Legal Counsel at the Ministry of Finance, Staff Counsel at Kennedy Law Firm, and Senior Counsel at Sherman & Sherman, Inc.',
    education: [
      'BBA Accounting - College of Business and Public Administration, University of Liberia',
      'AA Rural Development - Cuttington University',
      'LLB - Louis Arthur Grimes School of Law, University of Liberia'
    ]
  },
  {
    name: 'Nyekeh Y. Forkpa',
    title: 'Attorney at Law',
    credentials: 'On leave of absence - Deputy Minister of Education for Administration',
    image: '/forkpah.JPEG',
    bio: 'Attorney Nyekeh Y. Forkpa is currently on a leave of absence and serves as Deputy Minister of Education for Administration at the Ministry of Education, Republic of Liberia. He has held various positions in public and private sectors in both Liberia and the United States of America. These positions include, inter alia, (i) Managing Editor of the News Newspaper, Monrovia, Liberia; (ii) Investment Accountant at the Metropolitan Life Insurance Company (Metlife) in Warwick, Rhode Island, USA; (iii) Analyst at the Citizens Bank, Providence, Rhode Island; (iv) Financial Consultant, Acting Deputy Managing Director for Administrator and later Deputy Managing Director for Administration at the National Port Authority (NPA) of Liberia.',
    education: [
      'B.Sc. Business & Public Administration (Accounting/Economics, 1989) - University of Liberia',
      'MBA (2006) - University of Rhode Island, Kingston, Rhode Island, USA',
      'LLB (Magna Cum Laude, 2023) - Louis Arthur Grimes School of Law, University of Liberia'
    ]
  },
  {
    name: 'Neto Zaza Lighe, Sr.',
    title: 'Associate Counsel',
    credentials: 'On leave of absence - Commissioner of Liberia Maritime Authority',
    image: '/neto.JPEG',
    bio: 'Associate Counsel with eleven (11) years of legal practice. Former Associate Legal Counsel at Sherman & Sherman. Extensive background in public and private sectors including positions as Deputy Minister for Manpower Planning & Human Resource Development, Assistant Minister for Administration, and Program Analyst.',
    education: [
      'BBA Accounting & Economics - University of Liberia',
      'LLM - University of Pennsylvania, Philadelphia, U.S.A.'
    ]
  },
  {
    name: 'Theresa Dieng-Bright',
    title: 'Staff Attorney',
    credentials: 'Specialist in Procurement & Fiduciary Services',
    image: '/theresa.jpeg',
    bio: 'Staff Attorney with strong background in economics and procurement. Graduate of Louis Arthur Grimes School of Law (2024). Holds multiple professional certifications including CIPS, World Bank Diploma in Public Procurement & Fiduciary. Demonstrates exceptional enthusiasm and expertise in both private and public sector legal practice.',
    education: [
      'B.Sc. Economics - African Methodist Episcopal University, Liberia (2013)',
      'LLB - Louis Arthur Grimes School of Law, University of Liberia (2024)',
      'CIPS, ACCA Candidate, World Bank & LIPA Certifications'
    ]
  }
];

export default function Team({ initialMembers, title, subtitle }: { initialMembers?: any[] | null, title?: string, subtitle?: string }) {
  // Use CMS data if provided and non-empty, otherwise fall back to the hardcoded team
  const members: TeamMember[] = (initialMembers && initialMembers.length > 0)
    ? initialMembers.map((m: any) => ({
      name: m.name || "",
      title: m.title || "",
      credentials: m.credentials || "",
      image: m.image || null,
      bio: m.bio || "",
      education: Array.isArray(m.education) ? m.education : (m.education ? [m.education] : []),
    }))
    : teamMembers;

  return (
    <motion.section
      id="team"
      className="py-20 bg-gray-50 dark:bg-gray-900 scroll-mt-24"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white uppercase">
            {title || "MEET THE ADVISORS"}
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            {subtitle || "Our team of experienced legal professionals"}
          </p>
        </div>

        {/* Team Members */}
        <div className="space-y-12">
          {members.map((lawyer, index) => (
            <TeamMemberCard key={index} member={lawyer} index={index} />
          ))}
        </div>
      </div>
    </motion.section>
  );
}

interface TeamMemberCardProps {
  member: TeamMember;
  index: number;
}

function TeamMemberCard({ member, index }: TeamMemberCardProps) {
  const containerRef = useRef(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: index * 0.1,
      },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6 },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, x: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { duration: 0.6, delay: 0.2 },
    },
  };

  return (
    <motion.div
      ref={containerRef}
      className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="grid md:grid-cols-2 gap-0">
        {/* Content Section - Left */}
        <motion.div
          className="p-8 md:p-12 flex flex-col justify-center"
          variants={contentVariants}
        >
          <div className="mb-6">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {member.name}
            </h3>
            <p className="text-xl text-blue-600 dark:text-blue-300 font-semibold mb-2">
              {member.title}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {member.credentials}
            </p>
          </div>

          <p className="text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
            {member.bio}
          </p>

          {/* Education */}
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-3">Education</h4>
            <ul className="space-y-2">
              {member.education.map((edu, idx) => (
                <li key={idx} className="flex items-start text-sm text-gray-700 dark:text-gray-300">
                  <span className="text-blue-600 mr-3 mt-0.5 flex-shrink-0">✓</span>
                  <span>{edu}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Image Section - Right */}
        <motion.div
          className="relative overflow-hidden bg-gray-100 dark:bg-gray-700 h-[28rem] md:h-full min-h-[28rem]"
          variants={imageVariants}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          {member.image ? (
            <motion.img
              src={member.image}
              alt={member.name}
              className="w-full h-full object-cover object-top"
              whileHover={{ scale: 1.15 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-8xl mb-4">⚖️</div>
                <p className="text-2xl font-semibold">{member.name.split(' ')[0]}</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
