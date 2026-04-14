'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import BlogPostForm from '../BlogPostForm';
import { createClient } from '@/lib/supabase/client';
import { BlogPost } from '@/lib/supabase/types';

export default function EditBlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        router.push('/admin/dashboard/blog');
        return;
      }

      setPost(data as BlogPost);
      setIsLoading(false);
    };

    fetchPost();
  }, [id, router]);

  if (isLoading || !post) {
    return (
      <div className="text-center py-12">
        <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Loading post...</p>
      </div>
    );
  }

  return <BlogPostForm mode="edit" initialPost={post} />;
}
