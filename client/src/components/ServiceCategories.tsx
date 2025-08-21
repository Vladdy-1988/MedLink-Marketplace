import { coreServiceCategories, additionalServiceCategories } from "@/lib/mockData";
import { 
  Stethoscope, UserCheck, Activity, Home, Heart, TestTube, Brain, Syringe, 
  Smile, Ear, Eye, Footprints, MessageCircle, Apple, Pill, Droplets, 
  ArrowRight, Plus, CheckCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";

// Icon mapping for service types
const iconMap = {
  'Stethoscope': Stethoscope,
  'UserCheck': UserCheck,
  'Activity': Activity,
  'Home': Home,
  'Heart': Heart,
  'TestTube': TestTube,
  'Brain': Brain,
  'Syringe': Syringe,
  'Smile': Smile,
  'Ear': Ear,
  'Eye': Eye,
  'Footprints': Footprints,
  'MessageCircle': MessageCircle,
  'Apple': Apple,
  'Pill': Pill,
  'Droplets': Droplets
};

export default function ServiceCategories() {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/30',
          icon: 'bg-[hsl(207,90%,54%)] text-white',
          price: 'text-[hsl(207,90%,54%)]'
        };
      case 'green':
        return {
          bg: 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/30',
          icon: 'bg-[hsl(159,100%,34%)] text-white',
          price: 'text-[hsl(159,100%,34%)]'
        };
      case 'purple':
        return {
          bg: 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/30',
          icon: 'bg-[hsl(259,78%,60%)] text-white',
          price: 'text-[hsl(259,78%,60%)]'
        };
      case 'orange':
        return {
          bg: 'bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/30',
          icon: 'bg-orange-500 text-white',
          price: 'text-orange-500'
        };
      case 'teal':
        return {
          bg: 'bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/30',
          icon: 'bg-teal-500 text-white',
          price: 'text-teal-500'
        };
      case 'pink':
        return {
          bg: 'bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/30',
          icon: 'bg-pink-500 text-white',
          price: 'text-pink-500'
        };
      case 'indigo':
        return {
          bg: 'bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/30',
          icon: 'bg-indigo-500 text-white',
          price: 'text-indigo-500'
        };
      case 'red':
        return {
          bg: 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/30',
          icon: 'bg-red-500 text-white',
          price: 'text-red-500'
        };
      default:
        return {
          bg: 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/30',
          icon: 'bg-gray-500 text-white',
          price: 'text-gray-500'
        };
    }
  };

  const ServiceCard = ({ service, index }: { service: any, index: number }) => {
    const colors = getColorClasses(service.color);
    const IconComponent = iconMap[service.icon as keyof typeof iconMap];
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: index * 0.05 }}
        key={service.id}
        className={`${colors.bg} rounded-2xl p-6 hover:shadow-2xl transition-all duration-500 cursor-pointer group hover:-translate-y-2 border border-white/20 backdrop-blur-sm`}
      >
        <div className={`w-14 h-14 ${colors.icon} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
          {IconComponent && <IconComponent className="w-6 h-6" />}
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {service.name}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
          {service.description}
        </p>
        <div className="space-y-2">
          {service.insurance && (
            <div className="flex items-center text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
              <CheckCircle className="w-3 h-3 mr-1" />
              {service.insurance}
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800" id="services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl lg:text-6xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
            Comprehensive Healthcare 
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              At Your Doorstep
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Our vetted healthcare professionals provide a wide range of medical services in the comfort and safety of your home.
          </p>
        </motion.div>

        {/* Popular Services - Show only 6 most common ones on homepage */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Most Popular Services</h3>
              <p className="text-gray-600 dark:text-gray-300">The most requested healthcare services in Calgary</p>
            </div>
            <Link href="/services">
              <Button className="hidden md:flex bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full px-6 py-3 group">
                View All 16 Services
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          
          {/* Show only the 6 most popular services */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              coreServiceCategories[0], // General Practice
              coreServiceCategories[1], // Nursing Services  
              coreServiceCategories[2], // Physical Therapy
              coreServiceCategories[5], // Mobile Lab Tests
              coreServiceCategories[6], // Mental Health
              additionalServiceCategories[0] // Dental Care
            ].map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>
        </motion.div>

        {/* Service Categories Overview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Complete Healthcare Coverage</h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Browse our comprehensive range of healthcare services organized by specialty
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Essential Care Category */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/30 rounded-2xl p-6 hover:shadow-2xl transition-all duration-500 cursor-pointer group hover:-translate-y-2">
              <div className="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
                Essential Care
              </h4>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                General practice, nursing, lab tests, vaccinations
              </p>
              <div className="text-sm text-blue-600 font-semibold">4 Services Available</div>
            </div>

            {/* Therapy Services Category */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/30 rounded-2xl p-6 hover:shadow-2xl transition-all duration-500 cursor-pointer group hover:-translate-y-2">
              <div className="w-14 h-14 bg-green-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-green-600 transition-colors">
                Therapy Services
              </h4>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Physical, occupational, speech, mental health therapy
              </p>
              <div className="text-sm text-green-600 font-semibold">4 Services Available</div>
            </div>

            {/* Specialized Care Category */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/30 rounded-2xl p-6 hover:shadow-2xl transition-all duration-500 cursor-pointer group hover:-translate-y-2">
              <div className="w-14 h-14 bg-purple-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 transition-colors">
                Specialized Care
              </h4>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Dental, vision, hearing, podiatry services
              </p>
              <div className="text-sm text-purple-600 font-semibold">4 Services Available</div>
            </div>

            {/* Advanced Services Category */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/30 rounded-2xl p-6 hover:shadow-2xl transition-all duration-500 cursor-pointer group hover:-translate-y-2">
              <div className="w-14 h-14 bg-orange-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Droplets className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-orange-600 transition-colors">
                Advanced Services
              </h4>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                IV therapy, palliative care, pharmacy, nutrition
              </p>
              <div className="text-sm text-orange-600 font-semibold">4 Services Available</div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
            <h4 className="text-3xl font-bold mb-4">Need a Service Not Listed?</h4>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              We're constantly expanding our network. Contact us to discuss your specific healthcare needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/providers">
                <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl">
                  Find Providers
                </Button>
              </Link>
              <Link href="/support">
                <Button className="border border-white bg-transparent text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300">
                  Request Service
                  <Plus className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
