import { ArrowRight } from 'lucide-react';

interface ProjectsSectionProps {
  onNavigate?: (route: string) => void;
}

const projects = [
  {
    title: 'Eco-Farm Expansion',
    category: 'Infrastructure',
    image: '/assets/images/landing/project-eco-farm.png',
    route: '/projects/eco-farm',
  },
  {
    title: 'Smart Irrigation System',
    category: 'Technology',
    image: '/assets/images/landing/project-smart-irrigation.png',
    route: '/projects/smart-irrigation',
  },
  {
    title: 'Organic Supply Chain',
    category: 'Logistics',
    image: '/assets/images/landing/project-logistics.png',
    route: '/projects/logistics',
  },
];

export default function ProjectsSection({ onNavigate }: ProjectsSectionProps) {
  return (
    <section id="projects" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-green-600 font-semibold tracking-wide uppercase text-sm">
              Portfolio
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Recently Completed Projects
            </h2>
          </div>

          <div
            className="hidden md:flex items-center text-green-600 font-medium hover:text-green-700 cursor-pointer mt-4 md:mt-0"
            onClick={() => onNavigate?.('/projects')}
          >
            View all projects <ArrowRight className="ml-2 w-4 h-4" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="group relative rounded-2xl overflow-hidden aspect-[4/3] cursor-pointer"
              onClick={() => onNavigate?.(project.route)}
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 transition-opacity"></div>

              <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <span className="inline-block px-3 py-1 bg-green-500/20 backdrop-blur-md text-green-300 text-xs font-semibold rounded-full mb-2 border border-green-500/30">
                  {project.category}
                </span>
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-green-400 transition-colors">
                  {project.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        <div className="md:hidden mt-8 text-center">
          <span className="inline-flex items-center text-green-600 font-medium">
            View all projects <ArrowRight className="ml-2 w-4 h-4" />
          </span>
        </div>
      </div>
    </section>
  );
}
