'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../../../../components/Header';
import Footer from '../../../../components/Footer';

interface Project {
  id: string;
  title: string;
  type: string;
  image: string;
  description: string;
  tools: string[];
  duration: string;
  client: string;
}

interface TeamMember {
  id: number;
  name: string;
  role: string;
  skills: string[];
  image: string;
  projects: Project[];
}

// Extended team members data with full project details
const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: 'Sarah Chen',
    role: '3D Fashion Designer',
    skills: ['CLO3D', '3D Simulation', 'Texturing'],
    image: '/placeholder.jpg',
    projects: [
      {
        id: 'p1',
        title: 'Summer Collection 2024',
        type: '3D Simulation',
        image: '/placeholder.jpg',
        description: 'A comprehensive 3D simulation project for a luxury fashion brand\'s summer collection. This project involved creating realistic digital prototypes of 25 garments including dresses, blouses, and lightweight outerwear. Each piece was meticulously simulated to showcase fabric drape, movement, and fit accuracy.',
        tools: ['CLO3D', 'Substance Painter', 'Adobe Photoshop'],
        duration: '6 weeks',
        client: 'Luxury Fashion Brand'
      },
      {
        id: 'p2',
        title: 'Athleisure Line',
        type: 'Texturing',
        image: '/placeholder.jpg',
        description: 'Developed high-quality textures and materials for an athleisure sportswear line. Created realistic fabric simulations for performance materials including moisture-wicking fabrics, mesh panels, and stretch knits. The project focused on achieving photorealistic material representation.',
        tools: ['Substance Designer', 'CLO3D', 'Marvelous Designer'],
        duration: '4 weeks',
        client: 'Sports Apparel Company'
      },
      {
        id: 'p3',
        title: 'Denim Essentials',
        type: '3D Modeling',
        image: '/placeholder.jpg',
        description: 'Created a complete denim collection featuring jeans, jackets, and accessories. Special attention was given to accurate denim texture representation, including wash effects, distressing, and hardware details. The collection included 15 unique pieces with multiple colorway variations.',
        tools: ['CLO3D', 'Browzwear', 'Adobe Illustrator'],
        duration: '5 weeks',
        client: 'Denim Retailer'
      }
    ]
  },
  {
    id: 2,
    name: 'Marco Rossi',
    role: 'Technical Designer',
    skills: ['2D Flats', 'Tech Packs', 'Patternmaking'],
    image: '/placeholder.jpg',
    projects: [
      {
        id: 'p4',
        title: 'Outerwear Tech Packs',
        type: 'Tech Pack',
        image: '/placeholder.jpg',
        description: 'Comprehensive technical packages for a premium outerwear collection. Each tech pack included detailed construction specifications, material callouts, colorways, and measurement charts. The project covered 20 styles including parkas, bombers, and trench coats.',
        tools: ['Adobe Illustrator', 'Excel', 'PLM Software'],
        duration: '8 weeks',
        client: 'Outerwear Brand'
      },
      {
        id: 'p5',
        title: 'Streetwear Flats',
        type: '2D Flats',
        image: '/placeholder.jpg',
        description: 'Created detailed technical flat drawings for an urban streetwear collection. The project included hoodies, joggers, graphic tees, and accessories. Each flat drawing featured accurate proportions, stitch details, and construction notes.',
        tools: ['Adobe Illustrator', 'Procreate', 'Sketch'],
        duration: '3 weeks',
        client: 'Streetwear Startup'
      },
      {
        id: 'p6',
        title: 'Formal Wear Patterns',
        type: 'Patternmaking',
        image: '/placeholder.jpg',
        description: 'Developed precision patterns for a formal menswear collection including suits, dress shirts, and evening wear. The project required expert knowledge of tailoring techniques and grading for multiple size ranges.',
        tools: ['Gerber AccuMark', 'Optitex', 'Adobe Illustrator'],
        duration: '10 weeks',
        client: 'Menswear Designer'
      }
    ]
  },
  {
    id: 3,
    name: 'Aisha Kumar',
    role: '3D Visualization Specialist',
    skills: ['Browzwear', 'Rendering', 'Material Design'],
    image: '/placeholder.jpg',
    projects: [
      {
        id: 'p7',
        title: 'Luxury Brand Renders',
        type: 'Rendering',
        image: '/placeholder.jpg',
        description: 'Created photorealistic product renders for a luxury fashion house\'s e-commerce platform. The project involved high-end lighting setups, material accuracy, and post-production work to achieve catalog-quality images without physical samples.',
        tools: ['Browzwear', 'KeyShot', 'Adobe Lightroom'],
        duration: '4 weeks',
        client: 'Luxury E-commerce'
      },
      {
        id: 'p8',
        title: 'Fabric Visualization',
        type: 'Material Design',
        image: '/placeholder.jpg',
        description: 'Developed a comprehensive digital fabric library with over 100 unique materials. Each material was created with accurate physical properties for realistic simulation including weight, stretch, and drape characteristics.',
        tools: ['Substance Designer', 'Browzwear', 'U3M'],
        duration: '12 weeks',
        client: 'Fabric Mill'
      },
      {
        id: 'p9',
        title: 'Virtual Showroom',
        type: '3D Visualization',
        image: '/placeholder.jpg',
        description: 'Designed and built an immersive virtual showroom experience for a fashion brand\'s seasonal collection. The interactive 3D environment allowed buyers to explore garments in a realistic retail setting with zoom and rotation capabilities.',
        tools: ['Unity', 'Browzwear', 'Blender'],
        duration: '6 weeks',
        client: 'Fashion Tech Company'
      }
    ]
  },
  {
    id: 4,
    name: 'Lucas Silva',
    role: 'Collection Developer',
    skills: ['Collection Planning', 'Line Sheets', 'Concept Design'],
    image: '/placeholder.jpg',
    projects: [
      {
        id: 'p10',
        title: 'Fall/Winter 2024',
        type: 'Collection Planning',
        image: '/placeholder.jpg',
        description: 'End-to-end collection development for a contemporary fashion brand\'s Fall/Winter season. The project included trend research, concept development, SKU planning, and coordination with design and production teams for 80+ styles.',
        tools: ['Adobe InDesign', 'Miro', 'PLM Software'],
        duration: '16 weeks',
        client: 'Contemporary Brand'
      },
      {
        id: 'p11',
        title: 'Resort Collection',
        type: 'Concept Design',
        image: '/placeholder.jpg',
        description: 'Developed the creative concept and mood boards for a resort wear collection inspired by Mediterranean coastal living. The project included color palette development, print direction, and silhouette exploration.',
        tools: ['Adobe Creative Suite', 'Pinterest', 'Procreate'],
        duration: '4 weeks',
        client: 'Resort Wear Brand'
      },
      {
        id: 'p12',
        title: 'Capsule Wardrobe',
        type: 'Line Sheets',
        image: '/placeholder.jpg',
        description: 'Created comprehensive line sheets for a sustainable capsule wardrobe collection. The documentation included detailed product information, wholesale pricing, and visual merchandising suggestions for retail partners.',
        tools: ['Adobe InDesign', 'Excel', 'Canva'],
        duration: '2 weeks',
        client: 'Sustainable Fashion Label'
      }
    ]
  },
  {
    id: 5,
    name: 'Emma Thompson',
    role: 'Senior Technical Designer',
    skills: ['3D Simulation', '2D Flats', 'Quality Control'],
    image: '/placeholder.jpg',
    projects: [
      {
        id: 'p13',
        title: 'Premium Knitwear',
        type: '3D Simulation',
        image: '/placeholder.jpg',
        description: 'Simulated a premium knitwear collection with complex stitch patterns and cable knit details. The project required advanced material settings to accurately represent yarn weight and knit structure across sweaters, cardigans, and accessories.',
        tools: ['CLO3D', 'Shima Seiki', 'Adobe Photoshop'],
        duration: '7 weeks',
        client: 'Knitwear Specialist'
      },
      {
        id: 'p14',
        title: 'Swimwear Line',
        type: '2D Flats',
        image: '/placeholder.jpg',
        description: 'Developed technical drawings for a swimwear collection including one-pieces, bikinis, and cover-ups. Special attention was given to elastic placement, lining details, and hardware specifications.',
        tools: ['Adobe Illustrator', 'Procreate'],
        duration: '3 weeks',
        client: 'Swimwear Brand'
      },
      {
        id: 'p15',
        title: 'Quality Standards Guide',
        type: 'Quality Control',
        image: '/placeholder.jpg',
        description: 'Created a comprehensive quality control manual and standards guide for a global fashion retailer. The document covered inspection procedures, defect classification, and acceptance criteria for all product categories.',
        tools: ['Adobe InDesign', 'Word', 'Photography'],
        duration: '8 weeks',
        client: 'Global Retailer'
      }
    ]
  },
  {
    id: 6,
    name: 'Hiroshi Tanaka',
    role: 'Digital Fashion Artist',
    skills: ['CLO3D', 'Marvelous Designer', 'Virtual Prototyping'],
    image: '/placeholder.jpg',
    projects: [
      {
        id: 'p16',
        title: 'Avant-Garde Collection',
        type: 'CLO3D',
        image: '/placeholder.jpg',
        description: 'Created an experimental avant-garde collection pushing the boundaries of digital fashion. The project featured architectural silhouettes, unconventional materials, and designs that would be impossible to produce physically.',
        tools: ['CLO3D', 'Blender', 'After Effects'],
        duration: '8 weeks',
        client: 'Digital Fashion House'
      },
      {
        id: 'p17',
        title: 'Digital Fashion Week',
        type: 'Virtual Prototyping',
        image: '/placeholder.jpg',
        description: 'Produced a complete virtual fashion show with animated garments and digital models. The project included runway simulation, camera work, and post-production for a fully digital fashion week presentation.',
        tools: ['Marvelous Designer', 'Unreal Engine', 'DaVinci Resolve'],
        duration: '10 weeks',
        client: 'Fashion Week Organization'
      },
      {
        id: 'p18',
        title: 'NFT Fashion Series',
        type: 'Digital Art',
        image: '/placeholder.jpg',
        description: 'Designed a limited edition NFT fashion collection featuring wearable digital garments for metaverse platforms. Each piece was created as a unique digital asset with animated elements and special effects.',
        tools: ['CLO3D', 'Cinema 4D', 'Octane Render'],
        duration: '6 weeks',
        client: 'Web3 Fashion Platform'
      }
    ]
  }
];

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const memberId = Number(params.id);
  const projectId = params.projectId as string;

  const member = teamMembers.find((m) => m.id === memberId);
  const project = member?.projects.find((p) => p.id === projectId);

  useEffect(() => {
    const access = localStorage.getItem('teamAccess');
    if (access === 'granted') {
      setHasAccess(true);
    } else {
      router.push('/team');
    }
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-xl text-gray-600">Loading...</div>
        </div>
        <Footer />
      </>
    );
  }

  if (!hasAccess) {
    return null;
  }

  if (!member || !project) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-black mb-4">Project Not Found</h1>
            <p className="text-gray-600 mb-8">The project you're looking for doesn't exist.</p>
            <Link
              href="/team"
              className="px-8 py-4 bg-black text-white rounded font-medium hover:bg-gray-900 transition-colors"
            >
              Back to Team
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/team" className="text-gray-500 hover:text-black transition-colors">
              Team
            </Link>
            <span className="text-gray-400">/</span>
            <Link href={`/team/${member.id}`} className="text-gray-500 hover:text-black transition-colors">
              {member.name}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-black font-medium">{project.title}</span>
          </nav>
        </div>
      </div>

      {/* Project Header */}
      <div className="bg-white">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <Link
            href={`/team/${member.id}`}
            className="inline-flex items-center text-gray-600 hover:text-black mb-8 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to {member.name}'s Projects
          </Link>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Project Image */}
            <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
              <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>

            {/* Project Info */}
            <div>
              <span className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium mb-4">
                {project.type}
              </span>
              <h1 className="text-4xl font-bold text-black mb-6">{project.title}</h1>

              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                {project.description}
              </p>

              {/* Project Details */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Tools Used</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tools.map((tool, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-black text-white rounded text-sm font-medium"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Duration</h3>
                    <p className="text-black font-medium">{project.duration}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Client</h3>
                    <p className="text-black font-medium">{project.client}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Designer Info */}
      <div className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-bold text-black mb-6">About the Designer</h2>
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-3xl">👤</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-black">{member.name}</h3>
              <p className="text-gray-600 mb-3">{member.role}</p>
              <div className="flex flex-wrap gap-2">
                {member.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Other Projects */}
      {member.projects.filter(p => p.id !== project.id).length > 0 && (
        <div className="bg-white border-t border-gray-200">
          <div className="max-w-6xl mx-auto px-6 py-12">
            <h2 className="text-2xl font-bold text-black mb-6">More Projects by {member.name}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {member.projects
                .filter(p => p.id !== project.id)
                .map((otherProject) => (
                  <Link
                    href={`/team/${member.id}/project/${otherProject.id}`}
                    key={otherProject.id}
                    className="flex gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                  >
                    <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">{otherProject.type}</span>
                      <h3 className="text-lg font-bold text-black group-hover:text-gray-700 transition-colors">
                        {otherProject.title}
                      </h3>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Contact CTA */}
      <div className="bg-black">
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Interested in a similar project?</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Get in touch to discuss how we can help bring your vision to life with our team of expert designers.
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-4 bg-white text-black rounded font-medium hover:bg-gray-100 transition-colors"
          >
            Start a Project
          </Link>
        </div>
      </div>

      <Footer />
    </>
  );
}
