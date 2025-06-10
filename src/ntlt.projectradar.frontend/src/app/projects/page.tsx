export default function ProjectsPage() {
  // Mock data for demonstration
  const mockProjects = [
    {
      id: 1,
      title: "React Developer - Berlin",
      company: "Tech Startup",
      location: "Berlin, Remote possible",
      status: "New",
      uploadDate: "2025-06-10",
      technologies: "React, TypeScript, Node.js"
    },
    {
      id: 2,
      title: ".NET Backend Developer",
      company: "Enterprise Corp",
      location: "Munich",
      status: "Seen",
      uploadDate: "2025-06-09",
      technologies: ".NET, C#, Azure"
    },
    {
      id: 3,
      title: "Fullstack Engineer",
      company: "Medium Company",
      location: "Hamburg, Remote",
      status: "Interesting",
      uploadDate: "2025-06-08",
      technologies: "Vue.js, Python, Docker"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-800';
      case 'Seen': return 'bg-neutral-100 text-neutral-800';
      case 'Interesting': return 'bg-green-100 text-green-800';
      default: return 'bg-neutral-100 text-neutral-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Projects Overview
          </h1>
          <p className="text-lg text-neutral-600">
            All extracted project opportunities from uploaded emails
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-neutral-700">Status:</label>
              <select className="border border-neutral-300 rounded-md px-3 py-1 text-sm">
                <option>All</option>
                <option>New</option>
                <option>Seen</option>
                <option>Interesting</option>
                <option>Not Relevant</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-neutral-700">Search:</label>
              <input 
                type="text" 
                placeholder="Search projects..." 
                className="border border-neutral-300 rounded-md px-3 py-1 text-sm w-64"
              />
            </div>
          </div>
        </div>

        {/* Projects List */}
        <div className="space-y-4">
          {mockProjects.map((project) => (
            <div key={project.id} className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-neutral-900">
                      {project.title}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>
                  
                  <div className="space-y-1 text-sm text-neutral-600">
                    <p><span className="font-medium">Company:</span> {project.company}</p>
                    <p><span className="font-medium">Location:</span> {project.location}</p>
                    <p><span className="font-medium">Technologies:</span> {project.technologies}</p>
                    <p><span className="font-medium">Uploaded:</span> {project.uploadDate}</p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-sm border border-neutral-300 rounded-md hover:bg-neutral-50">
                    View Details
                  </button>
                  <button className="px-3 py-1 text-sm bg-neutral-900 text-white rounded-md hover:bg-neutral-800">
                    Update Status
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State (when no projects) */}
        {mockProjects.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-12 text-center">
            <div className="text-4xl text-neutral-400 mb-4">📋</div>
            <h3 className="text-lg font-medium text-neutral-900 mb-2">No projects yet</h3>
            <p className="text-neutral-600 mb-4">Upload your first .eml file to get started</p>
            <a href="/upload" className="px-4 py-2 bg-neutral-900 text-white rounded-md hover:bg-neutral-800 transition-colors">
              Upload Email
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
