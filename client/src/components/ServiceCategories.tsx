import { serviceCategories } from "@/lib/mockData";

export default function ServiceCategories() {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
          icon: 'bg-[hsl(207,90%,54%)] text-white',
          price: 'text-[hsl(207,90%,54%)]'
        };
      case 'green':
        return {
          bg: 'bg-gradient-to-br from-green-50 to-green-100',
          icon: 'bg-[hsl(159,100%,34%)] text-white',
          price: 'text-[hsl(159,100%,34%)]'
        };
      case 'purple':
        return {
          bg: 'bg-gradient-to-br from-purple-50 to-purple-100',
          icon: 'bg-[hsl(259,78%,60%)] text-white',
          price: 'text-[hsl(259,78%,60%)]'
        };
      case 'orange':
        return {
          bg: 'bg-gradient-to-br from-orange-50 to-orange-100',
          icon: 'bg-orange-500 text-white',
          price: 'text-orange-500'
        };
      case 'teal':
        return {
          bg: 'bg-gradient-to-br from-teal-50 to-teal-100',
          icon: 'bg-teal-500 text-white',
          price: 'text-teal-500'
        };
      case 'pink':
        return {
          bg: 'bg-gradient-to-br from-pink-50 to-pink-100',
          icon: 'bg-pink-500 text-white',
          price: 'text-pink-500'
        };
      case 'indigo':
        return {
          bg: 'bg-gradient-to-br from-indigo-50 to-indigo-100',
          icon: 'bg-indigo-500 text-white',
          price: 'text-indigo-500'
        };
      case 'red':
        return {
          bg: 'bg-gradient-to-br from-red-50 to-red-100',
          icon: 'bg-red-500 text-white',
          price: 'text-red-500'
        };
      default:
        return {
          bg: 'bg-gradient-to-br from-gray-50 to-gray-100',
          icon: 'bg-gray-500 text-white',
          price: 'text-gray-500'
        };
    }
  };

  return (
    <section className="py-16 bg-white" id="services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Comprehensive Healthcare Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our vetted healthcare professionals provide a wide range of medical services in the comfort of your home.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {serviceCategories.map((service) => {
            const colors = getColorClasses(service.color);
            return (
              <div
                key={service.id}
                className={`${colors.bg} rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer group`}
              >
                <div className={`w-12 h-12 ${colors.icon} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <i className={`${service.icon} text-xl`}></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.name}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <div className={`text-sm ${colors.price} font-medium`}>{service.price}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
