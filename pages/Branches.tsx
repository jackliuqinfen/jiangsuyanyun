
import React, { useState, useEffect } from 'react';
import { Building, Phone, User } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { storageService } from '../services/storageService';
import { Branch } from '../types';

const Branches: React.FC = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const header = storageService.getPageContent().headers.branches;

  useEffect(() => {
    storageService.getBranches().then(setBranches);
  }, []);

  return (
    <div className="bg-surface min-h-screen">
       <PageHeader 
        title={header.title} 
        subtitle={header.subtitle}
        backgroundImage={header.backgroundImage}
      />

      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {branches.map((branch) => (
             <div key={branch.id} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all">
                <div className="flex items-center justify-between mb-6">
                   <h3 className="text-xl font-bold text-gray-900">{branch.name}</h3>
                   <div className="p-2 bg-blue-50 text-primary rounded-lg">
                     <Building size={20} />
                   </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 text-gray-600">
                    <Building size={16} className="mt-1 flex-shrink-0" />
                    <span className="text-sm">{branch.address}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-600">
                    <User size={16} className="flex-shrink-0" />
                    <span className="text-sm">负责人：{branch.manager}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-600">
                    <Phone size={16} className="flex-shrink-0" />
                    <span className="text-sm">{branch.phone}</span>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100">
                   <button className="w-full py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors text-sm font-medium">
                     查看地图定位
                   </button>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default Branches;
