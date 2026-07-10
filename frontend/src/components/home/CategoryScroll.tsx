import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';

const CategoryScroll = () => {
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get('/categories');
      return data.filter((c: any) => c.slug !== 'all').slice(0, 8);
    }
  });

  return (
    <section className="bg-white border-b border-[#f5f5f5]">
      <div className="w-full max-w-[1550px] mx-auto">
        {/* Horizontally scrollable row of circular categories */}
        <div className="flex justify-start md:justify-center gap-4 md:gap-14 overflow-x-auto no-scrollbar py-8 md:py-10 px-4 md:px-8">
          {categories.map((cat: any) => (
            <Link
              key={cat.slug}
              to={`/category/${cat.slug}`}
              className="group flex flex-col items-center flex-shrink-0 w-[90px] md:w-[120px]"
            >
              {/* Circular Image with NO border, NO shadow */}
              <div className="relative w-20 h-20 md:w-[110px] md:h-[110px] rounded-full overflow-hidden bg-[#fafafa] mb-4 transition-colors duration-300">
                {cat.image ? (
                   <img
                     src={cat.image}
                     alt={cat.name}
                     className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                     loading="lazy"
                   />
                ) : (
                  <div className="w-full h-full bg-[#f4f4f4]"></div>
                )}
              </div>
              {/* Label: serif font, matching original */}
              <span className="font-heading text-[14px] md:text-[16px] text-[#222222] transition-colors text-center leading-tight">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryScroll;
