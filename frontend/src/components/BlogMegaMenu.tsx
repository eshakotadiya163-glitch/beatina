import { Link } from 'react-router-dom';

const BlogMegaMenu = ({ onClose }: { onClose: () => void }) => {
  const listLayouts = [
    { name: 'List Layout – Left', href: '/blog?layout=list&sidebar=left' },
    { name: 'List Layout – Right', href: '/blog?layout=list&sidebar=right' },
    { name: 'List Item – Standard', href: '/blog?layout=list&style=standard' },
    { name: 'List Item – Overlay', href: '/blog?layout=list&style=overlay' },
    { name: 'List Item – Card', href: '/blog?layout=list&style=card' },
    { name: 'List Item – Traditional', href: '/blog?layout=list&style=traditional' },
    { name: 'List Item – Classic', href: '/blog?layout=list&style=classic' },
  ];

  const gridLayouts = [
    { name: 'Grid Layout – Left', href: '/blog?layout=grid&sidebar=left' },
    { name: 'Grid Layout – Right', href: '/blog?layout=grid&sidebar=right' },
    { name: 'Grid Item – Standard', href: '/blog?layout=grid&style=standard' },
    { name: 'Grid Item – Overlay', href: '/blog?layout=grid&style=overlay' },
    { name: 'Grid Item – Card', href: '/blog?layout=grid&style=card' },
    { name: 'Grid Item – Traditional', href: '/blog?layout=grid&style=traditional' },
    { name: 'Grid Item – Classic', href: '/blog?layout=grid&style=classic' },
  ];

  const articles = [
    { name: 'Image Overlay Title', href: '/blog/1?articleStyle=overlay' },
    { name: 'Title Below Image', href: '/blog/1?articleStyle=title-below' },
    { name: 'Title Above Image', href: '/blog/1?articleStyle=title-above' },
    { name: 'Sidebar – Left', href: '/blog/1?articleStyle=sidebar-left' },
    { name: 'Sidebar – Right', href: '/blog/1?articleStyle=sidebar-right' },
    { name: 'Centered Heading', href: '/blog/1?articleStyle=centered' },
    { name: 'Video Article Layout', href: '/blog/1?articleStyle=video' },
  ];

  return (
    <div 
      className="absolute top-full left-1/2 -translate-x-1/2 w-[1100px] bg-white border border-gray-100 shadow-xl z-[60] cursor-default"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="w-full px-10 py-10">
        <div className="grid grid-cols-4 gap-8">
          
          {/* Column 1: List Layout */}
          <div>
            <h4 className="font-heading text-sm font-semibold text-brand-dark mb-6">List Layout</h4>
            <ul className="flex flex-col gap-4">
              {listLayouts.map((item) => (
                <li key={item.name}>
                  <Link 
                    to={item.href} 
                    onClick={onClose}
                    className="font-body text-[13px] text-gray-500 hover:text-brand-dark transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Grid Layout */}
          <div>
            <h4 className="font-heading text-sm font-semibold text-brand-dark mb-6">Grid Layout</h4>
            <ul className="flex flex-col gap-4">
              {gridLayouts.map((item) => (
                <li key={item.name}>
                  <Link 
                    to={item.href} 
                    onClick={onClose}
                    className="font-body text-[13px] text-gray-500 hover:text-brand-dark transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Article */}
          <div>
            <h4 className="font-heading text-sm font-semibold text-brand-dark mb-6">Article</h4>
            <ul className="flex flex-col gap-4">
              {articles.map((item) => (
                <li key={item.name}>
                  <Link 
                    to={item.href} 
                    onClick={onClose}
                    className="font-body text-[13px] text-gray-500 hover:text-brand-dark transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Promo Image */}
          <div className="flex flex-col">
            <Link to="/shop" onClick={onClose} className="group inline-block w-full">
              <div className="w-full aspect-[4/3] rounded-md overflow-hidden bg-[#2C85A3] flex mb-4 relative">
                <img 
                  src="/images/migrated/52_s2_1512x_98eb4d02-1fb4-4572-912e-640bff0b5a70.jpg" 
                  alt="Promo" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <span className="font-heading text-[11px] font-bold uppercase tracking-widest text-brand-dark border-b-2 border-brand-dark pb-1">
                SHOP NOW
              </span>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BlogMegaMenu;
