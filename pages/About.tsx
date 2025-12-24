
import React from 'react';
import { motion } from 'framer-motion';
import { Award, Users, Target, CheckCircle, Calendar } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { storageService } from '../services/storageService';

const About: React.FC = () => {
  const honors = storageService.getHonors();
  const team = storageService.getTeam();
  const history = storageService.getHistory();
  const content = storageService.getPageContent().about;
  const header = storageService.getPageContent().headers.about;

  return (
    <div className="bg-white">
      <PageHeader 
        title={header.title} 
        subtitle={header.subtitle}
        backgroundImage={header.backgroundImage}
      />

      {/* Intro Section - Dynamic */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="mb-6 flex items-center space-x-2">
                <div className="w-1 h-8 bg-primary"></div>
                <h2 className="text-3xl font-bold text-gray-900">{content.intro.title}</h2>
              </div>
              <p className="text-gray-600 leading-loose mb-6 text-lg">
                {content.intro.content1}
              </p>
              <p className="text-gray-600 leading-loose text-lg">
                {content.intro.content2}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <img 
                src={content.intro.imageUrl} 
                alt="Company Office" 
                className="rounded-2xl shadow-2xl z-10 relative"
              />
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-gray-50 rounded-2xl -z-0"></div>
              <div className="absolute -top-6 -left-6 w-32 h-32 border-4 border-primary/20 rounded-full -z-0"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Culture Section - Dynamic */}
      <section className="py-20 bg-surface">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-xl shadow-soft text-center hover:-translate-y-2 transition-transform">
              <div className="w-16 h-16 bg-blue-50 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Target size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4">企业使命</h3>
              <p className="text-gray-600">{content.culture.mission}</p>
            </div>
            <div className="bg-white p-10 rounded-xl shadow-soft text-center hover:-translate-y-2 transition-transform">
              <div className="w-16 h-16 bg-blue-50 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Award size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4">核心价值观</h3>
              <p className="text-gray-600">{content.culture.values}</p>
            </div>
            <div className="bg-white p-10 rounded-xl shadow-soft text-center hover:-translate-y-2 transition-transform">
              <div className="w-16 h-16 bg-blue-50 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Users size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4">管理理念</h3>
              <p className="text-gray-600">{content.culture.management}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Honors Section (Enhanced) */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
           <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">荣誉资质</h2>
            <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              每一份荣誉都是对过去的肯定，更是对未来的激励。
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {honors.map((honor, index) => (
              <motion.div 
                key={honor.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group relative bg-white rounded-2xl shadow-sm hover:shadow-2xl hover:border-primary/30 hover:-translate-y-2 transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col cursor-pointer"
              >
                 {/* Image Container with Overflow Hidden for Zoom */}
                 <div className="aspect-[3/4] overflow-hidden bg-gray-100 relative">
                    <img 
                      src={honor.imageUrl} 
                      alt={honor.title} 
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out" 
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* View Details Icon - Only visible on hover */}
                     <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                           <Award size={20} />
                        </div>
                     </div>
                 </div>
                 
                 {/* Card Content */}
                 <div className="p-6 relative flex-grow flex flex-col">
                    {/* Floating Date Badge */}
                    <div className="absolute -top-5 right-4 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10 flex items-center gap-1 group-hover:bg-primary transition-colors duration-300">
                      <Calendar size={10} />
                      {honor.issueDate}
                    </div>

                    <h3 className="font-bold text-gray-900 text-lg leading-snug mb-3 group-hover:text-primary transition-colors line-clamp-2 min-h-[3.5rem]">
                        {honor.title}
                    </h3>
                    
                    <div className="mt-auto flex items-center text-sm text-gray-500 pt-4 border-t border-gray-100">
                       <div className="w-8 h-8 rounded-full bg-blue-50 text-primary flex items-center justify-center mr-3 flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                          <CheckCircle size={14} />
                       </div>
                       <span className="truncate font-medium" title={honor.issuingAuthority}>{honor.issuingAuthority}</span>
                    </div>
                 </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* History Timeline - Dynamic */}
      <section className="py-24 bg-surface">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">发展历程</h2>
            <div className="w-20 h-1 bg-primary mx-auto"></div>
          </div>
          
          <div className="max-w-4xl mx-auto relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gray-200"></div>
            
            {history.map((event, idx) => (
              <motion.div 
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`relative flex items-center justify-between mb-12 ${idx % 2 === 0 ? 'flex-row-reverse' : ''}`}
              >
                <div className="w-5/12"></div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-white border-4 border-primary rounded-full z-10"></div>
                <div className={`w-5/12 ${idx % 2 === 0 ? 'text-right' : 'text-left'}`}>
                  <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <span className="text-2xl font-bold text-primary block mb-2">{event.year}</span>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{event.title}</h3>
                    <p className="text-gray-600 text-sm">{event.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section - Dynamic */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">核心团队</h2>
            <p className="text-gray-600">汇聚行业精英，打造一流管理团队</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member) => (
              <motion.div 
                key={member.id}
                whileHover={{ y: -10 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100"
              >
                <div className="h-80 overflow-hidden">
                  <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover object-top" />
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-primary font-medium text-sm mb-4">{member.role}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{member.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
