'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { createClient } from '@/lib/supabase/client';
import { TeamMember, PortfolioItem, getMediaUrls, isLinkEntry, parseLinkEntry } from '@/lib/supabase/types';
import { getMediaType } from '@/lib/supabase/storage';
import { MapPin, Globe, ArrowLeft, X } from 'lucide-react';
import PdfThumbnail from '../../components/PdfThumbnail';
import LinkThumbnail from '../../components/LinkThumbnail';

export default function TeamMemberPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [member, setMember] = useState<TeamMember | null>(null);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const memberId = params.id as string;

  // Check for project query param to open modal
  useEffect(() => {
    const projectId = searchParams.get('project');
    if (projectId && portfolioItems.length > 0) {
      const project = portfolioItems.find(p => p.id === projectId && p.display_type === 'project');
      if (project) {
        setSelectedProject(project);
      }
    }
  }, [searchParams, portfolioItems]);

  useEffect(() => {
    const access = localStorage.getItem('teamAccess');
    if (access === 'granted') {
      setHasAccess(true);
    } else {
      router.push('/team');
      return;
    }

    const fetchMemberData = async () => {
      try {
        const supabase = createClient();

        // Fetch team member — frozen members are treated as not found
        const { data: memberData, error: memberError } = await supabase
          .from('team_members')
          .select('*')
          .eq('id', memberId)
          .eq('is_active', true)
          .single();

        if (memberError || !memberData) {
          console.error('Error fetching member:', memberError);
          setIsLoading(false);
          return;
        }

        setMember(memberData);

        // Fetch portfolio items
        const { data: portfolioData, error: portfolioError } = await supabase
          .from('portfolio_items')
          .select('*')
          .eq('team_member_id', memberId)
          .order('created_at', { ascending: false });

        if (!portfolioError && portfolioData) {
          setPortfolioItems(portfolioData);
        }

        setIsLoading(false);
      } catch (err) {
        console.error('Error:', err);
        setIsLoading(false);
      }
    };

    fetchMemberData();
  }, [memberId, router]);

  const projects = portfolioItems.filter(item => item.display_type === 'project');
  const galleryImages = portfolioItems.filter(item => item.display_type === 'gallery');

  const closeProjectModal = () => {
    setSelectedProject(null);
    // Remove project query param from URL
    const url = new URL(window.location.href);
    url.searchParams.delete('project');
    window.history.replaceState({}, '', url.toString());
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
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
            <p className="text-gray-600 mb-8">The team member you&apos;re looking for doesn&apos;t exist.</p>
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 pt-24 sm:pt-32 pb-12 sm:pb-16 md:pt-40 md:pb-20">
          <Link
            href="/team"
            className="inline-flex items-center text-gray-600 hover:text-black mb-6 sm:mb-10 transition-colors group text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Team
          </Link>

          <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
            {/* Portrait */}
            <div className="w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center shrink-0 animate-scale-in shadow-lg overflow-hidden">
              {member.portrait && member.portrait !== '/placeholder.jpg' ? (
                getMediaType(member.portrait) === 'video' ? (
                  <video
                    src={`${member.portrait}#t=0.1`}
                    className="w-full h-full object-cover grayscale"
                    preload="metadata"
                    playsInline
                    muted
                    onError={(e) => console.error('Video load error:', member.portrait, e)}
                    onLoadedData={() => console.log('Video loaded:', member.portrait)}
                  />
                ) : (
                  <Image
                    src={member.portrait}
                    alt={member.name}
                    width={160}
                    height={160}
                    className="w-full h-full object-cover grayscale"
                  />
                )
              ) : (
                <span className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-400">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </span>
              )}
            </div>

            <div className="animate-fade-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-2 sm:mb-4">{member.name}</h1>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-3 sm:mb-4">{member.role}</p>

              {/* Location */}
              <div className="flex items-center gap-2 text-gray-500 text-sm sm:text-base mb-3">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>{member.location}</span>
              </div>

              {/* Languages */}
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {member.languages.map((lang, idx) => (
                    <span key={idx} className="text-xs sm:text-sm text-gray-600 bg-gray-100 px-2 py-0.5 sm:py-1 rounded">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bio */}
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 max-w-2xl">{member.bio}</p>

              {/* Specialties */}
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">Specialties</p>
                <div className="flex flex-wrap gap-2">
                  {member.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-100 text-gray-700 rounded-full font-medium text-xs sm:text-sm"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tools */}
              <div>
                <p className="text-xs text-gray-500 mb-2">Tools</p>
                <div className="flex flex-wrap gap-2">
                  {member.tools.map((tool, index) => (
                    <span
                      key={index}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 bg-black text-white rounded-full font-medium text-xs sm:text-sm"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Section */}
      {projects.length > 0 && (
        <div className="bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 py-12 sm:py-16 md:py-20">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-6 sm:mb-10">Projects</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {projects.map((project, index) => (
                <button
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className="bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-gray-200 hover:border-black hover:shadow-2xl transition-all duration-500 group cursor-pointer hover:-translate-y-2 animate-fade-in-up text-left"
                  style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
                >
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
                    {(() => {
                      const mediaUrls = getMediaUrls(project);

                      // Find the first image or video URL to use as thumbnail
                      const thumbnailUrl = mediaUrls.find((url) => {
                        if (isLinkEntry(url)) {
                          const entry = parseLinkEntry(url);
                          return entry?.type === 'image' || entry?.type === 'video';
                        }
                        const type = getMediaType(url);
                        return type === 'image' || type === 'video';
                      });

                      // No media at all
                      if (mediaUrls.length === 0) {
                        return (
                          <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        );
                      }

                      // Has an image or video — use it as thumbnail
                      if (thumbnailUrl) {
                        if (isLinkEntry(thumbnailUrl)) {
                          const entry = parseLinkEntry(thumbnailUrl);
                          if (entry) return <LinkThumbnail entry={entry} className="group-hover:scale-105 transition-transform duration-500" />;
                        }

                        const mediaType = getMediaType(thumbnailUrl);
                        if (mediaType === 'video') {
                          return (
                            <video
                              src={`${thumbnailUrl}#t=0.1`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              preload="metadata"
                              playsInline
                              muted
                              loop
                              onMouseEnter={(e) => e.currentTarget.play()}
                              onMouseLeave={(e) => {
                                e.currentTarget.pause();
                                e.currentTarget.currentTime = 0;
                              }}
                            />
                          );
                        }

                        return (
                          <Image
                            src={thumbnailUrl}
                            alt={project.title}
                            width={400}
                            height={225}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        );
                      }

                      // Only PDFs and/or links — show a placeholder based on first item
                      const firstUrl = mediaUrls[0];
                      const firstType = getMediaType(firstUrl);

                      if (firstType === 'pdf') {
                        return (
                          <PdfThumbnail url={firstUrl} />
                        );
                      }

                      // Link type — show label or "Link"
                      if (isLinkEntry(firstUrl)) {
                        const entry = parseLinkEntry(firstUrl);
                        return (
                          <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex flex-col items-center justify-center gap-2 px-4">
                            <svg className="w-10 h-10 sm:w-12 sm:h-12 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                            <span className="text-white/80 text-sm sm:text-base font-semibold tracking-wide text-center line-clamp-2">
                              {entry?.label || 'Link'}
                            </span>
                          </div>
                        );
                      }

                      // Fallback
                      return (
                        <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex flex-col items-center justify-center gap-2">
                          <svg className="w-10 h-10 sm:w-12 sm:h-12 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      );
                    })()}
                  </div>
                  <div className="p-4 sm:p-6">
                    {project.category && (
                      <span className="text-xs sm:text-sm text-gray-500 font-medium">{project.category}</span>
                    )}
                    <h3 className="text-lg sm:text-xl font-bold text-black mt-1 group-hover:text-gray-700 transition-colors">{project.title}</h3>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Gallery Images Section - Masonry Layout */}
      {galleryImages.length > 0 && (
        <div className={projects.length > 0 ? 'bg-white' : 'bg-gray-50'}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 py-12 sm:py-16 md:py-20">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-6 sm:mb-10">Gallery</h2>

            <div className="columns-2 sm:columns-3 md:columns-4 gap-2 sm:gap-3 md:gap-4">
              {galleryImages.map((image, index) => {
                const mediaUrls = getMediaUrls(image);
                const firstUrl = mediaUrls[0];
                const mediaType = firstUrl ? getMediaType(firstUrl) : null;
                // PDFs open in a new tab instead of the lightbox, because the
                // lightbox itself only renders images and videos.
                const isPdf = mediaType === 'pdf';

                const wrapperClass =
                  'block w-full mb-2 sm:mb-3 md:mb-4 bg-gray-100 rounded-lg sm:rounded-xl overflow-hidden hover:opacity-90 transition-opacity cursor-pointer animate-fade-in-up break-inside-avoid';
                const wrapperStyle = {
                  animationDelay: `${index * 50}ms`,
                  animationFillMode: 'both' as const,
                };

                const content = !firstUrl ? (
                  <div className="w-full aspect-square bg-gradient-to-br from-gray-200 to-gray-300" />
                ) : isLinkEntry(firstUrl) ? (
                  <div className="aspect-square">
                    <LinkThumbnail entry={parseLinkEntry(firstUrl)!} />
                  </div>
                ) : isPdf ? (
                  <div className="aspect-square">
                    <PdfThumbnail url={firstUrl} />
                  </div>
                ) : mediaType === 'video' ? (
                  <video
                    src={`${firstUrl}#t=0.1`}
                    className="w-full h-auto object-contain"
                    preload="metadata"
                    playsInline
                    muted
                    loop
                    onMouseEnter={(e) => e.currentTarget.play()}
                    onMouseLeave={(e) => {
                      e.currentTarget.pause();
                      e.currentTarget.currentTime = 0;
                    }}
                    onError={(e) => console.error('Video load error:', firstUrl, e)}
                    onLoadedData={() => console.log('Video loaded:', firstUrl)}
                  />
                ) : (
                  <img
                    src={firstUrl}
                    alt="Gallery image"
                    className="w-full h-auto object-contain"
                  />
                );

                if (isPdf && firstUrl) {
                  return (
                    <a
                      key={image.id}
                      href={firstUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={wrapperClass}
                      style={wrapperStyle}
                    >
                      {content}
                    </a>
                  );
                }

                return (
                  <button
                    key={image.id}
                    onClick={() => firstUrl && !isLinkEntry(firstUrl) && setLightboxImage(firstUrl)}
                    className={wrapperClass}
                    style={wrapperStyle}
                  >
                    {content}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {portfolioItems.length === 0 && (
        <div className="bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 py-16 sm:py-20 md:py-24 text-center">
            <p className="text-gray-500 text-base sm:text-lg">No portfolio items available yet.</p>
          </div>
        </div>
      )}

      {/* Contact CTA */}
      <div className={`bg-white border-t border-gray-200 ${portfolioItems.length === 0 ? '' : ''}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-black mb-3 sm:mb-4">Interested in working with {member.name}?</h2>
          <p className="text-gray-600 mb-6 sm:mb-8 max-w-xl mx-auto text-sm sm:text-base">
            Get in touch to discuss your project requirements and see how {member.name} can help bring your vision to life.
          </p>
          <Link
            href={`/contact?designer=${encodeURIComponent(member.name)}`}
            className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-black text-white rounded font-medium hover:bg-gray-900 transition-colors text-sm sm:text-base"
          >
            Get Quote
          </Link>
        </div>
      </div>

      <Footer />

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={closeProjectModal}>
          <div
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              {(() => {
                const mediaUrls = getMediaUrls(selectedProject);
                if (mediaUrls.length === 0) return null;

                const displayUrls = mediaUrls.slice(0, 6);
                const remainingCount = mediaUrls.length - 6;

                return (
                  <div className="px-6 pt-6 pb-2">
                    <div className="grid grid-cols-4 gap-1">
                      {displayUrls.map((url, index) => {
                        const mediaType = getMediaType(url);
                        const isLastVisible = index === 5 && remainingCount > 0;

                        return (
                          <div key={index} className="relative aspect-square bg-gray-100 rounded overflow-hidden">
                            {isLinkEntry(url) ? (
                              <LinkThumbnail entry={parseLinkEntry(url)!} />
                            ) : mediaType === 'video' ? (
                              <button
                                onClick={() => setLightboxImage(url)}
                                className="w-full h-full relative group cursor-pointer"
                              >
                                <video
                                  src={`${url}#t=0.1`}
                                  className="w-full h-full object-cover"
                                  preload="metadata"
                                  playsInline
                                  muted
                                />
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                                  <svg className="w-8 h-8 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                  </svg>
                                </div>
                              </button>
                            ) : mediaType === 'pdf' ? (
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full h-full block relative group"
                              >
                                <PdfThumbnail url={url} />
                              </a>
                            ) : (
                              <button
                                onClick={() => setLightboxImage(url)}
                                className="w-full h-full cursor-pointer hover:opacity-90 transition-opacity"
                              >
                                <Image
                                  src={url}
                                  alt={`${selectedProject.title} - ${index + 1}`}
                                  fill
                                  className="object-cover"
                                />
                              </button>
                            )}
                            {isLastVisible && (
                              <div className="absolute inset-0 bg-black/60 flex items-center justify-center pointer-events-none">
                                <span className="text-white text-sm font-bold">+{remainingCount}</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
              <button
                onClick={closeProjectModal}
                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 sm:p-8">
              {selectedProject.category && (
                <span className="text-sm text-gray-500 font-medium">{selectedProject.category}</span>
              )}
              <h3 className="text-2xl sm:text-3xl font-bold text-black mt-1 mb-4">{selectedProject.title}</h3>
              {selectedProject.description && (
                <p className="text-gray-600 leading-relaxed">{selectedProject.description}</p>
              )}
              <div className="mt-6 pt-6 border-t border-gray-200 flex gap-4">
                <Link
                  href={`/contact?designer=${encodeURIComponent(member.name)}&project=${encodeURIComponent(selectedProject.title)}`}
                  className="flex-1 px-6 py-3 bg-black text-white rounded-lg font-medium text-center hover:bg-gray-800 transition-colors"
                >
                  Get Quote for Similar Project
                </Link>
                <button
                  onClick={closeProjectModal}
                  className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-lg font-medium hover:border-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 p-2 text-white hover:text-gray-300 transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
          {getMediaType(lightboxImage) === 'video' ? (
            <video
              src={lightboxImage}
              className="max-w-full max-h-[90vh] object-contain"
              controls
              autoPlay
              preload="auto"
              playsInline
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <Image
              src={lightboxImage}
              alt="Gallery image"
              width={1200}
              height={1200}
              className="max-w-full max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </div>
      )}
    </>
  );
}
