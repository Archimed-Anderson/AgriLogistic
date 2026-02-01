import BlogEventsCMS from '@/components/admin/BlogEventsCMS';

export const metadata = {
  title: 'Blog & Events | CMS | AgroDeep',
  description: 'Gérez vos articles, vos événements communautaires et votre médiathèque pour l\'écosystème AgroDeep.',
};

export default function BlogEventsPage() {
  return (
    <div className="h-full">
      <BlogEventsCMS />
    </div>
  );
}
