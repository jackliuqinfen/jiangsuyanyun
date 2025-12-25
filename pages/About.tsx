
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Users, Target, CheckCircle, Calendar, ShieldCheck } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { storageService } from '../services/storageService';
import { Honor, TeamMember, HistoryEvent } from '../types';

const MotionDiv = motion.div as any;

const About: React.FC = () => {
  const [honors, setHonors] = useState<Honor[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [history, setHistory] = useState<HistoryEvent[]>([]);
  const content = storageService.getPageContent().about;
  const header = storageService.getPageContent().headers.about;

  useEffect(() => {
    const fetchData = async () => {
      const [h, t, hist] = await Promise.all([
        storageService.getHonors(),
        storageService.getTeamMembers(),
        storageService.getHistory()
      ]);
      setHonors(h);
      setTeam(t);
      setHistory(hist);
    };
    fetchData();
  }, []);

  return (
    <div className="bg-white">
      <PageHeader 
        title={header.title} 
        subtitle={header.subtitle}
        backgroundImage={header.backgroundImage}
      />

      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <MotionDiv
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="mb-6 flex items-center space-x-3">
                <div className="w-1.5 h-10 bg-primary rounded-full"></div>
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">{content.intro.title}</h2>
              </div>
              <div className="space-y-6 text-gray-600 leading-loose text-lg font-medium">
                <p>{content.intro.content1}</p>
                <p>{content.intro.content2}</p>
              </div>
            </MotionDiv>
            <MotionDiv
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl z-10 relative border border-gray-100">
                <img src={content.intro.imageUrl} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary/5 rounded-[3rem] -z-0"></div>
            </MotionDiv>
          </div>
        </div>
      </section>

      <section className="py-24 bg-surface">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Target, label: '企业使命', text: content.culture.mission },
              { icon: Award, label: '核心价值观', text: content.culture.values },
              { icon: ShieldCheck, label: '管理理念', text: content.culture.management }
            ].map((item, i) => (
              <div key={i} className="bg-white p-12 rounded-[2.5rem] shadow-soft text-center hover:-translate-y-2 transition-transform border border-gray-100 flex flex-col h-full">
                <div className="w-20 h-20 bg-blue-50 text-primary rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                  <item.icon size={36} />
                </div>
                <h3 className="text-2xl font-black mb-6 text-gray-900 tracking-tight">{item.label}</h3>
                <p className="text-gray-500 leading-relaxed font-medium">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
           <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 tracking-tighter mb-4">荣誉资质</h2>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Accreditations & Honors</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {honors.map((honor, index) => (
              <MotionDiv 
                key={honor.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-white rounded-3xl shadow-soft hover:shadow-2xl border border-gray-100 flex flex-col overflow-hidden transition-all duration-500"
              >
                 <div className="aspect-[3/4] overflow-hidden bg-gray-50 relative border-b">
                    <img src={honor.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                 </div>
                 <div className="p-8 flex-grow">
                    <h3 className="font-bold text-gray-900 text-lg leading-tight mb-4 min-h-[3rem] line-clamp-2">
                        {honor.title}
                    </h3>
                    <div className="flex items-center text-xs text-gray-400 font-bold uppercase tracking-wider">
                       <CheckCircle size={14} className="text-primary mr-2" />
                       {honor.issuingAuthority}
                    </div>
                 </div>
              </MotionDiv>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-surface">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-gray-900 tracking-tighter">发展历程</h2>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-2">Our Journey</p>
          </div>
          <div className="max-w-5xl mx-auto relative px-4">
            <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-0.5 h-full bg-gray-200"></div>
            <div className="space-y-16">
              {history.map((event, idx) => (
                <MotionDiv 
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className={`relative flex items-start md:items-center ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                >
                  <div className="hidden md:block md:w-1/2"></div>
                  <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 w-5 h-5 bg-white border-4 border-primary rounded-full z-10 shadow-xl"></div>
                  <div className={`pl-12 md:pl-0 md:w-1/2 ${idx % 2 === 0 ? 'md:pr-16' : 'md:pl-16'}`}>
                    <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-soft hover:shadow-xl transition-all relative">
                      <span className="text-3xl font-black text-primary block mb-3 tracking-tighter">{event.year}</span>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">{event.title}</h3>
                      <p className="text-gray-500 font-medium leading-relaxed">{event.description}</p>
                    </div>
                  </div>
                </MotionDiv>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-gray-900 tracking-tighter">核心团队</h2>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-2">Executive Team</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {team.map((member) => (
              <MotionDiv 
                key={member.id}
                whileHover={{ y: -15 }}
                className="bg-gray-50 rounded-[3rem] overflow-hidden shadow-soft group transition-all"
              >
                <div className="aspect-square overflow-hidden bg-gray-200">
                  <img src={member.imageUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" loading="lazy" />
                </div>
                <div className="p-10 text-center">
                  <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">{member.name}</h3>
                  <p className="text-primary font-black text-xs uppercase tracking-[0.2em] mb-6">{member.role}</p>
                  <p className="text-gray-500 text-sm font-medium leading-loose">{member.description}</p>
                </div>
              </MotionDiv>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
