// *********************
// Role of the component: Section title with breadcrumb
// Name of the component: SectionTitle.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 2.0
// Component call: <SectionTitle title={title} path={path} />
// Input parameters: { title: string; path: string }
// Output: Modern section title with gradient background and breadcrumb
// *********************

import React from 'react'

const SectionTitle = ({ title, path }: { title: string; path: string }) => {
  return (
    <div className='w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden'>
      <div className='max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16'>
        {/* Content */}
        <div className='relative z-10 space-y-6 sm:space-y-8'>
          {/* Breadcrumb / Path */}
          <div className='inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-full border border-blue-400/30 backdrop-blur-sm'>
            <span className='w-2 h-2 bg-blue-400 rounded-full animate-pulse'></span>
            <p className='text-sm sm:text-base text-blue-300 font-medium tracking-wide'>
              {path}
            </p>
          </div>

          {/* Title */}
          <div className='space-y-3'>
            <h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight'>
              <span className='text-white'>
                {title.split(' ').slice(0, -1).join(' ')}
              </span>
              {' '}
              <span className='bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 text-transparent bg-clip-text'>
                {title.split(' ').pop()}
              </span>
            </h1>

            {/* Decorative line */}
            <div className='flex items-center gap-3 pt-2'>
              <div className='w-12 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full'></div>
              <div className='w-2 h-2 bg-blue-400 rounded-full'></div>
            </div>
          </div>

          {/* Optional description or CTA */}
          <p className='text-gray-300 text-sm sm:text-base max-w-2xl leading-relaxed'>
            اكتشف مجموعتنا الحصرية من المنتجات العالية الجودة المصممة لتلبية احتياجاتك
          </p>
        </div>
      </div>
    </div>
  )
}

export default SectionTitle