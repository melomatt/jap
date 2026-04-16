import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useEffect } from "react";

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
      className="py-24 md:py-32 bg-[#F5F5F7] dark:bg-[#000000] scroll-mt-24"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        <div className="text-center mb-20">
          <span className="text-[10px] sm:text-xs font-bold tracking-[0.4em] text-blue-600 dark:text-blue-400 uppercase">
            {subtitle || "Our team of experienced legal professionals"}
          </span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
            {title || "Meet the Advisors"}
          </h2>
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
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Spotlight effect motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for the spotlight
  const spotlightX = useSpring(mouseX, { stiffness: 150, damping: 20 });
  const spotlightY = useSpring(mouseY, { stiffness: 150, damping: 20 });

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.21, 1.02, 0.73, 1] as any },
    },
  };

  return (
    <motion.div
      ref={cardRef}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      onMouseMove={handleMouseMove}
      whileHover={{ y: -8, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="group relative bg-white dark:bg-[#1C1C1E] rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-white/5 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_100px_-30px_rgba(0,0,0,0.15)] transition-shadow duration-700"
    >
      {/* Interactive Spotlight Overlay */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-30"
        style={{
          background: useTransform(
            [spotlightX, spotlightY],
            ([x, y]) => `radial-gradient(600px circle at ${x}px ${y}px, rgba(59, 130, 246, 0.08), transparent 40%)`
          ),
        }}
      />

      <div className="flex flex-col md:flex-row min-h-[34rem]">
        {/* Image Section - Leads on mobile */}
        <div className="relative w-full md:w-[42%] h-[24rem] md:h-auto overflow-hidden bg-[#F5F5F7] dark:bg-gray-800">
          {member.image ? (
            <motion.img
              src={member.image}
              alt={member.name}
              className="w-full h-full object-cover object-[center_20%] grayscale-[0.3] group-hover:grayscale-0 transition-all duration-1000"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 1.5 }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
               <div className="text-6xl opacity-20">⚖️</div>
            </div>
          )}
          {/* Subtle mobile shade */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none md:hidden" />
        </div>

        {/* Content Section */}
        <div className="flex-1 p-8 sm:p-10 md:p-14 lg:p-16 flex flex-col justify-center z-10">
          <div className="mb-10">
            <div className="flex flex-col gap-1.5 mb-5">
              <span className="text-[10px] sm:text-xs font-bold tracking-[0.35em] text-blue-600 dark:text-blue-400 uppercase">
                {member.title}
              </span>
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white tracking-tight leading-tight">
                {member.name}
              </h3>
            </div>
            
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-50 dark:bg-white/5 rounded-full">
              <div className="w-1 h-1 rounded-full bg-blue-500" />
              <p className="text-[11px] sm:text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                {member.credentials}
              </p>
            </div>
          </div>

          <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed font-normal max-w-2xl">
            {member.bio}
          </p>

          {/* Education - Apple-style List with Icons */}
          <div className="pt-10 border-t border-gray-100 dark:border-white/5">
            <h4 className="text-[10px] sm:text-xs font-bold text-gray-900 dark:text-white uppercase tracking-[0.2em] mb-6 opacity-60">
              Education & Professional Background
            </h4>
            <div className="grid gap-4">
              {member.education.map((edu, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)] flex-shrink-0" />
                  <span className="text-sm sm:text-base text-gray-500 dark:text-gray-400 leading-snug font-medium">
                    {edu}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
