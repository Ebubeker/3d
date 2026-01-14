'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

interface Project {
  id: string;
  title: string;
  type: string;
  image: string;
}

interface TeamMember {
  id: number;
  name: string;
  role: string;
  skills: string[];
  image: string;
  projects: Project[];
}

// Same team members data as in the main team page
const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: 'Sarah Chen',
    role: '3D Fashion Designer',
    skills: ['CLO3D', '3D Simulation', 'Texturing'],
    image: '/placeholder.jpg',
    projects: [
      { id: 'p1', title: 'Summer Collection 2024', type: '3D Simulation', image: '/placeholder.jpg' },
      { id: 'p2', title: 'Athleisure Line', type: 'Texturing', image: '/placeholder.jpg' },
      { id: 'p3', title: 'Denim Essentials', type: '3D Modeling', image: '/placeholder.jpg' }
    ]
  },
  {
    id: 2,
    name: 'Marco Rossi',
    role: 'Technical Designer',
    skills: ['2D Flats', 'Tech Packs', 'Patternmaking'],
    image: '/placeholder.jpg',
    projects: [
      { id: 'p4', title: 'Outerwear Tech Packs', type: 'Tech Pack', image: '/placeholder.jpg' },
      { id: 'p5', title: 'Streetwear Flats', type: '2D Flats', image: '/placeholder.jpg' },
      { id: 'p6', title: 'Formal Wear Patterns', type: 'Patternmaking', image: '/placeholder.jpg' }
    ]
  },
  {
    id: 3,
    name: 'Aisha Kumar',
    role: '3D Visualization Specialist',
    skills: ['Browzwear', 'Rendering', 'Material Design'],
    image: '/placeholder.jpg',
    projects: [
      { id: 'p7', title: 'Luxury Brand Renders', type: 'Rendering', image: '/placeholder.jpg' },
      { id: 'p8', title: 'Fabric Visualization', type: 'Material Design', image: '/placeholder.jpg' },
      { id: 'p9', title: 'Virtual Showroom', type: '3D Visualization', image: '/placeholder.jpg' }
    ]
  },
  {
    id: 4,
    name: 'Lucas Silva',
    role: 'Collection Developer',
    skills: ['Collection Planning', 'Line Sheets', 'Concept Design'],
    image: '/placeholder.jpg',
    projects: [
      { id: 'p10', title: 'Fall/Winter 2024', type: 'Collection Planning', image: '/placeholder.jpg' },
      { id: 'p11', title: 'Resort Collection', type: 'Concept Design', image: '/placeholder.jpg' },
      { id: 'p12', title: 'Capsule Wardrobe', type: 'Line Sheets', image: '/placeholder.jpg' }
    ]
  },
  {
    id: 5,
    name: 'Emma Thompson',
    role: 'Senior Technical Designer',
    skills: ['3D Simulation', '2D Flats', 'Quality Control'],
    image: '/placeholder.jpg',
    projects: [
      { id: 'p13', title: 'Premium Knitwear', type: '3D Simulation', image: '/placeholder.jpg' },
      { id: 'p14', title: 'Swimwear Line', type: '2D Flats', image: '/placeholder.jpg' },
      { id: 'p15', title: 'Quality Standards Guide', type: 'Quality Control', image: '/placeholder.jpg' }
    ]
  },
  {
    id: 6,
    name: 'Hiroshi Tanaka',
    role: 'Digital Fashion Artist',
    skills: ['CLO3D', 'Marvelous Designer', 'Virtual Prototyping'],
    image: '/placeholder.jpg',
    projects: [
      { id: 'p16', title: 'Avant-Garde Collection', type: 'CLO3D', image: '/placeholder.jpg' },
      { id: 'p17', title: 'Digital Fashion Week', type: 'Virtual Prototyping', image: '/placeholder.jpg' },
      { id: 'p18', title: 'NFT Fashion Series', type: 'Digital Art', image: '/placeholder.jpg' }
    ]
  }
];

export default function TeamMemberPage() {
  const params = useParams();
  const router = useRouter();
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const memberId = Number(params.id);
  const member = teamMembers.find((m) => m.id === memberId);

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

  if (!member) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-black mb-4">Member Not Found</h1>
            <p className="text-gray-600 mb-8">The team member you're looking for doesn't exist.</p>
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

      {/* Member Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-8 md:px-12 pt-32 pb-16 md:pt-40 md:pb-20">
          <Link
            href="/team"
            className="inline-flex items-center text-gray-600 hover:text-black mb-10 transition-colors group"
          >
            <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Team
          </Link>

          <div className="flex flex-col md:flex-row gap-10 items-start">
            <div className="w-36 h-36 md:w-40 md:h-40 bg-linear-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center shrink-0 animate-scale-in shadow-lg">
              <span className="text-6xl">👤</span>
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
              <h1 className="text-5xl md:text-6xl font-bold text-black mb-4">{member.name}</h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8">{member.role}</p>
              <div className="flex flex-wrap gap-3">
                {member.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-5 py-2 bg-gray-100 text-gray-700 rounded-full font-medium text-lg hover:bg-gray-200 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div className="bg-gray-50 min-h-[50vh]">
        <div className="max-w-6xl mx-auto px-8 md:px-12 py-20 md:py-24">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-10">Projects</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {member.projects.map((project, index) => (
              <Link
                href={`/team/${member.id}/project/${project.id}`}
                key={project.id}
                className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-black hover:shadow-2xl transition-all duration-500 group cursor-pointer hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'both' }}
              >
                <div className="aspect-video bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center group-hover:from-gray-200 group-hover:to-gray-300 transition-all duration-500">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="p-6">
                  <span className="text-sm text-gray-500 font-medium">{project.type}</span>
                  <h3 className="text-xl font-bold text-black mt-1 group-hover:text-gray-700 transition-colors">{project.title}</h3>
                </div>
              </Link>
            ))}
          </div>

          {member.projects.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No projects available yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Contact CTA */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl font-bold text-black mb-4">Interested in working with {member.name}?</h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Get in touch to discuss your project requirements and see how {member.name} can help bring your vision to life.
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-4 bg-black text-white rounded font-medium hover:bg-gray-900 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>

      <Footer />
    </>
  );
}
